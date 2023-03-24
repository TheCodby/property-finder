import React from "react";
const StatisticCard = ({
  name,
  icon,
  number,
  className = "",
}: {
  name: string;
  icon?: React.ReactNode;
  number: number;
  className?: string;
}) => {
  return (
    <div className={`${className} card text-3xl text-emerald-800`}>
      <div className="flex flex-row gap-4 items-center">
        {icon}
        <p className="font-bold">{number.toLocaleString()}</p>
      </div>
      <p className="text-lg font-bold text-black">{name}</p>
    </div>
  );
};

export default StatisticCard;
