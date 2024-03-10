import React, { FC, useEffect, useState } from "react";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { ICourse } from "@/core/models/ICourse";
import CourseItemCard from "./components/CourseItemCard";
import { ISubject } from "@/core/models/ISubject";
import FilterService from "@/core/services/FilterService";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { setFilterData } from "@/core/redux/store/reducers/documentSlice";
import { useNavigate } from "react-router-dom";

import "./course-list.scss";

interface ICourseListProps {}

const CourseList: FC<ICourseListProps> = () => {
  const dispatch = useAppDispatch();
  const { filter_data } = useAppSelector((state) => state.document);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);

  const handleOpenBySubject = (subject_item: ISubject) => {
    const filters = {
      ...filter_data,
      subjects: [subject_item],
    };
    delete filters.course;
    dispatch(setFilterData(filters));
    navigate(`/documents`);
  };
  const handleOpenByCourse = (course_item: ICourse) => {
    const filters = {
      ...filter_data,
      course: course_item,
    };
    delete filters.subjects;
    dispatch(setFilterData(filters));
    navigate(`/documents`);
  };

  useEffect(() => {
    FilterService.getCourses().then((response) => {
      setCourses(response.data);
    });
  }, []);

  return (
    <main className="course-list d-flex flex-column flex-grow-1">
      <TitleHelment title={"Articles"} />
      <section className="bg-white d-flex flex-column flex-grow-1">
        <div className="clients d-flex flex-column flex-grow-1">
          <div className="container d-flex flex-column flex-grow-1">
            <div className="course-grid row mx-auto">
              {courses.map((item) => (
                <div key={item.id} className="col-12 col-md-6">
                  <CourseItemCard
                    item={item}
                    onOpen={() => handleOpenByCourse(item)}
                    onOpenSubject={handleOpenBySubject}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseList;
