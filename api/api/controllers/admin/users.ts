import Joi from "joi";
import { RequestWithUser } from "../../middleware/auth";
import bcrypt from "bcrypt";
import prisma from "@property-finder/database";
import { Response } from "express";
import handleExcpetions from "../../../utils/errors";
const userSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(30),
  admin: Joi.boolean(),
});
const USERS_PER_PAGE = 20;
export const getUsersCounts = async (req: RequestWithUser, res: Response) => {
  try {
    const [_count, verified_users_count] = await Promise.all([
      await prisma.user.count(),
      await prisma.user.count({
        where: {
          verified: true,
        },
      }),
    ]);
    return res.status(200).json({
      _count,
      verified_users_count,
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const searchUsers = async (req: RequestWithUser, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const { search }: any = req.query ? req.query : "";
  try {
    let whereCondition = {};
    if (search && search !== "")
      whereCondition = {
        OR: [
          {
            id: {
              equals: parseInt(search) > 0 ? parseInt(search) : 0,
            },
          },
          {
            email: {
              equals: search,
            },
          },
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
        ],
      };
    const [users, count] = await Promise.all([
      await prisma.user.findMany({
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
        where: whereCondition,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          admin: true,
        },
      }),
      await prisma.user.count({
        where: whereCondition,
      }),
    ]);
    return res.json({ users, _count: count }).status(200);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const deleteUser = async (req: RequestWithUser, res: Response) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const { userId } = req.params;
    const user = await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });
    return res.status(200).json({
      user,
      message: req.i18n.t("USER.DELETED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const updateUser = async (req: RequestWithUser, res: Response) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const { userId } = req.params;
    const user = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },

      data: value,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        admin: true,
      },
    });
    return res.status(200).json({
      user,
      message: req.i18n.t("USER.UPDATED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const addType = async (req: RequestWithUser, res: Response) => {
  try {
    const { name } = req.body;
    const type = await prisma.propertyType.create({
      data: {
        name,
      },
    });
    return res.status(200).json({
      type,
      message: req.i18n.t("POST.TYPE.CREATE.SUCCESS"),
    });
  } catch (e: any) {
    e.userMessage = req.i18n.t("POST.TYPE.CREATE.ERROR");
    handleExcpetions(e, req, res);
  }
};
export const updateType = async (req: RequestWithUser, res: Response) => {
  try {
    const { name } = req.body;
    const { typeId } = req.params;
    const type = await prisma.propertyType.update({
      where: {
        id: parseInt(typeId),
      },
      data: {
        name,
      },
    });
    return res.status(200).json({
      type,
      message: req.i18n.t("POST.TYPE.UPDATE.SUCCESS"),
    });
  } catch (e: any) {
    e.userMessage = req.i18n.t("POST.TYPE.UPDATE.ERROR");
    handleExcpetions(e, req, res);
  }
};
export const deleteType = async (req: RequestWithUser, res: Response) => {
  try {
    const { typeId } = req.params;
    await prisma.propertyType.delete({
      where: {
        id: parseInt(typeId),
      },
    });
    return res.status(200).json({
      message: req.i18n.t("POST.TYPE.DELETE.SUCCESS"),
    });
  } catch (e: any) {
    e.userMessage = req.i18n.t("POST.TYPE.DELETE.ERROR");
    handleExcpetions(e, req, res);
  }
};
