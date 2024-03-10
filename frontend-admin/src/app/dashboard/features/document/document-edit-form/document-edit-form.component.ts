import { Component, Inject } from "@angular/core";
import { BaseEditModalFormParent } from "app/dashboard/shared/components/base/base-edit/base-edit-modal-form-parent";
import { Document } from "app/core/models/document";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { IFilterParams } from "app/dashboard/shared/components/filter-select/filter-select.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseHttpService } from "app/core/services/base-http.service";
import { DocumentFileModelService } from "app/core/services/document-file-model.service";
import { map } from "rxjs";

@Component({
  selector: "app-document-edit-form",
  templateUrl: "./document-edit-form.component.html",
  styleUrls: ["./document-edit-form.component.scss"],
})
export class DocumentEditFormComponent extends BaseEditModalFormParent<Document> {
  public override action_urls = {
    detail: (id: number) => `/api/s/documents/${id}/`,
    post: () => `/api/s/documents/`,
  };
  public Editor = ClassicEditor;
  public EditorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "|",
        "link",
        "blockQuote",
        "codeBlock",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
    },
  };
  public filters_data: Record<string, IFilterParams> = {
    subjects: {
      type: "select",
      fetch: {
        useInitital: true,
        action: () => {
          return this.baseHttpService
            .get(`/api/s/subjects/`)
            .pipe(map((data) => data.results));
        },
        value_field: "id",
        label_field: "title",
      },
    },
    courses: {
      type: "select",
      fetch: {
        useInitital: true,
        action: () => {
          return this.baseHttpService
            .get(`/api/s/courses/`)
            .pipe(map((data) => data.results));
        },
        value_field: "id",
        label_field: "title",
      },
    },
  };
  constructor(
    fb: FormBuilder,
    dialogRef: MatDialogRef<BaseEditModalFormParent<Document>>,
    @Inject(MAT_DIALOG_DATA) data: any,
    baseHttpService: BaseHttpService,
    private fileService: DocumentFileModelService
  ) {
    super(fb, dialogRef, data, baseHttpService);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      content: [""],
      subjects: [],
      course: [],
    });
    super.ngOnInit();
  }
  protected patchFormValue(data: any): void {
    if (this.editInstance !== null) {
      this.form.patchValue({
        title: this.editInstance.title,
        description: this.editInstance.description,
        content: this.editInstance.content,
        subjects: this.editInstance.subjects || [],
        course: this.editInstance.course ? [this.editInstance.course] : [],
      });
    }
  }
  protected override getPreparedEditData(data: any): Object {
    const submit_data = { ...data };
    submit_data["subject_ids"] =
      submit_data.subjects?.map((item) => item.id) || [];
    if (submit_data.course?.length > 0) {
      submit_data.course_id = submit_data.course[0].id;
      delete submit_data.course
    }
    return submit_data;
  }
  public onFeaturedImageChange(event: any) {
    if (event.target.files.length > 0 && this.editInstance) {
      const file = event.target.files[0];
      this.loading.post = true;
      this.uploadFileRequest(file, "thumbnail").subscribe({
        next: (file) => {
          if (this.editInstance) {
            event.target.value = "";
            this.fetchUpdateRequest(this.editInstance!.id, {
              featured_image_id: file.id,
            }).subscribe({
              next: (item_data) => {
                this.afterRequestSuccess(item_data);
              },
              error: (error) => {
                this.afterRequestError(error);
              },
            });
          }
        },
        error: (error) => {
          event.target.value = "";
          this.afterRequestError(error);
        },
      });
    }
  }
  public onFileChange(file: any) {
    if (this.editInstance) {
      this.loading.post = true;
      this.uploadFileRequest(file).subscribe({
        next: (file) => {
          this.afterRequestSuccess(this.editInstance);
        },
        error: (error) => {
          this.afterRequestError(error);
        },
      });
    }
  }
  public onFileDelete(file_id: number) {
    this.loading.post = true;
    this.fileService.deleteFile(file_id).subscribe({
      next: () => {
        this.loading.post = false;
        this.fetchInstance();
      },
    });
  }
  private uploadFileRequest(file: File, type: any = "attach") {
    return this.fileService.uploadNewFile(
      {
        document_id: this.editInstance!.id,
        type,
      },
      file
    );
  }
  get filtered_files() {
    if (this.editInstance !== null) {
      if (this.editInstance.featured_image) {
        return this.editInstance.files?.filter(
          (fileItem) => fileItem.id !== this.editInstance.featured_image.id
        );
      }
      return this.editInstance.files;
    }
    return [];
  }
}
