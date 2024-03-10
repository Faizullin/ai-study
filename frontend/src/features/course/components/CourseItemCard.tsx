import React, { FC } from "react";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";
import "./course-item-card.scss";

interface ICourseItemCardProps {
  item: ICourse;
  onOpen: () => void;
  onOpenSubject: (subject_item: ISubject) => void;
}

const CourseItemCard: FC<ICourseItemCardProps> = ({
  item,
  onOpen,
  onOpenSubject,
}) => {
  const handleOpen = (event?: any) => {
    event?.preventDefault();
    onOpen();
  };
  const handleOpenSubject = (event: any, subject_item: ISubject) => {
    event?.preventDefault();
    onOpenSubject(subject_item);
  };
  return (
    <div className="course-item-card p-0 d-flex justify-content-start">
      <a
        href="#"
        className="course-item-card__thumbnail overflow-hidden"
        onClick={handleOpen}
      >
        <img src={item.image} alt="" className="w-100 h-100 object-fit-cover" />
      </a>
      <div className="course-item-card__title-wrapper">
        <a href="#" onClick={handleOpen}>
          {item.title}
        </a>
      </div>
      <div className="course-item-card__subject-list">
        <div className=" d-flex align-self-start flex-wrap flex-grow-0">
          {/* {item.subjects.map((subject_item) => (
            <a
              key={`${item.id}-${subject_item.id}`}
              href="#"
              onClick={(e) => handleOpenSubject(e, subject_item)}
              className="course-item-card__subject-item"
            >
              {subject_item.title}
            </a>
          ))} */}
          {item.subject && (
            <a
              href="#"
              onClick={(e) => handleOpenSubject(e, item.subject)}
              className="course-item-card__subject-item"
            >
              {item.subject.title}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseItemCard;
