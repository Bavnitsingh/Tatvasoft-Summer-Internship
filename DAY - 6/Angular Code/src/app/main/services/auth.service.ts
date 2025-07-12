import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APP_CONFIG } from '../configs/environment.config';
import { User } from '../interfaces/user.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = APP_CONFIG.apiBaseUrl;
  imageUrl = APP_CONFIG.imageBaseUrl;

  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUserName: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUserData: any;
  public userPayLoad: any;
  jwthelperService = new JwtHelperService();

  constructor(public http: HttpClient) {
    this.userPayLoad = this.decodedToken();
  }

  registerUser(data: FormData) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.AUTH.REGISTER}`, data);
  }
  getUserById(id: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.GET_USER_BY_ID}/${id}`
    );
  }

  // UPDATED METHOD: updateUser sends plain JSON object instead of FormData
  updateUser(data: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.User.UPDATE_USER}`,
      data,
      { responseType: 'json' }
    );
  }
  addUser(userData: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.User.ADD_USER}`,
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  loginUser(loginInfo: Array<string>) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        EmailAddress: loginInfo[0],
        Password: loginInfo[1],
      },
      { responseType: 'json' }
    );
  }

  forgotPasswordEmailCheck(data: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      data
    );
  }

  resetPassword(data: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      data,
      { responseType: 'text' }
    );
  }

  changePassword(data: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`,
      data
    );
  }

  getToken() {
    return localStorage.getItem('access_Token');
  }

  setToken(token: string) {
    localStorage.setItem('access_Token', token);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access_Token') ? true : false;
  }

  loggedOut() {
    localStorage.removeItem('access_Token');
  }

  public getCurrentUser() {
    return this.currentUser.asObservable();
  }

  public setCurrentUser(userDetail: any) {
    return this.currentUser.next(userDetail);
  }

  decodedToken() {
    const token = this.getToken();
    return this.jwthelperService.decodeToken(token);
  }

  getUserFullName() {
    if (this.userPayLoad) return this.userPayLoad.fullName;
  }

  public getUserDetail() {
    if (this.userPayLoad) return this.userPayLoad;
  }
}
