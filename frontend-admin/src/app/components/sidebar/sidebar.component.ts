import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: "/user-profile", title: "User Profile", icon: "person", class: "" },
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/dashboard/documents",
    title: "Documents",
    icon: "dashboard",
    class: "",
  },
  {
    path: "/dashboard/subjects",
    title: "Subjects",
    icon: "dashboard",
    class: "",
  },
  {
    path: "/dashboard/courses",
    title: "Courses",
    icon: "dashboard",
    class: "",
  },
  {
    path: "/dashboard/export-model-data",
    title: "Export-Model data",
    icon: "dashboard",
    class: "",
  },
  { path: "/dashboard/users", title: "Users", icon: "dashboard", class: "" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
