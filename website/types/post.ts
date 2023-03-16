import { Prisma } from "@prisma/client";
type PostsWithAttachments = Prisma.PostGetPayload<{
  include: {
    attachments: true;
  };
}>;
export default PostsWithAttachments;
