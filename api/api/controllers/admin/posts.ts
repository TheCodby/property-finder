import Joi from "joi";
import { RequestWithUser } from "../../middleware/auth";
import bcrypt from "bcrypt";
import prisma from "@property-finder/database";
import { Response } from "express";
import handleExcpetions from "../../../utils/errors";
const postSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  area: Joi.number(),
  rooms: Joi.number(),
  floor: Joi.number(),
  bathrooms: Joi.number(),
  streetArea: Joi.number(),
  location: Joi.object({
    lat: Joi.number(),
    long: Joi.number(),
  }),
  typeId: Joi.number(),
  price: Joi.number(),
});
export const updatePost = async (req: RequestWithUser, res: Response) => {
  const { error, value } = postSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const { userId } = req.params;
    const user = await prisma.post.update({
      where: {
        id: parseInt(userId),
      },

      data: value,
    });
    return res.status(200).json({
      user,
      message: req.i18n.t("POST.UPDATED"),
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
