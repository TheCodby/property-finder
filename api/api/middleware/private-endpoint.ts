import { NextFunction, Request, Response } from "express";

export const privateEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;
  if (token !== process.env.PRIVATE_TOKEN) {
    return res.status(404).send("Not Found");
  }
  next();
};
