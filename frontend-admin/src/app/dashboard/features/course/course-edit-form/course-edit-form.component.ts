import { Component, OnInit } from "@angular/core";
import { Course } from "app/core/models/course";
import { BaseEditModalFormParent } from "app/dashboard/shared/components/base/base-edit/base-edit-modal-form-parent";
import { IFilterParams } from "app/dashboard/shared/components/filter-select/filter-select.component";
import { map } from "rxjs";

@Component({
  selector: "app-course-edit-form",
  templateUrl: "./course-edit-form.component.html",
  styleUrls: ["./course-edit-form.component.scss"],
})
export class CourseEditFormComponent extends BaseEditModalFormParent<Course> {
  public override action_urls = {
    detail: (id: number) => `/api/s/courses/${id}/`,
    post: () => `/api/s/courses/`,
  };
  public filters_data: Record<string, IFilterParams> = {
    subjects: {
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
  };
  ngOnInit(): void {
    this.form = this.fb.group({
      title: "",
      subject: [],
    });
    super.ngOnInit();
  }
  protected patchFormValue(data: any): void {
    if (this.editInstance !== null) {
      this.form.patchValue({
        title: this.editInstance?.title || "",
        subject: this.editInstance.subject ? [this.editInstance.subject] : [],
      });
    }
  }
  protected override getPreparedEditData(data: any): Object {
    const submit_data = { ...data };
    if (submit_data["subject"]?.length > 0) {
      submit_data["subject_id"] = submit_data["subject"][0].id;
    }
    delete submit_data["subject"];
    return submit_data;
  }
}
