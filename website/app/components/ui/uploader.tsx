import React, { useRef } from "react";
import { FaUpload } from "react-icons/fa";
interface Props {
  className?: string;
  onUpload: (e: any) => void;
}
const Uploader: React.FC<Props> = ({ className = "", onUpload }) => {
  const fileInput = useRef(null);
  return (
    <button
      className={`${className} w-32 h-32 bg-white rounded-3xl shadow-md flex flex-col items-center justify-center text-center relative space-y-1 text-black hover:text-white`}
      onClick={() => document.getElementById("images")?.click()}
    >
      <FaUpload size={32} />
      <p className="font-semibold">رفع صورة</p>
      <input
        type="file"
        hidden
        ref={fileInput}
        accept="image/jpg, image/jpeg, image/png"
        multiple
        id="images"
        onChange={onUpload}
      />
    </button>
  );
};

export default Uploader;
