import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { AuthService } from "../services/auth.service"
import { APP_CONFIG } from "../configs/environment.config"

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private service: AuthService,
    public router: Router,
    public toastr: NgToastService,
  ) {}
  canActivate(): boolean {
    if (this.service.isLoggedIn()) {
      return true
    } else {
      this.toastr.error({ detail: "ERROR", summary: "Invalid Client Request", duration: APP_CONFIG.toastDuration })
      this.router.navigate(["admin"])
      return false
    }
  }
}
