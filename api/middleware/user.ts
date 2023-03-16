import { NextFunction, Request, Response } from "express";
import handleExcpetions from "../../utils/errors";
import prisma from "@property-finder/database";

export const userExists = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(404).json({ message: req.i18n.t("USER.NOT_FOUND") });
    }
    next();
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
