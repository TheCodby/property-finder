import { NextPage } from "next";
import { notFound } from "next/navigation";
import PostsWithAttachments from "../../types/post";
import PostBox from "../components/posts/post-box";
import Pagination from "../components/ui/pagination";
export const revalidate = 0;
const ITEMS_PER_PAGE = 10;
const getPosts = async (page: number) => {
  const res = await fetch(`http://127.0.0.1:4000/posts?page=${page}`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) return null;
  return res.json();
};
// @ts-expect-error
const PostsPage: NextPage = async ({ searchParams }) => {
  const currentPage = searchParams?.page ? parseInt(searchParams?.page) : 1;
  const data: { posts: PostsWithAttachments[]; _count: number } =
    await getPosts(currentPage);
  if (!data || !data?.posts || data.posts.length == 0) {
    notFound();
  }
  return (
    <div className="flex flex-row px-10 my-6">
      <div className="flex flex-col basis-2/3 gap-10">
        {data?.posts?.map((post: PostsWithAttachments) => (
          <PostBox key={post.slug} post={post} />
        ))}
        <div className="flex flex-row justify-center gap-6">
          <Pagination
            count={data._count}
            items_per_page={ITEMS_PER_PAGE}
            link={`/posts?`}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
