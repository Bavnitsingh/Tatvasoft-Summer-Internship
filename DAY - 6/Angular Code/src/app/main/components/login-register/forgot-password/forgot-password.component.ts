import { NgIf } from "@angular/common"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { ToastrService } from "ngx-toastr"
import { Subscription } from "rxjs"
import { APP_CONFIG } from "src/app/main/configs/environment.config"
import { AuthService } from "src/app/main/services/auth.service"

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(
    private _fb: FormBuilder,
    private _service: AuthService,
    private _router: Router,
    private _toast: NgToastService,
  ) { }
  forgotPasswordForm: FormGroup
  formValid: boolean
  ngOnInit(): void {
    this.forgotPassword()
  }
  forgotPassword() {
    this.forgotPasswordForm = this._fb.group({
      emailAddress: [null, Validators.compose([Validators.required, Validators.email])],
    })
  }
  get emailAddress() {
    return this.forgotPasswordForm.get("emailAddress") as FormControl
  }

  onSubmit() {
    this.formValid = true
    if (this.forgotPasswordForm.valid) {
      const addFormValue = this.forgotPasswordForm.value
      addFormValue.baseUrl = document.location.origin

      const forgotPasswordSubscribe = this._service.forgotPasswordEmailCheck(addFormValue).subscribe((data: any) => {
        if (!data) {
          // this.toastr.error('OOPS This email address does not exist');
          this._toast.error({ detail: "ERROR", summary: "OOPS This email address does not exist", duration: APP_CONFIG.toastDuration })
        } else {
          // this.toastr.success('Reset password mail send successfully. please check your emailtoreset your password');
          this._toast.success({
            detail: "SUCCESS",
            summary: "Password reset link is send to your registred email, Kindly check your mail box",
            duration: APP_CONFIG.toastDuration,
          })
          setTimeout(() => {
            this._router.navigate([""])
          }, 2000)
        }
      })
      this.formValid = false
      this.unsubscribe.push(forgotPasswordSubscribe);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
