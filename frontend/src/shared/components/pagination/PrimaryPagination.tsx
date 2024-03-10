import React, { FC } from "react";
import ArrowRightImg from "@/assets/img/pagination-arrow-right.svg";
import "./primary-pagination.scss";

interface IPrimaryPaginationProps {
  page: number;
  pageSize: number;
  count: number;
  onChangePage: (data?: any) => any;
}

const PrimaryPagination: FC<IPrimaryPaginationProps> = ({
  page,
  pageSize,
  count,
  onChangePage,
}) => {
  const totalPages = Math.ceil(count / pageSize);

  const handleFirstPageButtonClick = (event: any) => {
    event.preventDefault();
    onChangePage(0);
  };
  const handlePreviousPageButtonClick = (event: any) => {
    event.preventDefault();
    if (page > 0) {
      onChangePage(page - 1);
    }
  };
  const handleNextPageButtonClick = (event: any) => {
    event.preventDefault();
    if (page + 1 < totalPages) {
      onChangePage(page + 1);
    }
  };
  const handleLastPageButtonClick = (event: any) => {
    event.preventDefault();
    onChangePage(totalPages - 1);
  };
  const handleChange = (event: any, page: number) => {
    event.preventDefault();
    onChangePage(page);
  };
  return (
    <div className="primary-pagination">
      <div className="page-item arrow" onClick={handlePreviousPageButtonClick}>
        <img
          src={ArrowRightImg}
          className="image-forne"
          style={{
            rotate: "180deg",
          }}
        />
      </div>
      {[...Array(totalPages)].map((_, i) => (
        <div
          key={i}
          onClick={(e) => handleChange(e, i)}
          className={`page-item ${i === page ? "active" : ""}`}
        >
          {i + 1}
        </div>
      ))}
      <div className="page-item arrow" onClick={handleNextPageButtonClick}>
        <img src={ArrowRightImg} />
      </div>
    </div>
  );
};

export default PrimaryPagination;
