import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"

import { environment } from "../../../environments/environment"
import { API_ENDPOINTS } from "../constants/api.constants"
import { Mission } from "../interfaces/common.interface"

@Injectable({
  providedIn: "root",
})
export class ClientMissionService {
  constructor(private http: HttpClient) {}
  apiUrl = `${environment.apiBaseUrl}/api`
  imageUrl = environment.apiBaseUrl

  //HomePage
  missionList(userId: any): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.LIST}/${userId}`)
  }

  missionClientList(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.CLIENT_LIST}`, data)
  }

  missionDetailByMissionId(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.DETAIL}/`, data)
  }

  applyMission(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.APPLY}`, data)
  }

  //Mission Comment
  addMissionComment(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.ADD_COMMENT}`, data)
  }

  missionCommentListByMissionId(missionId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.COMMENT_LIST}/${missionId}`)
  }

  //Mission Favourite
  addMissionFavourite(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.ADD_FAVORITE}`, data)
  }

  removeMissionFavourite(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.REMOVE_FAVORITE}`, data)
  }

  //Mission Rating
  missionRating(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.RATING}`, data)
  }

  //Mission Recent VolunteerList
  recentVolunteerList(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.RECENT_VOLUNTEERS}`, data)
  }

  //ShareOrInviteMission
  getUserList(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.GET_USER_LIST}/${userId}`)
  }

  sendInviteMissionMail(data: any) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.CLIENT_MISSION.SEND_INVITE}`, data)
  }
}
