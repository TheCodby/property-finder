"use client";
import ErrorBox from "@/app/components/ui/error-box";
import Pagination from "@/app/components/ui/pagination";
import Skelton from "@/app/components/ui/skelton";
import SkeltonRow from "@/app/components/ui/skelton-row";
import { getCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { FiUsers } from "react-icons/fi";
import { GoVerified } from "react-icons/go";
import { useQueries } from "react-query";
import StatisticCard from "../components/ui/statistic-card";

const UsersPage = () => {
  const router = useRouter();
  const searchText = useSearchParams()!.get("search") || "";
  const [searchInputValue, setSearchInputValue] = useState<string>(searchText);
  const pageNow = useSearchParams()?.get("page");
  const page: number = pageNow ? parseInt(pageNow) : 1;
  const results: any = useQueries([
    {
      queryKey: ["users-counts"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_LINK}/admin/users/counts`,
          {
            headers: {
              authorization: getCookie("token") as string,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      },
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["users", page, searchText],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_LINK}/admin/users?page=${page}${
            searchText && searchText !== "" ? `&search=${searchText}` : ""
          }`,
          {
            headers: {
              authorization: getCookie("token") as string,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      },
      refetchOnWindowFocus: false,
    },
  ]);
  const changePage = (page: number) => {
    router.push(
      `/admin/users?${
        searchText && searchText !== "" ? `search=${searchText}&` : ""
      }page=${page}`
    );
  };
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-semibold">الإحصائيات</p>
      <div className="grid md:grid-cols-4 gap-6">
        {results[0].isLoading ? (
          <>
            <Skelton />
            <Skelton />
            <Skelton />
            <Skelton />
          </>
        ) : results[0].isError ? (
          <ErrorBox error={results[0].error.message} />
        ) : (
          <>
            <StatisticCard
              name="المستخدمون المسجلون"
              number={results[0].isLoading ? 0 : results[0].data._count}
              icon={<FiUsers />}
            />
            <StatisticCard
              name="المستخدمون النشطون"
              number={
                results[0].isLoading ? 0 : results[0].data.verified_users_count
              }
              icon={<GoVerified />}
            />
          </>
        )}
      </div>
      <p className="text-2xl font-semibold">المستخدمون</p>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              `/admin/users?${
                searchInputValue ? `search=${searchInputValue}` : ""
              }`
            );
          }}
          className="flex flex-row gap-6 items-center"
        >
          <input
            className="w-1/3 bg-white hover:bg-slate-100"
            placeholder="البحث بالإسم أو البريد الإلكتروني"
            defaultValue={searchInputValue}
            onChange={(e) => {
              e.preventDefault();
              setSearchInputValue(e.target.value);
            }}
          />
          <button type="submit" className="bg-emerald-600">
            بحث
          </button>
        </form>
      </div>
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto">
        <table
          className="table-auto whitespace-no-wrap min-w-full divide-y divide-gray-200 bg-emerald-900 rounded-3xl overflow-hidden shadow-sm"
          dir="ltr"
        >
          <thead>
            <tr className="text-white">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                الإسم
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                الرتبة
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results[1].isLoading ? (
              <>
                <SkeltonRow />
                <SkeltonRow />
                <SkeltonRow />
              </>
            ) : results[1].isError ? (
              <ErrorBox error={results[1].error.message} />
            ) : (
              results[1].data.users.map((user: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${user.admin ? "إداري" : "مستخدم"}`}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {results[1].isSuccess ? (
        <div className="flex flex-row gap-4 items-center justify-center">
          <Pagination
            count={results[1].data._count}
            link={`/admin/users?`}
            items_per_page={20}
            currentPage={page}
            changePage={changePage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default UsersPage;
