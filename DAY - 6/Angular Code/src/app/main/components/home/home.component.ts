import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule, DatePipe } from '@angular/common';
import dateFormat from 'dateformat';
import * as moment from 'moment';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/main/services/common.service';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG } from '../../configs/environment.config';
import { ClientMissionService } from '../../services/client-mission.service';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from '../../pipes/search.pipe';
import { Mission } from '../../interfaces/common.interface';
import { Subscription } from 'rxjs';

declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent, NgxPaginationModule, FormsModule, SearchPipe]
})
export class HomeComponent implements OnInit, OnDestroy {
  missionList: any[] = [];
  userList: any[] = [];
  page = 1;
  missionPerPages = 9;
  listmissionPerPages = 5;
  totalMission: any;
  searchParam: any;
  loginUserId = 0;
  loginUserName: any;
  loginemailAddress: any;
  missionApplyModal: any;
  shareOrInviteModal: any;
  missionData: any;
  appliedDate: any;
  missionStatu = false;
  favImag = 'assets/Img/heart1.png';
  favImag1 = 'assets/Img/heart11.png';
  view: 'grid' | 'list' = 'grid';
  missionFavourite = false;
  public form: FormGroup;
  rating3: any;
  missionid: any;
  usercheckedlist: any[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: ClientMissionService,
    private _toast: NgToastService,
    private _router: Router,
    private _commonservice: CommonService,
    private _adminservice: AuthService
  ) {}

  ngOnInit(): void {
    const currentUserSubscribe = this._adminservice.getCurrentUser().subscribe((data: any) => {
      const loginUserDetail = this._adminservice.getUserDetail();
      data == null
        ? (this.loginUserId = loginUserDetail.userId)
        : (this.loginUserId = data.userId);
      data == null
        ? (this.loginUserName = loginUserDetail.fullName)
        : (this.loginUserName = data.fullName);
      data == null
        ? (this.loginemailAddress = loginUserDetail.emailAddress)
        : (this.loginemailAddress = data.emailAddress);
    });
    this.allMissionList();
    const searchListSubscribe = this._commonservice.searchList.subscribe((data: any) => {
      this.searchParam = data;
    });
    this.missionData = '';
    this.unsubscribe.push(currentUserSubscribe, searchListSubscribe);
  }
  
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

  onChangeGrid() {
    this.view = 'grid';
  }

  onChangeList() {
    this.view = 'list';
  }

  allMissionList() {
    const missionListSubscribe = this._service.missionList(this.loginUserId).subscribe((data: any) => {
      if (data.result == 1) {
        this.missionList = data.data;
        this.missionList = this.missionList.map((x) => {
          var missionimg = x.missionImages
            ? this._service.imageUrl + '/' + x.missionImages
            : 'assets/NoImg.png';
          this.rating3 = x.rating;
          return {
            id: x.id,
            missionTitle: x.missionTitle,
            missionDescription: x.missionDescription,
            countryId: x.countryId,
            countryName: x.countryName,
            cityId: x.cityId,
            cityName: x.cityName,
            startDate: x.startDate,
            endDate: x.endDate,
            totalSheets: x.totalSheets,
            registrationDeadLine: x.registrationDeadLine,
            missionThemeId: x.missionThemeId,
            missionSkillId: x.missionSkillId,
            missionImages: missionimg.split(',', 1),
            missionThemeName: x.missionThemeName,
            missionSkillName: x.missionSkillName,
            missionStatus: x.missionStatus,
            missionApplyStatus: x.missionApplyStatus,
            missionApproveStatus: x.missionApproveStatus,
            missionDateStatus: x.missionDateStatus,
            missionDeadLineStatus: x.missionDeadLineStatus,
          };
        });
        this.totalMission = data.data.length;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
        // this.toastr.error(data.message);
      }
    });
    this.unsubscribe.push(missionListSubscribe);
  }

