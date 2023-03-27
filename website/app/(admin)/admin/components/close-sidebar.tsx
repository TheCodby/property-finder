"use client";
import { useSetRecoilState } from "recoil";
import { BsList } from "react-icons/bs";
import { sidebarState } from "./sidebar";
const SidebarCloseButton = ({ className = "" }: { className?: string }) => {
  const setIsOpen = useSetRecoilState(sidebarState);
  return (
    <button
      className={`${className} bg-transparent hover:bg-transparent text-black hover:text-emerald-600 z-10`}
      onClick={() => setIsOpen((currentValue) => !currentValue)}
    >
      <BsList size={32} />
    </button>
  );
};

export default SidebarCloseButton;
