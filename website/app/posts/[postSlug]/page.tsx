import { NextPage } from "next";
import { notFound } from "next/navigation";
import Carousel from "../../components/ui/carousel";
import Map from "../../components/Map";
import Link from "next/link";
import Comments from "../../components/posts/comments/comments-list";
import AddComment from "../../components/posts/comments/add-comment";
import { getSession } from "../../../utils/server/user";
const getPost = async (slug: string) => {
  const res = await fetch(`${process.env.API_LINK}/posts/${slug}`, {
    next: {
      revalidate: 10,
    },
  });
  if (!res.ok) return undefined;
  return res.json();
};
export async function generateMetadata({ params }: any) {
  const post = await getPost(params.postSlug);
  if (!post?.id) {
    return {};
  }
  return { title: post.title };
}
// @ts-expect-error
const PostPage: NextPage<{
  params: { postSlug: string };
  searchParams: { comments_page: string };
}> = async ({ params, searchParams }) => {
  const post = await getPost(params.postSlug);
  if (!post?.id) {
    notFound();
  }
  const currentPage = searchParams?.comments_page
    ? parseInt(searchParams?.comments_page)
    : 1;
  const session = await getSession();
  return (
    <>
      {post.attachments.length >= 1 ? (
        <Carousel images={post.attachments} />
      ) : null}
      <div className="px-10 my-4 flex flex-col gap-4">
        <p className="font-semibold text-2xl">{post.title}</p>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:basis-2/3">
            <div className="card flex flex-col gap-4 text-start min-h-[50%]">
              <p className="text-lg">{post.description}</p>
            </div>
          </div>
          <div className="lg:basis-1/3 w-full">
            <Map
              location={{ lat: post.lat, lng: post.long }}
              style={{ height: "calc(60vh - 4rem)" }}
              className="shadow-lg rounded-2xl overflow-hidden"
            >
              <div className="z-10 absolute w-full bottom-4 flex justify-center">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://maps.google.com/?q=${post.lat},${post.long}`}
                >
                  <button>Show on google maps</button>
                </Link>
              </div>
            </Map>
          </div>
        </div>
        <p className="font-semibold text-2xl mt-4">المواصفات</p>
        <div className="grid grid-cols-3 text-center items-center justify-center content-center card p-0 gap-0 overflow-hidden mb-4">
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">النوع</p>
            <p className="font-bold text-2xl text-emerald-700">
              {post.type.name}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">الغرف</p>
            <p className="font-bold text-2xl text-emerald-700">{post.rooms}</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">دورات المياه</p>
            <p className="font-bold text-2xl text-emerald-700">
              {post.bathrooms}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">المساحة</p>
            <p className="font-bold text-2xl text-emerald-700">
              {post.area} متر
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">مساحة الشارع</p>
            <p className="font-bold text-2xl text-emerald-700">
              {post.streetArea} متر
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4 bg-white border-2 border-slate-100">
            <p className="font-medium text-md text-black">الطابق</p>
            <p className="font-bold text-2xl text-emerald-700">{post.floor}</p>
          </div>
        </div>
        <p className="font-semibold text-2xl">التعليقات</p>
        <div className="flex gap-4 justify-center">
          <Comments postId={post.id} page={currentPage} postSlug={post.slug} />
        </div>
        {session?.id ? (
          <>
            <p className="font-semibold text-2xl mt-3">إضافة تعليق</p>
            <AddComment postId={post.id} />
          </>
        ) : null}
      </div>
    </>
  );
};

export default PostPage;
