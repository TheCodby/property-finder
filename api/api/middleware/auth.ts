import { NextFunction, Request, Response } from "express";
let jwt = require("jsonwebtoken");
export interface RequestWithUser extends Request {
  user?: any;
}
const authorized = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token === undefined || !token || token === "undefined")
    return res.status(401).send({ message: req.i18n.t("UNAUTHORIZED") });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e: any) {
    console.log(e);
    res.status(401).send({ message: req.i18n.t("UNAUTHORIZED") });
  }
};
export default authorized;
