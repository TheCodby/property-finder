"use client";
import Link from "next/link";
import React from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useNotifs } from "@/stores/notifs";
import { getCookie, setCookie } from "cookies-next";
import { useQuery } from "react-query";
const fetchSession = async () => {
  if (!getCookie("token")) return false;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/user/session`, {
    headers: {
      authorization: getCookie("token") as string,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};
const Header: React.FC = () => {
  const { add: addNotification } = useNotifs();
  const {
    isLoading,
    error,
    data: user,
  } = useQuery("session", fetchSession, { refetchOnWindowFocus: false });
  const logout = () => {
    setCookie("token", "", { maxAge: 0 });
    localStorage.removeItem("refresh_token");
    addNotification("تم تسجيل الخروج بنجاح", "success");
    window.location.replace("/");
  };
  return (
    <div className="flex flex-row px-10 items-center justify-between h-16">
      <div className="flex">
        <Link className="text-3xl font-bold" href="/">
          عقار
        </Link>
      </div>
      <div className="lg:flex flex-row gap-x-10 hidden">
        <Link href="/posts?page=1" className="font-semibold">
          <AiOutlineSearch />
          تصفح
        </Link>
        {error ? (
          <p className="text-red-900 font-bold">{`Can't`} fetch user data</p>
        ) : isLoading ? (
          <>
            <div className="animate-pulse flex space-x-4 h-4 w-24 bg-gray-300 rounded-full"></div>
            <div className="animate-pulse flex space-x-4 h-4 w-16 bg-gray-300 rounded-full"></div>
          </>
        ) : !user ? (
          <>
            <Link href="/auth/login" className="font-semibold">
              <AiOutlineLogin />
              دخول
            </Link>
            <Link href="/auth/sign-up" className="font-semibold">
              <AiOutlineUser />
              تسجيل
            </Link>
          </>
        ) : (
          <>
            <Link href="/new-post" className="font-semibold">
              <AiOutlineAppstoreAdd />
              إضافة
            </Link>
            {user.admin ? (
              <Link href="/admin/dashboard" className="font-semibold">
                <MdOutlineAdminPanelSettings />
                لوحة التحكم
              </Link>
            ) : null}
            {/* <a className="font-semibold inline-flex gap-x-1 items-center">
              <AiOutlineUser />
              {user?.get("first_name")}
            </a> */}
            <Link href="#" onClick={logout} className="font-semibold">
              <AiOutlineLogout />
              خروج
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Header;
