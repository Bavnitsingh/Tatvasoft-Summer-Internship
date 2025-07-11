import { Injectable } from "@angular/core"
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http"
import { catchError, type Observable, throwError } from "rxjs"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { APP_CONFIG } from "../configs/environment.config"

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public service: AuthService,
    private route: Router,
    private toastr: NgToastService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.service.getToken()

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      })
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.toastr.error({ detail: "ERROR", summary: "Token is Expired, Please Login Again", duration: APP_CONFIG.toastDuration })
            this.service.loggedOut()
            this.route.navigate(["/admin"])
          }
        }
        return throwError(() => new Error("Some other error occured"))
      }),
    )
  }
}
