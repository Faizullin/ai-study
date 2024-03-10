import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LoadingState } from "app/core/models/loading-state";
import { BaseHttpService } from "app/core/services/base-http.service";

declare var $: any;

@Component({
  selector: "dashboard-base-edit-form",
  template: "form",
})
export class BaseEditModalFormParent<T> implements OnInit {
  public updated: boolean = false;
  public action_urls: { [key: string]: Function } = {
    detail: (id: number) => ``,
    post: (id?: number) => ``,
  };
  public form!: FormGroup;
  public editInstance: T | null = null;
  public validationErrors: {
    [key: string]: any;
  } = {};
  public loading: LoadingState = {
    list: false,
    post: false,
  };

  constructor(
    protected fb: FormBuilder,
    public dialogRef: MatDialogRef<BaseEditModalFormParent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected baseHttpService: BaseHttpService
  ) {}

  ngOnInit(): void {
    const initialState = this.data;
    if (initialState?.id) {
      this.fetchInstance(initialState.id);
    }
  }
  get formControl() {
    return this.form.controls;
  }
  protected fetchInstance(id?: number) {
    const item_id =
      this.editInstance !== null ? (this.editInstance as any).id : id!;
    this.loading.list = true;
    return this.fetchInstanceRequest(item_id).subscribe({
      next: (data) => {
        this.loading.list = false;
        this.editInstance = data;
        this.patchFormValue(data);
      },
      error: (error) => {
        this.loading.list = false;
        if (error.status === 404) {
          this.closeModal();
          this.editInstance = null;
          setTimeout(() => {
            alert("Not found");
          }, 100);
        }
      },
    });
  }
  protected patchFormValue(data: any) {}
  protected fetchInstanceRequest(id: number) {
    return this.baseHttpService.detail(this.action_urls["detail"](id));
  }

  protected fetchSave(data: any) {
    const item_id =
      this.editInstance !== null ? (this.editInstance as any).id : undefined;
    this.loading.post = true;
    if (item_id !== undefined) {
      this.fetchUpdateRequest(item_id, data).subscribe({
        next: (item_data) => {
          this.afterRequestSuccess(item_data);
        },
        error: (error) => {
          this.afterRequestError(error);
        },
      });
    } else {
      this.fetchCreateRequest(data).subscribe({
        next: (item_data) => {
          this.afterRequestSuccess(item_data);
        },
        error: (error) => {
          this.afterRequestError(error);
        },
      });
    }
  }
  protected afterRequestSuccess(item_data: any) {
    this.loading.post = false;
    this.validationErrors = {};
    this.fetchInstance(item_data.id);
    this.updated = true;
    this.showNotification(
      "top",
      "right",
      "success",
      "Successful request",
      2000
    );
  }
  protected afterRequestError(error: any) {
    this.loading.post = false;
    if (error.status == 400 || error.status == 422) {
      const errors = { ...error.error };
      this.validationErrors = errors;
    }
  }
  protected fetchCreateRequest(data: any) {
    return this.baseHttpService.post(this.action_urls["post"](), data);
  }
  protected fetchUpdateRequest(id: number, data: any) {
    return this.baseHttpService.patch(this.action_urls["detail"](id), data);
  }
  protected onSave(): void {
    if (this.form.valid) {
      this.fetchSave(this.getPreparedEditData(this.form.value));
    }
  }
  protected getPreparedEditData(data: any): Object {
    return data;
  }
  protected closeModal() {
    this.dialogRef.close();
  }

  private showNotification(
    from: string,
    align: string,
    type: "info" | "success" | "warning" | "danger",
    message: string,
    timer: number
  ) {
    $.notify(
      {
        icon: "notifications",
        message,
      },
      {
        type,
        timer,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
}