  sortingData(e: any) {
    const selectedValue = e.target.value;
    if (selectedValue == 'a-z') {
      this.missionList.sort((a, b) => {
        var a = a['missionTitle'].toLowerCase(),
          b = b['missionTitle'].toLowerCase();
        return a > b ? 1 : a < b ? -1 : 0;
      });
    } else {
      this.missionList.sort((a, b) => {
        var a = a['missionTitle'].toLowerCase(),
          b = b['missionTitle'].toLowerCase();
        return a < b ? 1 : a > b ? -1 : 0;
      });
    }
  }
  sortingList(e: any) {
    let selectedVal = e.target.value;
    selectedVal = selectedVal == '' ? 'null' : selectedVal;
    const value = {
      userId: this.loginUserId,
      sortestValue: selectedVal,
    };
    const missionClientSubscribe = this._service.missionClientList(value).subscribe((data: any) => {
      if (data.result == 1) {
        this.missionList = data.data;
        this.missionList = this.missionList.map((x) => {
          const missionimg = x.missionImages
            ? this._service.imageUrl + '/' + x.missionImages
            : 'assets/NoImg.png';
          return {
            id: x.id,
            missionTitle: x.missionTitle,
            missionDescription: x.missionDescription,
            countryId: x.countryId,
            countryName: x.countryName,
            cityId: x.cityId,
            cityName: x.cityName,
            startDate: x.startDate,
            endDate: x.endDate,
            totalSheets: x.totalSheets,
            registrationDeadLine: x.registrationDeadLine,
            missionThemeId: x.missionThemeId,
            missionSkillId: x.missionSkillId,
            missionImages: missionimg.split(',', 1),
            missionThemeName: x.missionThemeName,
            missionSkillName: x.missionSkillName,
            missionStatus: x.missionStatus,
            missionApplyStatus: x.missionApplyStatus,
            missionApproveStatus: x.missionApproveStatus,
            missionDateStatus: x.missionDateStatus,
            missionDeadLineStatus: x.missionDeadLineStatus,
          };
        });
        this.totalMission = data.data.length;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
        // this.toastr.error(data.message);
      }
    });
    this.unsubscribe.push(missionClientSubscribe);
  }

  openMissionApplyModal() {
    this.missionApplyModal.show();
  }

  closeMissionApplyModal() {
    this.missionApplyModal.hide();
  }

  checkUserLoginOrNot(id: any) {
    const tokenDetail = this._adminservice.decodedToken();
    if (tokenDetail == null || tokenDetail.userType != 'user') {
      this._router.navigate(['']);
    } else {
      const data = this.missionList.find((v: Mission) => v.id == id);
      this.missionData = data;
      const now = new Date();
      this.appliedDate = dateFormat(now, 'dd/mm/yyyy h:MM:ss TT');
      this.applyMission();
    }
  }

  redirectVolunteering(missionId: any) {
    const tokenDetail = this._adminservice.decodedToken();
    if (tokenDetail == null || tokenDetail.userType != 'user') {
      this._router.navigate(['']);
    } else if (tokenDetail.userImage == '') {
      this._toast.warning({
        detail: 'Warning',
        summary: 'First Fillup User Profile Detail',
        duration: APP_CONFIG.toastDuration,
      });
      this._router.navigate([`userProfile/${tokenDetail.userId}`]);
    } else {
      this._router.navigate([`volunteeringMission/${missionId}`]);
    }
  }

  applyMission() {
    const value = {
      missionId: this.missionData.id,
      userId: this.loginUserId,
      appliedDate: moment().format('yyyy-MM-DDTHH:mm:ssZ'),
      status: false,
      sheet: 1,
    };
    const applyMissionSubscribe = this._service.applyMission(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: 'SUCCESS', summary: data.data });
          setTimeout(() => {
            this.missionData.totalSheets = this.missionData.totalSheets - 1;
          }, 1000);
          window.location.reload();
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      },
      (err) =>
        this._toast.error({
          detail: 'ERROR',
          summary: err.message,
          duration: APP_CONFIG.toastDuration,
        })
    );
    this.unsubscribe.push(applyMissionSubscribe);
  }

  getUserList() {
    const userListSubscribe = this._service.getUserList(this.loginUserId).subscribe((data: any) => {
      if (data.result == 1) {
        this.userList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(userListSubscribe);
  }

  getUserCheckedList(isSelected, item) {
    if (isSelected == true) {
      this.usercheckedlist.push({
        id: item.id,
        userFullName: item.userFullName,
        emailAddress: item.emailAddress,
        missionShareUserEmailAddress: this.loginemailAddress,
        baseUrl: document.location.origin,
        missionId: this.missionid,
      });
    } else {
      this.usercheckedlist.map((a: any, index: any) => {
        if (item.id == a.id) {
          this.usercheckedlist.splice(index, 1);
        }
      });
    }
  }
}