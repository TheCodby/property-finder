import prisma from "@property-finder/database";
import { Request, Response } from "express";
import handleExcpetions from "../../../utils/errors";

export const getGeneralReports = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const getTypesCount = new Promise(async (resolve, reject) => {
      try {
        const response: any =
          await prisma.$queryRaw`SELECT pt.name, CAST(COUNT(*) as CHAR) as count FROM posts p JOIN property_types pt ON pt.id = p.type_id GROUP BY pt.name;`;
        const data = response.reduce((acc: any, item: any) => {
          acc[item.name] = parseInt(item.count);
          return acc;
        }, {});
        resolve(data);
      } catch (e: any) {
        reject(e);
      }
    });
    const [
      usersCount,
      postsCount,
      commentsCount,
      newUsersCount,
      newPostsCount,
      typeCount,
    ]: any = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(today),
          },
        },
      }),
      prisma.post.count({
        where: {
          createdAt: {
            gte: new Date(today),
          },
        },
      }),
      getTypesCount,
    ]);
    return res.status(200).json({
      users: usersCount,
      posts: postsCount,
      comments: commentsCount,
      new_users: newUsersCount,
      new_posts: newPostsCount,
      types_count: typeCount,
    });
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
