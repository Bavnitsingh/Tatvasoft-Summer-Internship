import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"

import { VolunteeringGoals, VolunteeringHours } from "../interfaces/volunteering.interface"
import { environment } from "../../../environments/environment"
import { API_ENDPOINTS } from "../constants/api.constants"
import { Mission } from "../interfaces/common.interface"

@Injectable({
  providedIn: "root",
})
export class VolunteeringTimeSheetService {
  constructor(private http: HttpClient) {}
  apiUrl = `${environment.apiBaseUrl}/api`
  imageUrl = environment.apiBaseUrl

  //Volunteering Timesheet Hours
  getVolunteeringHoursList(userid: any): Observable<VolunteeringHours[]> {
    return this.http.get<VolunteeringHours[]>(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.GET_HOURS_LIST}/${userid}`)
  }

  getVolunteeringHoursById(id: number): Observable<VolunteeringHours[]> {
    return this.http.get<VolunteeringHours[]>(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.GET_HOURS_BY_ID}/${id}`)
  }

  volunteeringMissionList(id: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.VOLUNTEERING_MISSION_LIST}/${id}`)
  }

  addVolunteeringHours(data: VolunteeringHours) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.ADD_HOURS}`, data)
  }

  updateVolunteeringHours(data: VolunteeringHours) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.UPDATE_HOURS}`, data)
  }

  deleteVolunteeringHours(id: any) {
    return this.http.delete(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.DELETE_HOURS}/${id}`)
  }

  //Volunteering Timesheet Goals
  getVolunteeringGoalsList(userid: any): Observable<VolunteeringGoals[]> {
    return this.http.get<VolunteeringGoals[]>(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.GET_GOALS_LIST}/${userid}`)
  }

  getVolunteeringGoalsById(id: number): Observable<VolunteeringGoals[]> {
    return this.http.get<VolunteeringGoals[]>(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.GET_GOALS_BY_ID}/${id}`)
  }

  addVolunteeringGoals(data: VolunteeringGoals) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.ADD_GOALS}`, data)
  }

  updateVolunteeringGoals(data: VolunteeringGoals) {
    return this.http.post(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.UPDATE_GOALS}`, data)
  }

  deleteVolunteeringGoals(id: any) {
    return this.http.delete(`${this.apiUrl + API_ENDPOINTS.TIMESHEET.DELETE_GOALS}/${id}`)
  }
}
