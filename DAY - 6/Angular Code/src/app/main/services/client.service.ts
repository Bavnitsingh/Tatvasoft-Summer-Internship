import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import { User, UserDetail } from "../interfaces/user.interface"
import { API_ENDPOINTS } from "../constants/api.constants"
import { Mission } from "../interfaces/common.interface"

@Injectable({
  providedIn: "root",
})
export class ClientService {
  constructor(private http: HttpClient) {}
  apiUrl = `${environment.apiBaseUrl}/api`
  imageUrl = environment.apiBaseUrl
  
  //ShareYourStory
  missionTitleList(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.MISSION_TITLE}`)
  }

  loginUserDetailById(id: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl + API_ENDPOINTS.AUTH.GET_LOGIN_USER_BY_ID}/${id}`)
  }

  loginUserProfileUpdate(userDetail: UserDetail) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.AUTH.UPDATE_USER_PROFILE}`, userDetail)
  }

  getUserProfileDetailById(userId: any) {
    return this.http.get<UserDetail[]>(`${this.apiUrl + API_ENDPOINTS.AUTH.GET_USER_PROFILE}/${userId}`)
  }
}
