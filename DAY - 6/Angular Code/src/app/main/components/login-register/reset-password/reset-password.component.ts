import { NgIf } from "@angular/common"
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core"
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { Subscription } from "rxjs"
import { APP_CONFIG } from "src/app/main/configs/environment.config"
import { AuthService } from "src/app/main/services/auth.service"

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  
  constructor(
    private _fb: FormBuilder,
    private _service: AuthService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _toast: NgToastService,
  ) {}
  resetForm: FormGroup
  formValid: boolean
  userId
  ngOnInit(): void {
    this.resetFormCheck()
  }
  ngAfterViewInit() {
    this._activateRoute.queryParams.subscribe((params) => {
      if (params["Uid"] != null) {
        this.userId = params["Uid"]
      } else {
        this._router.navigate(["forgotPassword"])
        // this.toastr.error('Your Password Reset Link is Expired or Invalid');
      }
    })
  }
  resetFormCheck() {
    this.resetForm = this._fb.group(
      {
        password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
        confirmPassword: [null, Validators.compose([Validators.required])],
      },
      { validator: [this.passwordCompareValidator] },
    )
  }
  passwordCompareValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get("password")?.value === fc.get("confirmPassword")?.value ? null : { notmatched: true }
  }

  get password() {
    return this.resetForm.get("password") as FormControl
  }
  get confirmPassword() {
    return this.resetForm.get("confirmPassword") as FormControl
  }

  onSubmit() {
    this.formValid = true
    if (this.resetForm.valid) {
      const resetFormValue = this.resetForm.value
      resetFormValue.Uid = this.userId
      const resetPasswordSubscribe = this._service.resetPassword(resetFormValue).subscribe((data) => {
        if (data == "Failure") {
          //this.toastr.error('Something went wrong!');
          this._toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: APP_CONFIG.toastDuration })
        } else {
          //this.toastr.success("Password Changed Successfully.");
          this._toast.success({ detail: "SUCCESS", summary: "Password Changed Successfully.", duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this._router.navigate([""])
          }, 2000)
        }
      })
      this.formValid = false
      this.unsubscribe.push(resetPasswordSubscribe)
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
