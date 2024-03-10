import { Component, OnInit } from "@angular/core";
import { ISubject } from "app/core/models/subject";
import { ITableColumn, ITablesActionData } from "app/dashboard/shared/components/base/base-list/base-list.component";
import { SubjectEditFormComponent } from "../subject-edit-form/subject-edit-form.component";

@Component({
  selector: "app-subject-list",
  templateUrl: "./subject-list.component.html",
  styleUrls: ["./subject-list.component.scss"],
})
export class SubjectListComponent {
  public table_title = "Subjects";
  public actions: ITablesActionData<ISubject> = {
    list: {
      use: true,
      url: () => `/api/s/subjects/`,
    },
    create: {
      use: true,
      component: SubjectEditFormComponent,
    },
    edit: {
      use: true,
      component: SubjectEditFormComponent,
    },
    delete: {
      use: true,
      url: (id) => `/api/s/subjects/${id}/`,
    },
  };
  public columns: ITableColumn<ISubject>[] = [
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
