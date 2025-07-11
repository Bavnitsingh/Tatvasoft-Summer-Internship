import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { MissionService } from 'src/app/main/services/mission.service';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/main/pipes/filter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mission-application',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NgxPaginationModule, CommonModule, FormsModule, FilterPipe],
  templateUrl: './mission-application.component.html',
  styleUrls: ['./mission-application.component.css']
})
export class MissionApplicationComponent implements OnInit, OnDestroy {
  applicationList: any[] = [];
  searchText: any = "";
  page: number = 1;
  itemsPerPages: number = 5;
  applicationId: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: MissionService, 
    private _toast: NgToastService, 
    private route: Router
  ) { }

  ngOnInit(): void {
    this.fetchMissionApplicationList();
  }

  getStatus(status) {
    return status ? 'Approve' : 'Pending';
  }

  fetchMissionApplicationList() {
    const missionApplicationSubscription = this._service.missionApplicationList().subscribe((data: any) => {
      if (data.result == 1) {
        this.applicationList = data.data;
      }
      else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(missionApplicationSubscription);
  }

  approveMissionApplication(value: any) {
    const missionApplicationSubscription = this._service.missionApplicationApprove(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
        }
      },
      (err) => {
        this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration });
      }
    );
    this.unsubscribe.push(missionApplicationSubscription);
  }
  deleteMissionApplication(value: any) {
    const missionApplicationDeleteSubscription = this._service.missionApplicationDelete(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
        }
      },
      (err) => {
        this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration });
      }
    );
    this.unsubscribe.push(missionApplicationDeleteSubscription);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
