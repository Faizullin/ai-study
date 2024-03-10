import { Component, OnInit } from "@angular/core";
import { ITrainModelData } from "app/core/models/train-model-data";
import { BaseEditModalFormParent } from "app/dashboard/shared/components/base/base-edit/base-edit-modal-form-parent";

@Component({
  selector: "app-export-edit-form",
  templateUrl: "./export-edit-form.component.html",
  styleUrls: ["./export-edit-form.component.scss"],
})
export class ExportEditFormComponent extends BaseEditModalFormParent<ITrainModelData> {
  public override action_urls = {
    detail: (id: number) => `/api/s/mlrec_data/train-model-data/${id}/`,
  };
}
