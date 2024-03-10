import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { DocumentListComponent } from "./features/document/document-list/document-list.component";
import { UserListComponent } from "./features/user/user-list/user-list.component";
import { CourseListComponent } from "./features/course/course-list/course-list.component";
import { SubjectListComponent } from "./features/subject/subject-list/subject-list.component";
import { ExportTrainDataListComponent } from "./features/export_train_data/export-train-data-list/export-train-data-list.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: DashboardComponent,
  },
  {
    path: "documents",
    component: DocumentListComponent,
    title: "Documents",
  },
  {
    path: "users",
    component: UserListComponent,
    title: "Users",
  },
  {
    path: "courses",
    component: CourseListComponent,
    title: "Courses",
  },
  {
    path: "subjects",
    component: SubjectListComponent,
    title: "Subjects",
  },
  {
    path: "export-model-data",
    component: ExportTrainDataListComponent,
    title: "Export-Model data",
  },
];

export const DashboardRoutes = routes;
