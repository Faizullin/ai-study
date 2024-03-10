import { Component } from "@angular/core";
import { Document } from "app/core/models/document";
import {
  ITableColumn,
  ITablesActionData,
} from "app/dashboard/shared/components/base/base-list/base-list.component";
import { DocumentEditFormComponent } from "../document-edit-form/document-edit-form.component";

@Component({
  selector: "app-document-list",
  templateUrl: "./document-list.component.html",
  styleUrls: ["./document-list.component.scss"],
})
export class DocumentListComponent {
  public table_title = "Documents";
  public actions: ITablesActionData<Document> = {
    list: {
      use: true,
      url: () => `/api/s/documents/`,
    },
    delete: {
      use: true,
      url: (id) => `/api/s/documents/${id}/`,
    },
    create: {
      use: true,
      component: DocumentEditFormComponent,
    },
    edit: {
      use: true,
      component: DocumentEditFormComponent,
    },
  };
  public columns: ITableColumn<Document>[] = [
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
      header: "Audience",
      field: "target_audience",
      filter: {
        type: "select",
        fetch: {
          data: [
            {
              label: "Teacher",
              value: "teacher",
            },
            {
              label: "Student",
              value: "student",
            },
          ],
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
