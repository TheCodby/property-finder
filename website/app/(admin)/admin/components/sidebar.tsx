"use client";
import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { FcCollapse } from "react-icons/fc";
import { VscAccount, VscDashboard } from "react-icons/vsc";
import { atom, useRecoilValue } from "recoil";
import SidebarCloseButton from "./close-sidebar";
export const sidebarState = atom({
  key: "sidebarState",
  default: false,
});
const Sidebar = () => {
  const isOpen = useRecoilValue(sidebarState);
  console.log(isOpen);
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  return (
    <div
      className={`flex-row text-center text-black transition-all duration-300 z-10 overflow-hidden w-screen h-screen md:h-auto fixed md:static ${
        !isOpen ? "translate-x-[100%] w-0 " : "translate-x-[0%] md:w-1/4"
      }`}
    >
      <div
        className={`rtl:rounded-l-md h-full ltr:rounded-r-md bg-white/80 flex flex-col gap-6 transition-all duration-300 overflow-hidden p-3 w-full`}
      >
        <SidebarCloseButton className="block md:hidden" />
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
                        pathname?.startsWith("/admin/dashboard/settings")
                          ? "bg-emerald-200"
                          : ""
                      }`}
                    >
                      الإعدادات
                    </Link>
                    <Link
                      href={`/admin/dashboard/reports`}
                      className={`sidebar-button ${
                        pathname?.startsWith("/admin/dashboard/reports")
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
          <Link
            href={`/admin/users`}
            className={`sidebar-button ${
              pathname?.startsWith("/admin/users") ? "bg-emerald-200" : ""
            }`}
          >
            <p>
              <VscAccount size={24} />
              المستخدمون
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
