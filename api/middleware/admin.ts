import { NextFunction, Response } from "express";
import prisma from "@property-finder/database";
import { RequestWithUser } from "./auth";

export const admin = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.user.id),
      },
    });
    if (!user?.admin) {
      return res.status(401).json({ message: req.i18n.t("UNAUTHORIZED") });
    }
    next();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: req.i18n.t("SOMETHING_WENT_WRONG") });
  }
};
