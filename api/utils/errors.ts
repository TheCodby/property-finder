import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import KnownError from "./KnownError";
import logger from "./logger";
import { ValidationError } from "joi";
const handleExcpetions = (error: any, req: Request, res: Response) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  } else if (error instanceof KnownError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error.code === "P2003") {
    return res.status(400).json({
      message: `${req.i18n.t("INVALID")} ${error.meta.field_name.replace(
        "_",
        " "
      )}`,
    });
  } else if (error.code === "P2025") {
    return res.status(400).json({ message: req.i18n.t("NOT_FOUND") });
  } else if (error.code === "P2014") {
    return res.status(400).json({ message: req.i18n.t("CAN_NOT_DO_ACTION") });
  } else if (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      parseInt(error.code.replace("P", "")) > 1000 &&
      parseInt(error.code.replace("P", "")) < 1010)
  ) {
    logger.error(error.stack);
    return res.status(503).json({
      message: req.i18n.t("COULD_NOT_CONNECT_TO_DB"),
    });
  }
  logger.error(error.stack);
  return res.status(500).json({
    message: error.userMessage ?? req.i18n.t("SOMETHING_WENT_WRONG"),
  });
};

export default handleExcpetions;
