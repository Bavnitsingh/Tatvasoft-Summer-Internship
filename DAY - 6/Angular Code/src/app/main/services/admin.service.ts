import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { APP_CONFIG } from "../configs/environment.config"
import { API_ENDPOINTS } from "../constants/api.constants"

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(
    public http: HttpClient,
    public toastr: ToastrService,
    public router: Router,
  ) { }

  apiUrl = APP_CONFIG.apiBaseUrl
  imageUrl = APP_CONFIG.imageBaseUrl

  //User
  userList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${API_ENDPOINTS.User.USER_LIST}`)
  }
  
  deleteUser(userId: any) {
    return this.http.delete(
      `${this.apiUrl}${API_ENDPOINTS.User.DELETE_USER}?id=${userId}`
    );
  }
}

