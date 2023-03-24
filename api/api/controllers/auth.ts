// Types
import { Request, Response } from "express";
import { User } from "@prisma/client";
import prisma from "@property-finder/database";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Joi from "joi";
import handleExcpetions from "../../utils/errors";
import KnownError from "../../utils/KnownError";
import { RequestWithUser } from "../middleware/auth";
import { getUserById } from "../../utils/user";
import { getConfigOption } from "../../utils/config";
const sgMail = require("@sendgrid/mail");
function generateVerificationCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let verificationCode = "";
  for (let i = 0; i < length; i++) {
    verificationCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return verificationCode;
}
const validatorSchema: Joi.Schema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
});
export const signIn = async (req: Request, res: Response): Promise<any> => {
  const signInSchema: Joi.Schema = validatorSchema.concat(
    Joi.object({
      deviceId: Joi.string().guid(),
    })
  );
  const { error, value } = signInSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { password, email } = value;
    const user: User | null = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new KnownError(req.i18n.t("SIGN_IN.INVALID_CREDENTIALS"), 401);
    }

    const matchedPassword: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!matchedPassword) {
      throw new KnownError(req.i18n.t("SIGN_IN.INVALID_CREDENTIALS"), 401);
    }
    const refreshToken: string = crypto.randomBytes(32).toString("base64");
    let deviceId: string = value["deviceId"];
    if (!deviceId) deviceId = crypto.randomUUID();
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    const expiresAt: Date = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await prisma.refreshToken.deleteMany({
      where: {
        deviceId,
      },
    });
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefreshToken,
        expiresAt,
        deviceId,
      },
    });
    const token: any = jwt.sign(
      {
        id: user.id,
        email: user.email,
        verified: user.verified,
        first_name: user.firstName,
        last_name: user.lastName,
        deviceId,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    const decodedToken = jwt.decode(token);
    return res.status(200).json({
      message: req.i18n.t("SIGN_IN.SUCCESS"),
      token: token,
      refresh_token: refreshToken,
      user: decodedToken,
    });
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
export const signUp = async (req: Request, res: Response): Promise<any> => {
  const signUpSchema = validatorSchema.concat(
    Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    })
  );
  const { error, value } = signUpSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { password, email, firstName, lastName } = value;
  try {
    const checkedUser: number = await prisma.user.count({
      where: {
        email,
      },
    });

    if (checkedUser > 0) {
      throw new KnownError(req.i18n.t("SIGN_UP.USER_ALREADY_EXISTS"), 409);
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const createdUser: User = await prisma.user.create({
      data: {
        verified: (await getConfigOption("VERIFYING_EMAILS")) === "false",
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    let message = req.i18n.t("SIGN_UP.ACCOUNT_CREATED");
    return res
      .json({
        user_id: createdUser.id,
        message: message,
      })
      .status(200);
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
export const sendVerificationEmail = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const user = await getUserById(req.user.id);
    // Check if user has already verified his email before two minutes
    const lastEmailVerification: { createdAt: Date } | null =
      await prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      });
    if (lastEmailVerification) {
      const now: Date = new Date();
      const diff: number =
        now.getTime() - lastEmailVerification.createdAt.getTime();
      if (diff < 2 * 60 * 1000) {
        throw new KnownError(req.i18n.t("EMAIL_VERIFICATION.TOO_EARLY"), 400);
      }
    }
    if (user.verified) {
      throw new KnownError(req.i18n.t("User Verified Already"), 400);
    }
    const emailVerificationToken: string = generateVerificationCode(128);
    const msg = {
      to: user.email,
      from: await getConfigOption("SENDGRID_EMAIL"),
      subject: "Verify your account, " + user.firstName,
      templateId: "d-9e47e1660b3c4c17bd96c2c7fc03dd2a",
      dynamicTemplateData: {
        name: user.firstName + " " + user.lastName,
        url: process.env.WEBSITE + "/verify?token=" + emailVerificationToken,
      },
    };
    await prisma.emailVerificationToken.deleteMany({
      where: {
        userId: user.id,
      },
    });
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: emailVerificationToken,
        expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      },
    });
    sgMail.setApiKey(await getConfigOption("SENDGRID_API_KEY"));
    await sgMail.send(msg);
    return res.status(200).json({
      message: req.i18n.t("EMAIL_VERIFICATION.EMAIL_SENT"),
    });
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.params;
  try {
    const emailVerificationToken =
      await prisma.emailVerificationToken.findFirst({
        where: {
          token,
        },
      });
    if (!emailVerificationToken) {
      throw new KnownError(req.i18n.t("EMAIL_VERIFICATION.INVALID_TOKEN"), 400);
    }
    if (emailVerificationToken.expires < new Date()) {
      throw new KnownError(req.i18n.t("EMAIL_VERIFICATION.TOKEN_EXPIRED"), 400);
    }
    await prisma.user.update({
      where: {
        id: emailVerificationToken.userId,
      },
      data: {
        verified: true,
      },
    });
    await prisma.emailVerificationToken.delete({
      where: {
        token: emailVerificationToken.token,
      },
    });
    return res.status(200).json({
      message: req.i18n.t("EMAIL_VERIFICATION.VERIFIED"),
    });
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
