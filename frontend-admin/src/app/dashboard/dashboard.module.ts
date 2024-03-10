import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { HttpClientModule } from "@angular/common/http";
import { DocumentListComponent } from "./features/document/document-list/document-list.component";
import { DocumentEditFormComponent } from "./features/document/document-edit-form/document-edit-form.component";
import { DashboardRoutes } from "./dashboard.routing";
import { BaseModule } from "./shared/components/base/base.module";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FilterSelectModule } from "./shared/components/filter-select/filter-select.module";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { UserListComponent } from "./features/user/user-list/user-list.component";
import { UserEditFormComponent } from "./features/user/user-edit-form/user-edit-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SubjectListComponent } from "./features/subject/subject-list/subject-list.component";
import { CourseListComponent } from "./features/course/course-list/course-list.component";
import { ExportTrainDataListComponent } from "./features/export_train_data/export-train-data-list/export-train-data-list.component";
import { SubjectEditFormComponent } from "./features/subject/subject-edit-form/subject-edit-form.component";
import { CourseEditFormComponent } from "./features/course/course-edit-form/course-edit-form.component";
import { ExportEditFormComponent } from './features/export_train_data/export-edit-form/export-edit-form.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DocumentListComponent,
    DocumentEditFormComponent,
    UserListComponent,
    UserEditFormComponent,
    SubjectListComponent,
    CourseListComponent,
    ExportTrainDataListComponent,
    SubjectEditFormComponent,
    CourseEditFormComponent,
    ExportEditFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    BaseModule,
    FilterSelectModule,
    CKEditorModule,
  ],
})
export class DashboardModule {}
