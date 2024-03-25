import React, { FC, useEffect, useState } from "react";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { ICourse } from "@/core/models/ICourse";
import CourseItemCard from "../../shared/components/course/CourseItemCard";
import FilterService from "@/core/services/FilterService";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";

import "./course-list.scss";
import { FormattedMessage } from "react-intl";
import { LoadingCourseGrid } from "@/shared/components/course/LoadingCourseItemCard";

interface ICourseListProps {}

const CourseList: FC<ICourseListProps> = () => {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    setLoadingList(true);
    FilterService.getCourses()
      .then((response) => {
        setCourses(response.data);
        setLoadingList(false);
      })
      .catch(() => {
        setLoadingList(false);
      });
  }, []);

  return (
    <main className="course-list d-flex flex-column flex-grow-1">
      <TitleHelment title={"Courses"} />
      <section className="clients bg-white d-flex flex-column flex-grow-1">
        <div className="container d-flex flex-column flex-grow-1">
          <div className="block-title">
            <FormattedMessage id="courses" />
          </div>
          <div className="course-grid row mx-auto">
            {loadingList ? (
              <LoadingCourseGrid count={6} />
            ) : (
              courses.map((item) => (
                <div key={item.id} className="col-12 col-md-6">
                  <CourseItemCard item={item} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseList;
