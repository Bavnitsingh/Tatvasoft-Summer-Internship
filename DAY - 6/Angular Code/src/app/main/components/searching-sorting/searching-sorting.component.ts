import { Component, OnDestroy, type OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG } from '../../configs/environment.config';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searching-sorting',
  templateUrl: './searching-sorting.component.html',
  styleUrls: ['./searching-sorting.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SearchingSortingComponent implements OnInit, OnDestroy {
  missionCountryList: any[] = [];
  missionCityList: any[] = [];
  missionThemeList: any[] = [];
  missionSkillList: any[] = [];
  private unsubscribe: Subscription[] = [];
  
  constructor(private _service: CommonService, private _toast: NgToastService) {}
  
  ngOnInit(): void {
    this.getMissionCountryList();
    this.getMissionCityList();
    this.getMissionThemeList();
    this.getMissionSkillList();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

  getMissionCountryList() {
    const missionCountryListSubscribe = this._service.getMissionCountryList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionCountryList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(missionCountryListSubscribe);
  }

  getMissionCityList() {
    const missionCityListSubscribe = this._service.getMissionCityList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionCityList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(missionCityListSubscribe);
  }

  getMissionThemeList() {
    const missionThemeListSubscribe = this._service.getMissionThemeList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionThemeList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(missionThemeListSubscribe);
  }

  getMissionSkillList() {
    const missionSkillListSubscribe = this._service.getMissionSkillList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionSkillList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(missionSkillListSubscribe);
  }

  onTextChange(text: any) {
    this._service.searchList.next(text);
  }

  onChange(e: any) {
    this._service.searchList.next(e.target.value);
  }
}