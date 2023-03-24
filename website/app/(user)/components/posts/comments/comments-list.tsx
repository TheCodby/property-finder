"use client";
import React, { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import Pagination from "../../../../components/ui/pagination";
import Comment from ".";
import CommentSkelton from "./skelton";
import { atom, useRecoilState } from "recoil";
import { COMMENTS_PER_PAGE } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export const pageN = atom({
  key: "pageNow",
  default: 1,
});
const fetchComments = (postId: number = 1, page: number) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API_LINK}/posts/${postId}/comments?page=${page}`
  ).then((res) => res.json());

const Comments: React.FC<{
  postId: number;
  postSlug: string;
  page: number;
}> = ({ postId, postSlug, page }) => {
  const [pageNow, setPageNow] = useRecoilState(pageN);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    setPageNow(page);
  }, []);
  const { isLoading, error, data, isFetching } = useQuery(
    ["comments", postId, pageNow],
    async () => {
      const data = fetchComments(postId, pageNow);
      return data;
    },
    { refetchOnWindowFocus: false }
  );
  if (isLoading || isFetching)
    return (
      <div className="flex flex-col gap-4 basis-2/3 mb-3">
        <CommentSkelton />
        <CommentSkelton />
        <CommentSkelton />
        <CommentSkelton />
      </div>
    );
  if (error) return <p>Error...</p>;
  const changePage = async (newPage: number) => {
    router.push(`${pathname}?comments_page=${newPage}`);
    setPageNow(newPage);
  };
  return (
    <div className="flex flex-col gap-4 basis-2/3 mb-3">
      {data.comments.length === 0 ? (
        <p className="text-center text-3xl">لا يوجد تعليقات</p>
      ) : (
        data.comments.map((comment: any) => (
          <Comment key={comment.id} comment={comment} />
        ))
      )}
      <div className="flex flex-row justify-center gap-6">
        <Pagination
          count={data._count}
          link={`/posts/${postSlug}?comments_`}
          items_per_page={COMMENTS_PER_PAGE}
          currentPage={pageNow}
          changePage={changePage}
        />
      </div>
    </div>
  );
};

export default Comments;
