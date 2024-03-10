import { Injectable, inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Constants } from "../constants/Constants";
import { AuthStorageService } from "../services/auth-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private authStorageService: AuthStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.isLoggedIn) {
      this.authStorageService.clean();
      this.router.navigate([Constants.LOGIN_ROUTE], {
        queryParams: { loggedOut: true, returnUrl: state.url },
      });
      return true;
    }
    const user = this.authStorageService.getUser();
    if (!user?.roles) {
      this.authStorageService.clean();
      this.router.navigate([Constants.LOGIN_ROUTE], {
        queryParams: { loggedOut: true, returnUrl: state.url },
      });
      return true;
    }
    if (!(user.roles.includes("admin"))) {
      this.authStorageService.clean();
      this.router.navigate([Constants.LOGIN_ROUTE], {
        queryParams: { loggedOut: true, returnUrl: state.url },
      });
      return true;
    }
    return true;
  }
}
