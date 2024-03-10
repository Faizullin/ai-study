import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingState } from "app/core/models/loading-state";
import { AuthStorageService } from "app/core/services/auth-storage.service";
import { AuthService } from "app/core/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public submitted = false;
  public validationErrors = {};
  public loading: LoadingState = {
    post: false,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authStorageService: AuthStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.loading.post = true;
      this.validationErrors = {};
      this.authService.login(email, password).subscribe({
        next: (token_data) => {
          this.authStorageService.saveAccessToken(token_data.access || null);
          this.authService.getUser().subscribe({
            next: (user_data) => {
              this.loading.post = false;
              this.authService.isLoggedIn = true;
              this.authStorageService.saveUser(user_data);
              const returnUrl = this.route.snapshot.queryParams["returnUrl"];
              if (returnUrl) {
                this.router.navigateByUrl(returnUrl);
              } else {
                this.router.navigate(["/"]);
              }
            },
            error: () => {
              this.loading.post = false;
            },
          });
        },
        error: (errors) => {
          this.loading.post = false;
          if (errors.error) {
            this.validationErrors = { ...errors.error };
          }
        },
      });
    }
  }
}
