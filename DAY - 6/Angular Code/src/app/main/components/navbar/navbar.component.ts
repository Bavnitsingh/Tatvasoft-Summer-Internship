import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BsDropdownModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogin = false;
  userDetail: any;
  loginUserId: any;
  userImage: any;
  userImages: any;
  private unsubscribe: Subscription[] = [];

  constructor(private _service: AuthService, private _router: Router) {}

  ngOnInit(): void {
    const currentUserSubscribe = this._service
      .getCurrentUser()
      .subscribe((data: any) => {
        const userName = this._service.getUserDetail();
        if (userName != null || data != null) {
          this.isLogin = true;
          data == null
            ? (this.userDetail = userName.fullName)
            : (this.userDetail = data.fullName);
          data == null
            ? (this.loginUserId = userName.userId)
            : (this.loginUserId = data.userId);
          data == null
            ? (this.userImage =
                this._service.imageUrl + '/' + userName.userImage)
            : (this.userImage = this._service.imageUrl + '/' + data.userImage);
        }
      });
    var tokenDetail = this._service.decodedToken();
    if (tokenDetail.userType != 'user') {
      this.isLogin = false;
    }
    this.unsubscribe.push(currentUserSubscribe);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  redirectLogin() {
    this._router.navigate(['']);
  }

  redirectRegister() {
    this._router.navigate(['register']);
  }

  loggedOut() {
    this._service.loggedOut();
    this.isLogin = false;
    this._router.navigate(['']);
  }
}
