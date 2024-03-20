import React, { FC, useEffect, useState } from "react";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { ICourse } from "@/core/models/ICourse";
import CourseItemCard from "../../shared/components/course/CourseItemCard";
import FilterService from "@/core/services/FilterService";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";

import "./course-list.scss";

interface ICourseListProps {}

const CourseList: FC<ICourseListProps> = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    FilterService.getCourses().then((response) => {
      setCourses(response.data);
    });
  }, []);

  return (
    <main className="course-list d-flex flex-column flex-grow-1">
      <TitleHelment title={"Courses"} />
      <section className="clients bg-white d-flex flex-column flex-grow-1">
        <div className="container d-flex flex-column flex-grow-1">
          <div className="block-title">Courses</div>
          <div className="course-grid row mx-auto">
            {courses.map((item) => (
              <div key={item.id} className="col-12 col-md-6">
                <CourseItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseList;
