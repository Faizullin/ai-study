import { Component, OnInit } from "@angular/core";
import { Course } from "app/core/models/course";
import {
  ITableColumn,
  ITablesActionData,
} from "app/dashboard/shared/components/base/base-list/base-list.component";
import { CourseEditFormComponent } from "../course-edit-form/course-edit-form.component";
import { BaseHttpService } from "app/core/services/base-http.service";
import { map } from "rxjs";

@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
  styleUrls: ["./course-list.component.scss"],
})
export class CourseListComponent {
  constructor(protected baseHttpService: BaseHttpService) {}
  public table_title = "Courses";
  public actions: ITablesActionData<Course> = {
    list: {
      use: true,
      url: () => `/api/s/courses/`,
    },
    create: {
      use: true,
      component: CourseEditFormComponent,
    },
    edit: {
      use: true,
      component: CourseEditFormComponent,
    },
    delete: {
      use: true,
      url: (id) => `/api/s/courses/${id}/`,
    },
  };
  public columns: ITableColumn<Course>[] = [
    {
      header: "Id",
      field: "id",
      sortable: true,
      filter: {
        type: "text",
      },
    },
    {
      header: "Title",
      field: "title",
      filter: {
        type: "text",
      },
    },
    {
      header: "Subject",
      field: "subject",
      render: (item: Course) => item.subject?.title || "",
      filter: {
        type: "select",
        fetch: {
          useInitital: true,
          action: (filters: any) => {
            return this.baseHttpService
              .get(`/api/s/subjects/`, {
                ...filters,
              })
              .pipe(map((data) => data.results));
          },
          searchable: true,
          value_field: "id",
          label_field: "title",
        },
      },
    },
    {
      header: "Created At",
      field: "created_at",
      sortable: true,
      filter: {
        type: "text",
      },
    },
    {
      header: "Updated At",
      field: "updated_at",
      sortable: true,
      filter: {
        type: "text",
      },
    },
  ];
}
