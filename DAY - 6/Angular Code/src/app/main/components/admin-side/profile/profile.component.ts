import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { AuthService } from 'src/app/main/services/auth.service';
import { ClientService } from 'src/app/main/services/client.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  loginUserDetails: any;
  private unsubscribe: Subscription[] = [];
  loginUserId: any;
  loginDetail: any;

  constructor(
    private _loginService: AuthService,
    private _service: ClientService,
    private _toast: NgToastService
  ) {}

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
  });

  ngOnInit(): void {
    this.loginDetail = this._loginService.getUserDetail();
    this.loginUserDetailByUserId(this.loginDetail.userId);
  }

  loginUserDetailByUserId(id: any) {
    const userDetailSubscribe = this._service.loginUserDetailById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.loginUserDetails = data.data;
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
    this.unsubscribe.push(userDetailSubscribe);
  }

  getFullImageUrl(relativePath: string): string {
    return relativePath ? `${APP_CONFIG.imageBaseUrl}/${relativePath}` : '';
  }

  hasValidProfileImage(): boolean {
    return (
      this.loginUserDetails &&
      this.loginUserDetails.profileImage &&
      this.loginUserDetails.profileImage.trim() !== ''
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
