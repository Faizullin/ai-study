import React, { FC } from "react";
import "./loading-course-item-card.scss";

interface ILoadingCourseItemCardProps {}

const LoadingCourseItemCard: FC<ILoadingCourseItemCardProps> = () => {
  const handleOpen = (event: any) => {
    event?.preventDefault();
  };
  return (
    <div className="loading-course-item-card p-0 d-flex justify-content-start" data-aos="fade-right">
      <a
        href="#"
        className="loading-course-item-card__thumbnail overflow-hidden w-100"
        onClick={handleOpen}
      >
        <div className="w-100 h-100 object-fit-cover pulse thumb"></div>
      </a>
      <div className="loading-course-item-card__title-wrapper">
        <a href="#" onClick={handleOpen} className="pulse line"></a>
      </div>
      <div className="loading-course-item-card__subject-list">
        <div className=" d-flex align-self-start flex-wrap flex-grow-0">
          {/* {item.subjects.map((subject_item) => (
            <a
              key={`${item.id}-${subject_item.id}`}
              href="#"
              onClick={(e) => handleOpenSubject(e, subject_item)}
              className="loading-course-item-card__subject-item"
            >
              {subject_item.title}
            </a>
          ))} */}
        </div>
        <div className="loading-course-item-card__actions">
          <p className="pulse line"></p>
        </div>
      </div>
    </div>
  );
};

export default LoadingCourseItemCard;

interface ILoadingCourseGridProps {
  count: number;
}

export const LoadingCourseGrid: FC<ILoadingCourseGridProps> = ({ count }) => {
  const arr = Array(count).fill(1);
  return arr.map((_, index) => (
    <div
      key={index}
      className="col-12 col-md-6 d-flex justify-content-center d-md-block"
    >
      <LoadingCourseItemCard key={index} />
    </div>
  ));
};
