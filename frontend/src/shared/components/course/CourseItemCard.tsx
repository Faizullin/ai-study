import React, { FC, useMemo } from "react";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { useNavigate } from "react-router-dom";
import { setFilterData } from "@/core/redux/store/reducers/documentSlice";
import { Img } from "@/core/constants/img";
import SecondaryButton from "../buttons/secondary-button/SecondaryButton";
import PrimaryButton from "../buttons/primary-button/PrimaryButton";
import FilterService from "@/core/services/FilterService";

import "./course-item-card.scss";
import {
  fetchUserSubscribedCourses,
  setUserProfileCourses,
} from "@/core/redux/store/reducers/authSlice";

interface ICourseItemCardProps {
  item?: ICourse;
}

const CourseItemCard: FC<ICourseItemCardProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { filter_data } = useAppSelector((state) => state.document);
  const { user_subscribed_courses } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleOpen = (event?: any) => {
    event?.preventDefault();
    const filters = {
      ...filter_data,
      course: item,
    };
    delete filters.subjects;
    dispatch(setFilterData(filters));
    navigate(`/documents`);
  };
  const handleOpenSubject = (event: any, subject_item: ISubject) => {
    event?.preventDefault();
    const filters = {
      ...filter_data,
      subjects: [subject_item],
    };
    delete filters.course;
    dispatch(setFilterData(filters));
    navigate(`/documents`);
  };
  const handleSubscribe = () => {
    FilterService.subscribeCourse(item.id).then(() => {
      dispatch(fetchUserSubscribedCourses());
    });
  };
  const handleUnsubscribe = () => {
    FilterService.unsubscribeCourse(item.id).then(() => {
      dispatch(fetchUserSubscribedCourses());
    });
  };
  const card_subscribed = useMemo(() => {
    return item ? user_subscribed_courses.map((item) => item.id).includes(item.id) : false;
  }, [user_subscribed_courses, item]);

  return (
    <div className="course-item-card p-0 d-flex justify-content-start">
      <a
        href="#"
        className="course-item-card__thumbnail overflow-hidden w-100"
        onClick={handleOpen}
      >
        <img
          src={item?.image || Img.not_found}
          alt=""
          className="w-100 h-100 object-fit-cover"
        />
      </a>
      <div className="course-item-card__title-wrapper">
        <a href="#" onClick={handleOpen}>
          {item?.title}
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
          {item?.subject && (
            <a
              href="#"
              onClick={(e) => handleOpenSubject(e, item.subject)}
              className="course-item-card__subject-item"
            >
              {item.subject.title}
            </a>
          )}
        </div>
        <div className="course-item-card__actions">
          {card_subscribed ? (
            <SecondaryButton onClick={handleUnsubscribe}>
              Unsubscribe
            </SecondaryButton>
          ) : (
            <PrimaryButton onClick={handleSubscribe}>Subscribe</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseItemCard;
