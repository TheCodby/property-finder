import { FaUserCircle } from "react-icons/fa";

function CommentSkelton() {
  return (
    <div className="card items-start w-full">
      <div className="flex flex-row items-center gap-2">
        {" "}
        <FaUserCircle size={32} />{" "}
        <div className="flex flex-col items-start animate-pulse">
          <div className="bg-slate-200 w-32 h-4 rounded-3xl p-2"></div>{" "}
        </div>
      </div>
      <div className="flex flex-col gap-4 animate-pulse w-full">
        <div className="w-full h-4 bg-slate-200 rounded-3xl p-2"></div>
        <div className="w-1/2 h-4 bg-slate-200 rounded-3xl p-2"></div>
      </div>
    </div>
  );
}

export default CommentSkelton;
