import React from "react";

const SkeltonRow = () => {
  return (
    <tr className="animate-pulse">
      <td colSpan={100} className="px-6 py-4 whitespace-nowrap">
        <div className="bg-slate-200 w-full h-5 rounded-3xl"></div>
      </td>
    </tr>
  );
};

export default SkeltonRow;
