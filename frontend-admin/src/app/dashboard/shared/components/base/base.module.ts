import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { HttpClientModule } from "@angular/common/http";
import { MatPaginatorModule } from "@angular/material/paginator";
import { BaseDeleteDialogComponent } from "./base-delete/base-delete-dialog/base-delete-dialog.component";
import { BaseListComponent } from "./base-list/base-list.component";
import { BaseEditModalFormParent } from "./base-edit/base-edit-modal-form-parent";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSortModule } from "@angular/material/sort";
import { FilterSelectModule } from "../filter-select/filter-select.module";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    BaseDeleteDialogComponent,
    BaseListComponent,
    BaseEditModalFormParent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatPaginatorModule,
    FilterSelectModule,
  ],
  exports: [
    BaseDeleteDialogComponent,
    BaseListComponent,
    BaseEditModalFormParent,
  ],
})
export class BaseModule {}
