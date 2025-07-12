import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { AuthService } from "../services/auth.service"
import { APP_CONFIG } from "../configs/environment.config"

@Injectable({
  providedIn: "root",
})
export class UserTypeGuard {
  constructor(
    private service: AuthService,
    public router: Router,
    public toastr: NgToastService,
  ) {}
  canActivate(): boolean {
    const tokenpayload = this.service.decodedToken()
    if (tokenpayload.userType === "admin") {
      return true
    } else {
      this.toastr.error({ detail: "ERROR", summary: "You are not authorized to access this page", duration: APP_CONFIG.toastDuration })
      this.router.navigate(["/home"])
      return false
    }
  }
}
