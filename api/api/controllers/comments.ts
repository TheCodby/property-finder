import { Request, Response } from "express";
import handleExcpetions from "../../utils/errors";
import prisma from "@property-finder/database";
import { RequestWithUser } from "../middleware/auth";
import Joi from "joi";
const LIMIT_COMMENTS_PER_PAGE = 10;
export const getComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.params;
    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
      skip: (page - 1) * LIMIT_COMMENTS_PER_PAGE,
      take: LIMIT_COMMENTS_PER_PAGE,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    const commentCount = await prisma.comment.count({
      where: {
        postId: parseInt(postId),
      },
    });
    return res.json({ comments: comments, _count: commentCount });
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
export const addComment = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  const { error, value } = Joi.object({
    comment: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newComment = await prisma.comment.create({
      data: {
        post: {
          connect: {
            id: parseInt(req.params.postId),
          },
        },
        user: {
          connect: {
            id: req.user.id,
          },
        },
        comment: req.body.comment,
      },
    });
    const commentCount = await prisma.comment.count({
      where: {
        postId: parseInt(req.params.postId),
      },
    });
    return res.json({
      message: req.i18n.t("COMMENT.CREATE.SUCCESS"),
      comment: newComment,
      _count: commentCount,
    });
  } catch (error: any) {
    handleExcpetions(error, req, res);
  }
};
