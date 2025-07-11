import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { MissionService } from 'src/app/main/services/mission.service';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FilterPipe } from 'src/app/main/pipes/filter.pipe';
import { Subscription } from 'rxjs';
declare var window: any;
@Component({
  selector: 'app-missionskill',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, RouterModule, NgxPaginationModule, NgStyle, NgIf, FilterPipe, NgFor],
  templateUrl: './missionskill.component.html',
  styleUrls: ['./missionskill.component.css']
})
export class MissionskillComponent implements OnInit, OnDestroy {
  missionSkillList: any[] = [];
  deleteSkillmodal: any;
  page: number = 1;
  itemsPerPages: number = 10;
  searchText: any;
  skillId: any;
  private unsubscribe: Subscription[] = [];
  
  constructor(
    private _service: MissionService, 
    private _route: Router, 
    private _toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.getMissionSkillList();
    this.deleteSkillmodal = new window.bootstrap.Modal(
      document.getElementById('removeMissionSkillModal')
    );
  }
  getMissionSkillList() {
    const missionSkillList = this._service.missionSkillList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionSkillList = data.data;
      }
      else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(missionSkillList);
  }

  openDeleteSkillModal(id: any) {
    this.deleteSkillmodal.show();
    this.skillId = id;
  }
  closeDeleteSkillModal() {
    this.deleteSkillmodal.hide();
  }
  deleteSkillModal() {
    const deleteMissionSkillSubscribe = this._service.deleteMissionSkill(this.skillId).subscribe((data: any) => {
      if (data.result == 1) {
        this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration });
        this.closeDeleteSkillModal();
        setTimeout(() => {
          this._route.navigate(['admin/missionSkill']);
        }, 1000);
      }
      else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(deleteMissionSkillSubscribe);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
