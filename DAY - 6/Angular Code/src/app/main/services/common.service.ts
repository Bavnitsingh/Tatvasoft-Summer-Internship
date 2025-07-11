import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { environment } from "../../../environments/environment"

import { API_ENDPOINTS } from "../constants/api.constants"
import { City, Country, Mission } from "../interfaces/common.interface"

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}
  apiUrl = `${environment.apiBaseUrl}/api`
  imageUrl = environment.apiBaseUrl
  searchList: BehaviorSubject<any> = new BehaviorSubject<any>("")

  getMissionCountryList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_COUNTRY_LIST}`)
  }

  getMissionCityList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_CITY_LIST}`)
  }

  getMissionThemeList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_THEME_LIST}`)
  }

  getMissionSkillList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_SKILL_LIST}`)
  }

  uploadImage(data: any) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.UPLOAD_IMAGE}`, data)
  }

  countryList(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.COUNTRY_LIST}`)
  }
  
  cityList(countryId: any): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.CITY_LIST}/${countryId}`)
  }

  contactUs(data: any) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.CONTACT_US}`, data)
  }

  //Volunteering TimeSheet Hours
  getMissionTitle(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_TITLE_LIST}`)
  }
  
  //Add Skill
  addUserSkill(data: any) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.ADD_USER_SKILL}`, data)
  }

  getUserSkill(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.GET_USER_SKILL}/${userId}`)
  }
}