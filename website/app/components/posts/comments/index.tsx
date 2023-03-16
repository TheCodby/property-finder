import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { calculateDifferent } from "../../../../utils/calculations";

const Comment: React.FC<{ comment: any }> = ({ comment }) => {
  return (
    <div className="card items-start">
      <p className="flex flex-row items-center gap-2">
        {" "}
        <FaUserCircle size={32} />{" "}
        <div className="flex flex-col items-start">
          <p className="text-lg font-semibold">{`${comment.user.firstName} ${comment.user.lastName}`}</p>
          <p className="text-md">{calculateDifferent(comment.createdAt)}</p>
        </div>
      </p>
      <p>{comment.comment}</p>
    </div>
  );
};

export default Comment;
