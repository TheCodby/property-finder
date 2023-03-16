import { Request, Response } from "express";
import prisma from "@property-finder/database";
import Joi from "joi";
import { RequestWithUser } from "../middleware/auth";
import handleExcpetions from "../../utils/errors";
import KnownError from "../../utils/KnownError";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../utils/aws/s3";
import { randomUUID } from "crypto";
const LIMIT_PER_PAGE = 10;
export const deletePost = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { postSlug } = req.params;
    await prisma.post.delete({
      where: {
        slug: postSlug,
      },
    });
    return res.json({ message: req.i18n.t("POST.DELETED") });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const createPost = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  const { error, value } = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    area: Joi.number().required(),
    rooms: Joi.number().required(),
    floor: Joi.number().required(),
    bathrooms: Joi.number().required(),
    streetArea: Joi.number().required(),
    location: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required(),
    }).required(),
    typeId: Joi.number().required(),
    price: Joi.number().required(),
    images: Joi.array().items(Joi.string()),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const {
      title,
      description,
      area,
      rooms,
      floor,
      bathrooms,
      streetArea,
      location,
      typeId,
      price,
    } = value;
    const post = await prisma.post.create({
      data: {
        title,
        description,
        slug: "",
        area,
        rooms,
        price,
        floor,
        bathrooms,
        streetArea,
        userId: req.user.id,
        lat: parseFloat(location.lat),
        long: parseFloat(location.long),
        typeId,
      },
    });
    if (post) {
      // Upload Images to S3 Bucket
      const headerRegex = /^data:image\/(png|jpeg|jpg);base64,/;
      for (let image of req.body.images) {
        if (!image || !headerRegex.test(image)) {
          continue;
        }
        try {
          const binaryData = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          const command = new PutObjectCommand({
            Bucket: "property-finderf",
            Key: randomUUID() + ".jpg",
            Body: binaryData,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
          });
          await s3Client.send(command);
          await prisma.attachment.create({
            data: {
              key: command.input.Key as string,
              postId: post.id,
            },
          });
        } catch (error: any) {
          handleExcpetions(error, req, res);
        }
      }
      return res
        .json({
          message: req.i18n.t("POST.CREATED"),
          postSlug: post.slug,
        })
        .status(200);
    }
  } catch (e: any) {
    e.userMessage = req.i18n.t("POST.CREATE_ERROR");
    handleExcpetions(e, req, res);
  }
};

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const posts = await prisma.post.findMany({
      where: {
        deleted: false,
      },
      skip: (page - 1) * LIMIT_PER_PAGE,
      take: LIMIT_PER_PAGE,
      include: {
        attachments: true,
      },
    });
    const postsCount = await prisma.post.count({
      where: {
        deleted: false,
      },
    });
    return res.json({ posts: posts, _count: postsCount });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const getPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postSlug } = req.params;
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        deleted: false,
      },
      include: {
        type: {
          select: { name: true },
        },
        attachments: true,
      },
    });
    if (!post) {
      throw new KnownError(req.i18n.t("POST.NOT_FOUND"), 404);
    }
    return res.json(post);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const getAllPostsSlugs = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
      },
    });
    return res.json(posts);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const getTypes = async (req: Request, res: Response): Promise<any> => {
  try {
    const types = await prisma.propertyType.findMany();
    return res.json(types);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const updatePost = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  const { error, value } = Joi.object({
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
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { postSlug } = req.params;
    const {
      title,
      description,
      area,
      rooms,
      floor,
      bathrooms,
      streetArea,
      location,
      price,
      typeId,
    } = value;
    const post = await prisma.post.update({
      where: {
        slug: postSlug,
      },
      data: {
        title,
        description,
        area,
        rooms,
        floor,
        bathrooms,
        streetArea,
        lat: parseFloat(location.lat),
        long: parseFloat(location.long),
        typeId,
        price,
      },
    });
    return res.json(post);
  } catch (e: any) {
    e.userMessage = req.i18n.t("POST.UPDATE_ERROR");
    handleExcpetions(e, req, res);
  }
};
