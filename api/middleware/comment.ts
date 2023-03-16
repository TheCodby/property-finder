import { NextFunction, Response } from "express";
import prisma from "../../services/api/prisma/prisma";
import { RequestWithUser } from "./auth";
export const postExist = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    await prisma.post.findUniqueOrThrow({
      where: {
        id: parseInt(postId),
      },
    });
    next();
  } catch (error: any) {
    return res.status(404).json({ message: req.i18n.t("POST.NOT_FOUND") });
  }
};
export const author = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(postId),
        userId: req.user.id,
      },
    });
    if (post?.userId !== req.user.id) {
      const isAdmin = await prisma.user.findFirst({
        where: {
          id: req.user.id,
          admin: true,
        },
      });
      if (!isAdmin) {
        return res.status(401).json({ message: req.i18n.t("UNAUTHORIZED") });
      }
    }
    next();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: req.i18n.t("SOMETHING_WENT_WRONG") });
  }
};
