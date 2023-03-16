"use client";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import ActivateEmail from "../components/verify/activate-email";
import { getUserData } from "../../utils/user";
const VerifyPage = ({ _, searchParams }: any) => {
  const [fetchPosts, setFetchPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoading, error, data }: any = useQuery<any>(
    "verify-email",
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/auth/verify-email/${searchParams.token}`,
        {
          headers: {
            authorization: getCookie("token") as string,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setCookie("token", "", { maxAge: 0 });
      setTimeout(() => window.location.replace("/auth/login"), 5000);
      data.message += "\n سيتم تحويلك لصفحة تسجيل الدخول خلال خمس ثواني";
      return data;
    },
    { enabled: fetchPosts, refetchOnWindowFocus: false, retry: 0 }
  );
  useEffect(() => {
    const userData: any = getUserData();
    if (userData?.verified) {
      router.push(`/`);
    }
    if (searchParams.token) {
      setFetchPosts(true);
    }
    setLoading(false);
  }, []);
  return (
    <>
      <div className="flex flex-col w-full h-[70vh] justify-center items-center">
        {error ? (
          <p className="text-2xl font-bold">{error?.message}</p>
        ) : data ? (
          <p className="text-2xl font-bold">{data?.message}</p>
        ) : loading || isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                تفعيل الحساب
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                من فضلك إختر الطريقة المناسبة لك:
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <ActivateEmail />
              <button
                disabled={true}
                className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-center w-full disabled:bg-gray-300"
              >
                <span className="text-lg text-center font-medium text-gray-900">
                  تفعيل عبر الرسائل النصية
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VerifyPage;
