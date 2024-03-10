import { Component } from "@angular/core";
import { User } from "app/core/models/user";
import { BaseEditModalFormParent } from "app/dashboard/shared/components/base/base-edit/base-edit-modal-form-parent";
import { IFilterParams } from "app/dashboard/shared/components/filter-select/filter-select.component";

@Component({
  selector: "app-user-edit-form",
  templateUrl: "./user-edit-form.component.html",
  styleUrls: ["./user-edit-form.component.scss"],
})
export class UserEditFormComponent extends BaseEditModalFormParent<User> {
  public override action_urls = {
    detail: (id: number) => `/api/s/users/${id}/`,
    post: () => `/api/s/users/`,
  };
  public filters_data: Record<string, IFilterParams> = {
    roles: {
      type: "select",
      fetch: {
      },
    },
  };
  ngOnInit(): void {
    this.form = this.fb.group({
      roles: this.getRoleArray(),
    });
    super.ngOnInit();
  }
  protected patchFormValue(data: any): void {
    if (this.editInstance !== null) {
      this.form.patchValue({
        roles: this.getRoleArray(this.editInstance.roles),
      });
    }
  }
  private getRoleArray(roles?: string[]) {
    const data = [];
    if (roles) {
      this.filters_data.roles.fetch.data.forEach((filter_role_item) => {
        if (roles.includes(filter_role_item.value)) {
          data.push(filter_role_item);
        }
      });
    }
    return data;
  }
  protected override getPreparedEditData(data: any): Object {
    const submit_data = { ...data };
    submit_data["roles_names"] = submit_data.roles.map(
      (item: any) => item.value
    );
    delete submit_data["roles"];
    return submit_data;
  }
}
