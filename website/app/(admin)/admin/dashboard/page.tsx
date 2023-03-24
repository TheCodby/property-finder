"use client";

import { FiUsers } from "react-icons/fi";
import { BsFillBuildingsFill, BsFillEyeFill } from "react-icons/bs";
import { AiOutlineComment } from "react-icons/ai";
import StatisticCard from "../components/ui/statistic-card";
import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getCookie } from "cookies-next";
import ErrorBox from "@/app/components/ui/error-box";
import Skelton from "@/app/components/ui/skelton";

function DashboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const { isLoading, error, data, isSuccess }: any = useQuery(
    "general-report",
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/admin/general-reports`,
        {
          headers: {
            authorization: getCookie("token") as string,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    }
  );
  useEffect(() => {
    if (canvasRef.current && isSuccess) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance
      }
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(data.types_count),
          datasets: [
            {
              label: "شقة",
              data: Object.values(data.types_count),
              backgroundColor: "rgba(52, 211, 153,0.3)",
              borderColor: "#065f46",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [isSuccess]);
  if (error) return <ErrorBox error={error?.message} />;
  const newUsersPerc = isLoading ? 0 : (data.new_users / data.users) * 100;
  const newPostsPerc = isLoading ? 0 : (data.new_posts / data.posts) * 100;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-semibold">الإحصائيات</p>
      <div className="grid md:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skelton />
            <Skelton />
            <Skelton />
            <Skelton />
          </>
        ) : (
          <>
            <StatisticCard
              name="المستخدمون حاليًا"
              number={isLoading ? 0 : data.users}
              icon={<FiUsers />}
            />
            <StatisticCard
              name="العقارات"
              number={isLoading ? 0 : data.posts}
              icon={<BsFillBuildingsFill />}
            />
            <StatisticCard
              name="الزيارات"
              number={isLoading ? 0 : 1000}
              icon={<BsFillEyeFill />}
            />
            <StatisticCard
              name="التعليقات"
              number={isLoading ? 0 : data.comments}
              icon={<AiOutlineComment />}
            />
          </>
        )}
      </div>
      <p className="text-2xl font-semibold">إحصائيات يومية</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-10 basis-1/4">
          {isLoading ? (
            <>
              <Skelton />
              <Skelton />
            </>
          ) : (
            <>
              <div className={`card text-black p-6`}>
                <p className="text-xl font-semibold">المستخدمون الجدد</p>
                <div className="flex flex-row gap-4 items-center">
                  <p className="font-bold text-6xl text-emerald-900">
                    {parseInt(isLoading ? 0 : data.new_users).toLocaleString()}
                  </p>
                  <p
                    className={`${
                      newUsersPerc > 0
                        ? "bg-green-200 text-green-500"
                        : "bg-gray-200 text-gray-500"
                    } text-center p-2 rounded-full text-md font-bold`}
                  >
                    {`${newUsersPerc}% ${newUsersPerc > 0 ? "+" : ""}`}
                  </p>
                </div>
              </div>
              <div className={`card text-black p-6`}>
                <p className="text-xl font-semibold">العقارات المُضافة</p>
                <div className="flex flex-row gap-4 items-center">
                  <p className="font-bold text-6xl text-emerald-900">
                    {parseInt(isLoading ? 0 : data.new_posts).toLocaleString()}
                  </p>
                  <p
                    className={`${
                      newPostsPerc > 0
                        ? "bg-green-200 text-green-500"
                        : "bg-gray-200 text-gray-500"
                    } text-center p-2 rounded-full text-md font-bold`}
                  >
                    {`${newPostsPerc}% ${newPostsPerc > 0 ? "+" : ""}`}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={`card bg-white overflow-hidden w-full`}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
