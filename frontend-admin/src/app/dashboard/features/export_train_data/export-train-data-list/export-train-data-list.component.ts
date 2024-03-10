import { Component } from "@angular/core";
import { ITrainModelData } from "app/core/models/train-model-data";
import {
  ITableColumn,
  ITablesActionData,
} from "app/dashboard/shared/components/base/base-list/base-list.component";
import { ExportEditFormComponent } from "../export-edit-form/export-edit-form.component";
import { BaseHttpService } from "app/core/services/base-http.service";

@Component({
  selector: "app-export-train-data-list",
  templateUrl: "./export-train-data-list.component.html",
  styleUrls: ["./export-train-data-list.component.scss"],
})
export class ExportTrainDataListComponent {
  constructor(private baseHttpService: BaseHttpService) {}
  public table_title = "Export-Model data";
  public actions: ITablesActionData<ITrainModelData> = {
    list: {
      use: true,
      url: () => `/api/s/mlrec_data/train-model-data/`,
    },
    edit: {
      use: true,
      component: ExportEditFormComponent,
    },
    delete: {
      use: true,
      url: (id) => `/api/s/mlrec_data/train-model-data/${id}/`,
    },
  };
  public columns: ITableColumn<ITrainModelData>[] = [
    {
      header: "Id",
      field: "id",
      sortable: true,
      filter: {
        type: "text",
      },
    },
    {
      header: "Status",
      field: "status",
      filter: {
        type: "select",
        fetch: {
          data: [
            {
              label: "planned",
              value: "planned",
            },
            {
              label: "completed",
              value: "completed",
            },
            {
              label: "error",
              value: "error",
            },
            {
              label: "processing",
              value: "processing",
            },
          ],
        },
      },
    },
    {
      header: "Train Type",
      field: "train_type",
      filter: {
        type: "select",
        fetch: {
          data: [
            {
              label: "collaborative",
              value: "collaborative",
            },
            {
              label: "content-based",
              value: "content-based",
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

  public train_cb_model() {
    this.baseHttpService.post(`/api/s/mlrec_data/train/cb/`, {}).subscribe({
      next: () => {},
      error: () => {},
    });
  }
  public train_cf_model() {
    this.baseHttpService.post(`/api/s/mlrec_data/train/cf/`, {}).subscribe({
      next: () => {
      },
      error: () => {},
    });
  }
  
  public export_dataset() {
    this.baseHttpService.post(`/api/s/mlrec_data/export/dataset/`, {}).subscribe({
      next: () => {
      },
      error: () => {},
    });
  }
}
