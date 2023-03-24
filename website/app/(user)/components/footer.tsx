import Link from "next/link";
import React from "react";
const Footer: React.FC = () => {
  return (
    <div className="bg-white py-4 mt-auto">
      <div className="flex flex-col px-10 items-center justify-center gap-x-10">
        <span className="text-3xl font-bold text-gray-400">عقار</span>
        <div className="flex flex-row gap-x-3">
          <Link href="/" className="font-semibold text-black">
            سياسة الخصوصية
          </Link>
          <Link href="/" className="font-semibold text-black">
            شروط الإستخدام
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Footer;
