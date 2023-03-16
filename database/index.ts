import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model == "Post") {
    if (params.action === "create") {
      let {
        args: { data },
      } = params;
      data.slug =
        data.title.replace(/\s/g, "-").toLowerCase() +
        "-" +
        Date.now().toString();
    }
  }
  const result = await next(params);
  return result;
});
// soft delete posts
prisma.$use(async (params, next) => {
  if (params.model == "Post") {
    if (params.action == "delete") {
      params.action = "update";
      params.args["data"] = { deleted: true };
    }
    if (params.action == "deleteMany") {
      params.action = "updateMany";
      if (params.args.data != undefined) {
        params.args.data["deleted"] = true;
      } else {
        params.args["data"] = { deleted: true };
      }
    }
  }
  return next(params);
});
export default prisma;
