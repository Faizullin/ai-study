import { Component, OnInit } from "@angular/core";
import { User } from "app/core/models/user";
import { AuthStorageService } from "app/core/services/auth-storage.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  constructor(private authStorageService: AuthStorageService) {}

  public user_data: User | null = null;

  ngOnInit() {
    this.user_data = this.authStorageService.getUser();
  }
}
