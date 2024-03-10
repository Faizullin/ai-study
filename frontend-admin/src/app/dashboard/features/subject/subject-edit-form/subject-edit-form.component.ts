import { Component } from "@angular/core";
import { Validators } from "@angular/forms";
import { ISubject } from "app/core/models/subject";
import { BaseEditModalFormParent } from "app/dashboard/shared/components/base/base-edit/base-edit-modal-form-parent";

@Component({
  selector: "app-subject-edit-form",
  templateUrl: "./subject-edit-form.component.html",
  styleUrls: ["./subject-edit-form.component.scss"],
})
export class SubjectEditFormComponent extends BaseEditModalFormParent<ISubject> {
  public override action_urls = {
    detail: (id: number) => `/api/s/subjects/${id}/`,
    post: () => `/api/s/subjects/`,
  };
  ngOnInit(): void {
    this.form = this.fb.group({
      title: ["", Validators.required],
    });
    super.ngOnInit();
  }
  protected patchFormValue(data: any): void {
    if (this.editInstance !== null) {
      this.form.patchValue({
        title: this.editInstance?.title || "",
      });
    }
  }
}
