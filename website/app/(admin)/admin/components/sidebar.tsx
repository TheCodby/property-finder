"use client";
import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { FcCollapse } from "react-icons/fc";
import { VscAccount, VscDashboard } from "react-icons/vsc";
const Sidebar = () => {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  return (
    <div className="bg-white/80 rtl:rounded-l-md ltr:rounded-r-md flex flex-col text-center text-black p-3 w-1/4 gap-6">
      <p className="text-2xl font-light">سمسار</p>
      <div className="flex flex-col gap-2">
        <Disclosure defaultOpen={segments[0] === "dashboard"}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`sidebar-button`}>
                <p>
                  <VscDashboard size={24} />
                  لوحة التحكم
                </p>
                <FcCollapse
                  size={16}
                  className={`${open ? "rotate-180" : ""} duration-300`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="sidebar-menu">
                  <Link
                    href={`admin/dashboard`}
                    className={`sidebar-button ${
                      pathname === "/admin/dashboard" ? "bg-emerald-200" : ""
                    }`}
                  >
                    عام
                  </Link>
                  <Link
                    href={`/admin/dashboard/settings`}
                    className={`sidebar-button ${
                      pathname === "/admin/dashboard/settings"
                        ? "bg-emerald-200"
                        : ""
                    }`}
                  >
                    الإعدادات
                  </Link>
                  <Link
                    href={`/admin/dashboard/reports`}
                    className={`sidebar-button ${
                      pathname === "/admin/dashboard/reports"
                        ? "bg-emerald-200"
                        : ""
                    }`}
                  >
                    التقارير
                  </Link>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="sidebar-button">
                <p>
                  <VscAccount size={24} />
                  المستخدمين
                </p>
                <FcCollapse
                  size={16}
                  className={`${open ? "rotate-180" : ""} duration-300`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="sidebar-menu">
                  <Link
                    href={`admin/dashboard/general`}
                    className={`sidebar-button ${
                      pathname === "/admin/dashboard/general"
                        ? "bg-emerald-200"
                        : ""
                    }`}
                  >
                    عام
                  </Link>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default Sidebar;
