import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { Constants } from "../constants/Constants";

@Injectable({
  providedIn: "root",
})
export class AuthStorageService {
  constructor() {}

  public saveUser(user: any): void {
    window.sessionStorage.setItem(Constants.USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = window.sessionStorage.getItem(Constants.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public clean(): void {
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string): void {
    window.sessionStorage.removeItem(Constants.ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(Constants.ACCESS_TOKEN_KEY, token);
  }
  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(Constants.ACCESS_TOKEN_KEY) !== null
      ? window.sessionStorage.getItem(Constants.ACCESS_TOKEN_KEY)
      : null;
  }
}
