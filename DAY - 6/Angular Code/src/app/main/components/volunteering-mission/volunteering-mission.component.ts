import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
  NgxGalleryModule,
} from '@kolkov/ngx-gallery';
import * as moment from 'moment';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG } from '../../configs/environment.config';
import { ClientMissionService } from '../../services/client-mission.service';
import { FooterComponent } from '../footer/footer.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SearchingSortingComponent } from '../searching-sorting/searching-sorting.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
declare var window: any;
@Component({
  selector: 'app-volunteering-mission',
  templateUrl: './volunteering-mission.component.html',
  styleUrls: ['./volunteering-mission.component.css'],
  standalone: true,
  imports: [FooterComponent, TabsModule, NgxGalleryModule, CommonModule, SearchingSortingComponent, NavbarComponent]
})
export class VolunteeringMissionComponent implements OnInit, OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  applyModal: any;
  missionId: any;
  missionDetail: any;
  imageList: any = [];
  recentVolunteerList: any[] = [];
  missionDoc: any;
  loginUserId = 0;
  loginUserName: any;
  btnText: any = 'Apply Now';
  missionCommentList: any[] = [];
  missionFavourite = false;
  favImag = 'assets/Img/heart1.png';
  favImag1 = 'assets/Img/heart11.png';
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: ClientMissionService,
    private _toast: NgToastService,
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _datePipe: DatePipe,
    private _adminservice: AuthService
  ) {
    this.missionId = this._activeRoute.snapshot.paramMap.get('missionId');
  }

  ngOnInit(): void {
    const currentUserSubscribe = this._adminservice.getCurrentUser().subscribe((data: any) => {
      const loginUserDetail = this._adminservice.getUserDetail();
      data == null
        ? (this.loginUserId = loginUserDetail.userId)
        : (this.loginUserId = data.userId);
      data == null
        ? (this.loginUserName = loginUserDetail.fullName)
        : (this.loginUserName = data.fullName);
    });
    if (this.missionId != null) {
      this.fetchMissionDetail(this.missionId);
    }
    this.galleryOptions = [
      {
        width: '100%',
        height: '465px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
      },
    ];
    this.applyModal = new window.bootstrap.Modal(
      document.getElementById('applyMissionModal')
    );
    this.getRecentVolunteerList();
    this.unsubscribe.push(currentUserSubscribe);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
  
  fetchMissionDetail(missionId: any) {
    const value = {
      missionId: missionId,
      userId: this.loginUserId,
    };
    const missionDetailSubscribe = this._service.missionDetailByMissionId(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.missionDetail = data.data;

          this.imageList = this.missionDetail.missionImages.split(',');
          this.galleryImages = this.getImages();
          if (this.missionDetail.missionDocuments) {
            this.missionDoc =
              this._service.imageUrl + '/' + this.missionDetail.missionDocuments;
          }
          this.btnText =
            this.missionDetail.missionApplyStatus == 'Applied'
              ? 'Already Apply'
              : 'Apply Now';
          this.getMissionCommentList();
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
    this.unsubscribe.push(missionDetailSubscribe);
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls: NgxGalleryImage[] = [];
    for (const photo of this.imageList) {
      imageUrls.push({
        small: this._service.imageUrl + '/' + photo.replaceAll('\\', '/'),
        medium: this._service.imageUrl + '/' + photo.replaceAll('\\', '/'),
        big: this._service.imageUrl + '/' + photo.replaceAll('\\', '/'),
      });
    }
    return imageUrls;
  }

  openApplyMissionModal(id: any) {
    this.applyModal.show();
    this.missionId = id;
  }

  closeApplyMissionModal() {
    this.applyModal.hide();
  }

  applyMission(id: any) {
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
      const value = {
        missionId: this.missionDetail.id,
        userId: this.loginUserId,
        appliedDate: moment().format('yyyy-MM-DDTHH:mm:ssZ'),
        status: false,
        sheet: 1,
      };
      const missionSubscribe = this._service.applyMission(value).subscribe(
        (data: any) => {
          if (data.result == 1) {
            this._toast.success({ detail: 'SUCCESS', summary: data.data });
            setTimeout(() => {
              this.closeApplyMissionModal();
              this._router.navigate(['/home']);
            }, 1000);
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
      this.unsubscribe.push(missionSubscribe);
    }
  }

  postComment(commentdesc: any) {
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
      const value = {
        missionId: this.missionDetail.id,
        userId: this.loginUserId,
        CommentDescription: commentdesc,
        commentDate: moment().format('yyyy-MM-DDTHH:mm:ssZ'),
      };
      const missionCommentSubscribe = this._service.addMissionComment(value).subscribe(
        (data: any) => {
          if (data.result == 1) {
            this._toast.success({
              detail: 'SUCCESS',
              summary: data.data,
              duration: APP_CONFIG.toastDuration,
            });
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
      this.unsubscribe.push(missionCommentSubscribe);
    }
  }

  getMissionCommentList() {
    const missionCommentSubscribe = this._service.missionCommentListByMissionId(this.missionDetail.id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.missionCommentList = data.data;

          this.missionCommentList = this.missionCommentList.map((x) => {
            return {
              id: x.id,
              commentDescription: x.commentDescription,
              commentDate: x.commentDate
                ? this._datePipe.transform(
                    x.commentDate,
                    'EEEE, MMMM d, y, h:mm a'
                  )
                : '',
              missionId: x.missionId,
              userId: x.userId,
              userFullName: x.userFullName,
              userImage: x.userImage
                ? this._service.imageUrl + '/' + x.userImage
                : 'assets/NoImg.png',
            };
          });
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
    this.unsubscribe.push(missionCommentSubscribe);
  }
  
  getMissionFavourite(missionId: any) {
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
      this.missionFavourite = !this.missionFavourite;
      const value = {
        missionId: missionId,
        userId: this.loginUserId,
      };
      if (this.missionFavourite) {
        const addMissionFavouriteSubscribe = this._service.addMissionFavourite(value).subscribe((data: any) => {
          if (data.result == 1) {
            this.fetchMissionDetail(missionId);
          } else {
            this._toast.error({
              detail: 'ERROR',
              summary: data.message,
              duration: APP_CONFIG.toastDuration,
            });
          }
        });
        this.unsubscribe.push(addMissionFavouriteSubscribe);
      } else {
        const removeMissionFavouriteSubscribe = this._service.removeMissionFavourite(value).subscribe((data: any) => {
          if (data.result == 1) {
            this.fetchMissionDetail(missionId);
          } else {
            this._toast.error({
              detail: 'ERROR',
              summary: data.message,
              duration: APP_CONFIG.toastDuration,
            });
          }
        });
        this.unsubscribe.push(removeMissionFavouriteSubscribe);
      }
    }
  }

  getRecentVolunteerList() {
    const value = {
      missionId: this.missionId,
      userId: this.loginUserId,
    };
    const volunteerListSubscribe = this._service.recentVolunteerList(value).subscribe((data: any) => {
      if (data.result == 1) {
        this.recentVolunteerList = data.data;
        this.recentVolunteerList = this.recentVolunteerList.map((x) => {
          return {
            id: x.id,
            missioId: x.missioId,
            userId: x.userId,
            userName: x.userName,
            userImage: x.userImage
              ? this._service.imageUrl + '/' + x.userImage
              : 'assets/NoImg.png',
          };
        });
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(volunteerListSubscribe);
  }
}