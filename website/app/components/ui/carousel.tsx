"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
type Props = {
  images: [];
};
const Carousel: React.FC<Props> = ({ images }) => {
  const [activePage, setActivePage] = useState(0);
  const goNext = () => {
    setActivePage((activeImg) => {
      if (activeImg >= images.length - 1) {
        return 0;
      } else {
        return activeImg + 1;
      }
    });
  };
  const goBack = () => {
    setActivePage((activeImg) => {
      if (activeImg === 0) {
        return images.length - 1;
      } else {
        return activeImg - 1;
      }
    });
  };
  return (
    <div className="bg-gradient-to-r from-slate-50 to-white w[100vw-8px] h-[60vh] overflow-hidden flex flex-row relative shadow-xl">
      <div
        className={`absolute w-full h-full transition-all duration-500`}
        style={{
          transform: `translate( -${activePage * 200}%, 0px)`,
        }}
      >
        {images.map((item: { key: string }, index: number) => (
          <div
            key={index}
            className={`absolute row-span-2 h-full w-full`}
            style={{ transform: `translate(${index * 200}%, 0px)` }}
          >
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt=""
              src={`https://property-finderf.s3.amazonaws.com/${item.key}`}
            />
            <div className="absolute w-full h-full bg-[rgba(0,0,0,0.4)]"></div>
          </div>
        ))}
      </div>
      <div className="relative z-10 w-full h-full">
        <button
          className="absolute bg-transparent text-white hover:bg-transparent hover:text-emerald-500 left-2 top-1/2"
          onClick={goBack}
        >
          <FaArrowCircleLeft size={48} />
        </button>
        <button
          className="absolute bg-transparent text-white hover:bg-transparent hover:text-emerald-500 right-2 top-1/2"
          onClick={goNext}
        >
          <FaArrowCircleRight size={48} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
