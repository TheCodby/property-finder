"use client";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { COMMENTS_PER_PAGE } from "@/constants";
import { useNotifs } from "@/stores/notifs";
import LoadingButton from "../../../../components/ui/loading-button";
import { pageN } from "./comments-list";
const AddComment: React.FC<{ postId: number }> = ({ postId }) => {
  const setPageNow = useSetRecoilState<any>(pageN);
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();
  const { add: addNotification } = useNotifs();

  const mutation = useMutation(
    async ({ commentText }: { commentText: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            authorization: getCookie("token") as any,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentText }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    }
  );
  const sendComment = async () => {
    mutation.mutate(
      { commentText: comment },
      {
        onSuccess: (data) => {
          const pageNow = Math.ceil(data._count / COMMENTS_PER_PAGE);
          queryClient.refetchQueries(["comments", postId, pageNow]);
          setPageNow(pageNow);
          setComment("");
        },
        onError(error: any) {
          addNotification(error?.message, "error");
        },
      }
    );
  };
  return (
    <>
      <textarea
        onChange={(e) => setComment(e.target.value)}
        className="bg-white"
        rows={5}
        placeholder="أضف تعليقك هنا..."
        value={comment}
      ></textarea>
      <div className="flex justify-center">
        <button
          disabled={mutation.isLoading || comment === ""}
          onClick={sendComment}
        >
          {mutation.isLoading ? <LoadingButton /> : "إرسال التعليق"}
        </button>
      </div>
    </>
  );
};

export default AddComment;
