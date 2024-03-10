import { Component } from "@angular/core";
import { User } from "app/core/models/user";
import {
  ITableColumn,
  ITablesActionData,
} from "app/dashboard/shared/components/base/base-list/base-list.component";
import { UserEditFormComponent } from "../user-edit-form/user-edit-form.component";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent {
  public table_title = "Users";
  public actions: ITablesActionData<User> = {
    list: {
      use: true,
      url: () => `/api/s/users/`,
    },
    edit: {
      use: true,
      component: UserEditFormComponent,
    },
    delete: {
      use: true,
      url: (id) => `/api/s/users/${id}/`,
    },
  };
  public columns: ITableColumn<User>[] = [
    {
      header: "Id",
      field: "id",
      sortable: true,
      filter: {
        type: "text",
      },
    },
    {
      header: "User name",
      field: "username",
      filter: {
        type: "text",
      },
    },
    {
      header: "Email",
      field: "email",
      filter: {
        type: "text",
      },
    },
    {
      header: "Roles",
      field: "groups__name",
      render(item) {
        let res = ``;
        if (item.roles?.length > 0) {
          item.roles.forEach((role_item) => {
            res += `<span>${role_item}</span>,`;
          });
        } else {
          res = "---";
        }
        return res;
      },
      filter: {
        type: "select", 
        fetch: {
          data: [
            {
              label: "Admin",
              value: "admin",
            },
            {
              label: "None",
              value: null,
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
