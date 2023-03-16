import { Response } from "express";
import Joi from "joi";
import prisma from "@property-finder/database";
import handleExcpetions from "../../utils/errors";
import { RequestWithUser } from "../middleware/auth";
import bcrypt from "bcrypt";
import KnownError from "../../utils/KnownError";

export const updateName = async (req: RequestWithUser, res: Response) => {
  const { error, value } = Joi.object({
    firstName: Joi.string().required(),
    last_name: Joi.string().required(),
  }).validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const userId = req.user.id;
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: value,
    });
    return res.status(200).json({
      message: req.i18n.t("USER.UPDATED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const updateEmail = async (req: RequestWithUser, res: Response) => {
  const { error, value } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const checkedUser: number = await prisma.user.count({
      where: {
        OR: [{ email: req.body.email }],
      },
    });

    if (checkedUser > 0) {
      throw new KnownError(
        req.i18n.t("USED_BEFORE", { fieldName: "email" }),
        409
      );
    }
    const userId = req.user.id;
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: value,
    });
    return res.status(200).json({
      message: req.i18n.t("USER.UPDATED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const updatePassword = async (req: RequestWithUser, res: Response) => {
  const { error } = Joi.object({
    password: Joi.string().min(6).max(30).required(),
    confirm_password: Joi.string()
      .equal(Joi.ref("password"))
      .messages({ "any.only": req.i18n.t("PASSWORD_NOT_MATCH") })
      .required(),
  }).validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const userId = req.user.id;
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: req.body.password,
    });
    return res.status(200).json({
      message: req.i18n.t("USER.UPDATED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const getSession = async (req: RequestWithUser, res: Response) => {
  return res.status(200).json(req.user);
};
