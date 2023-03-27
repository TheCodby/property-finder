"use client";
import Link from "next/link";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
const Pagination = ({
  count,
  link,
  items_per_page,
  currentPage,
  changePage,
}: {
  count: number;
  link: string;
  items_per_page: number;
  currentPage: number;
  changePage?: any;
}) => {
  const renderPagination = () => {
    const pages = [];
    const pagesNum = Math.ceil(count / items_per_page);
    const firstPage = Math.max(1, currentPage - 1);
    const lastPage = Math.min(pagesNum, firstPage + 2);
    if (firstPage !== 1) {
      if (changePage) {
        pages.push(
          <button key="back" onClick={() => changePage(1)} className={`p-3`}>
            <FaArrowCircleRight />
          </button>
        );
      } else {
        pages.push(
          <Link key={"back"} href={`${link}page=1`}>
            <button
              className={`p-3`}
              // onClick={() => router.push(`${link}?page=1`)}
            >
              <FaArrowCircleRight />
            </button>
          </Link>
        );
      }
    }
    for (let i = firstPage; i <= lastPage; i++) {
      if (changePage) {
        pages.push(
          <button
            key={i}
            onClick={() => changePage(i)}
            disabled={currentPage == i}
            className={`p-3`}
          >
            {i}
          </button>
        );
      } else {
        pages.push(
          <Link key={i} href={`${link}page=${i}`}>
            <button disabled={currentPage == i} className={`p-3`}>
              {i}
            </button>
          </Link>
        );
      }
    }
    if (lastPage !== pagesNum) {
      if (changePage) {
        pages.push(
          <button
            key="next"
            onClick={() => changePage(pagesNum)}
            className={`p-3`}
          >
            <FaArrowCircleLeft />
          </button>
        );
      } else {
        pages.push(
          <Link key={"next"} href={`${link}page=${pagesNum}`}>
            <button className={`p-3`}>
              <FaArrowCircleLeft />
            </button>
          </Link>
        );
      }
    }
    return pages;
  };
  return <>{renderPagination()}</>;
};

export default Pagination;
