import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostsWithAttachments from "../../../types/post";
type Props = {
  post: PostsWithAttachments;
};
const PostBox: React.FC<Props> = ({ post }) => {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="flex flex-row bg-white shadow-md gap-4 w-full">
        <div className="flex flex-col gap-4 basis-2/3 p-4">
          <p className="text-2xl font-bold">{post.title}</p>
          <p className="text-md">
            {post.description.length >= 256
              ? post.description.slice(0, 256) + "..."
              : post.description}
          </p>
        </div>
        <div className="basis-1/3 relative">
          {post.attachments.length > 0 ? (
            <Image
              src={`https://property-finderf.s3.amazonaws.com/${post.attachments[0].key}`}
              style={{ objectFit: "cover" }}
              fill
              alt=""
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default PostBox;
