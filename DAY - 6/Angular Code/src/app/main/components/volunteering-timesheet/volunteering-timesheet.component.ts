import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from '../../helpers/validate-form.helper';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG } from '../../configs/environment.config';
import { VolunteeringTimeSheetService } from '../../services/volunteering-timesheet.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
declare var window: any;
@Component({
  selector: 'app-volunteering-timesheet',
  templateUrl: './volunteering-timesheet.component.html',
  styleUrls: ['./volunteering-timesheet.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, CommonModule]
})
export class VolunteeringTimesheetComponent implements OnInit, OnDestroy {
  volunteeringHourseModals: any;
  volunteeringGoalsModals: any;
  deleteModal: any;
  volunteeringHoursForm: FormGroup;
  volunteeringGoalsForm: FormGroup;
  missionList: any;
  hoursList: any;
  goalsList: any;
  editData: any;
  loginDetail: any;
  loginUserId: any;
  hoursId: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: VolunteeringTimeSheetService,
    private _loginService: AuthService,
    private _toast: NgToastService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.volunteeringHourseModals = new window.bootstrap.Modal(
      document.getElementById('volunteeringHoursModal')
    );
    this.volunteeringGoalsModals = new window.bootstrap.Modal(
      document.getElementById('volunteeringGoalsModal')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('removeVolunteeringModal')
    );
    this.volunteeringHoursFormValidate();
    this.volunteeringGoalsFormValidate();
    const currentUserSubscribe = this._loginService.getCurrentUser().subscribe((data: any) => {
      this.loginDetail = this._loginService.getUserDetail();
      data == null
        ? (this.loginUserId = this.loginDetail.userId)
        : (this.loginUserId = data.userId);
    });
    this.unsubscribe.push(currentUserSubscribe);
    this.getVolunteeringHoursList();
    this.getVolunteeringGoalsList();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

  openVolunteeringHoursModal() {
    this.volunteeringHourseModals.show();
    this.missionTitleList();
  }

  closeVolunteeringHoursModal() {
    this.volunteeringHourseModals.hide();
    window.location.reload();
  }

  openVolunteeringGoalsModal() {
    this.volunteeringGoalsModals.show();
    this.missionTitleList();
  }

  closeVolunteeringGoalsModal() {
    this.volunteeringGoalsModals.hide();
    window.location.reload();
  }
  
  openVolunteeringDeleteModal(id: any) {
    this.deleteModal.show();
    this.hoursId = id;
  }

  closeVolunteeringDeleteModal() {
    this.deleteModal.hide();
  }

  missionTitleList() {
    const volunteeringMissionSubscribe = this._service.volunteeringMissionList(this.loginUserId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.missionList = data.data;
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
    this.unsubscribe.push(volunteeringMissionSubscribe);
  }

  //*****************************************Volunteering TimeSheet Hours ************************************************** */

  volunteeringHoursFormValidate() {
    this.volunteeringHoursForm = this._fb.group({
      id: [0],
      missionId: [null, Validators.compose([Validators.required])],
      dateVolunteered: [null, Validators.compose([Validators.required])],
      hours: [null, Validators.compose([Validators.required])],
      minutes: [null, Validators.compose([Validators.required])],
      message: [null, Validators.compose([Validators.required])],
    });
  }

  getVolunteeringHoursList() {
    const volunteeringHoursSubscribe = this._service.getVolunteeringHoursList(this.loginUserId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.hoursList = data.data;
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
    this.unsubscribe.push(volunteeringHoursSubscribe);
  }

  getVolunteeringHoursById(id: any) {
    const volunteeringHoursSubscribe = this._service.getVolunteeringHoursById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.editData = data.data;
          const dateformat = this._datePipe.transform(
            this.editData.dateVolunteered,
            'yyyy-MM-dd'
          );
          this.editData.dateVolunteered = dateformat;
          this.volunteeringHoursForm.patchValue(this.editData);
          this.openVolunteeringHoursModal();
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
    this.unsubscribe.push(volunteeringHoursSubscribe);
  }

  onVolunteringHoursSubmit() {
    const value = this.volunteeringHoursForm.value;
    value.userId = this.loginUserId;
    if (value.id == 0 || value.id == null) {
      this.insertVolunteeringHours(value);
    } else {
      this.updateVolunteeringHours(value);
    }
  }

  insertVolunteeringHours(value: any) {
    if (this.volunteeringHoursForm.valid) {
      const volunteeringHoursSubscribe = this._service.addVolunteeringHours(value).subscribe((data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.volunteeringHoursForm.reset();
            this.closeVolunteeringHoursModal();
            window.location.reload();
          }, 1000);
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      });
      this.unsubscribe.push(volunteeringHoursSubscribe);
    } else {
      ValidateForm.validateAllFormFields(this.volunteeringHoursForm);
    }
  }

  updateVolunteeringHours(value: any) {
    if (this.volunteeringHoursForm.valid) {
      const volunteeringHoursSubscribe = this._service.updateVolunteeringHours(value).subscribe((data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.volunteeringHoursForm.reset();
            this.closeVolunteeringHoursModal();
            window.location.reload();
          }, 1000);
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      });
      this.unsubscribe.push(volunteeringHoursSubscribe);
    } else {
      ValidateForm.validateAllFormFields(this.volunteeringHoursForm);
    }
  }

  deleteVolunteeringHours() {
    const volunteeringHoursSubscribe = this._service.deleteVolunteeringHours(this.hoursId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.closeVolunteeringDeleteModal();
            window.location.reload();
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
    this.unsubscribe.push(volunteeringHoursSubscribe);
  }

  //*****************************************Volunteering TimeSheet Goals ************************************************** */
  volunteeringGoalsFormValidate() {
    this.volunteeringGoalsForm = this._fb.group({
      id: [0],
      missionId: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      action: [null, Validators.compose([Validators.required])],
      message: [null, Validators.compose([Validators.required])],
    });
  }

  getVolunteeringGoalsList() {
    const volunteeringGoalsSubscribe = this._service.getVolunteeringGoalsList(this.loginUserId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.goalsList = data.data;
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
    this.unsubscribe.push(volunteeringGoalsSubscribe);
  }

  getVolunteeringGoalsById(id: any) {
    const volunteeringGoalsSubscribe = this._service.getVolunteeringGoalsById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.editData = data.data;
          const dateformat = this._datePipe.transform(
            this.editData.date,
            'yyyy-MM-dd'
          );
          this.editData.date = dateformat;
          this.volunteeringGoalsForm.patchValue(this.editData);
          this.openVolunteeringGoalsModal();
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
    this.unsubscribe.push(volunteeringGoalsSubscribe);
  }

  onVolunteringGoalsSubmit() {
    const value = this.volunteeringGoalsForm.value;
    value.userId = this.loginUserId;
    if (value.id == 0 || value.id == null) {
      this.insertVolunteeringGoals(value);
    } else {
      this.updateVolunteeringGoals(value);
    }
  }

  insertVolunteeringGoals(value: any) {
    if (this.volunteeringGoalsForm.valid) {
      const volunteeringGoalsSubscribe = this._service.addVolunteeringGoals(value).subscribe((data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.volunteeringGoalsForm.reset();
            this.closeVolunteeringGoalsModal();
            window.location.reload();
          }, 1000);
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      });
      this.unsubscribe.push(volunteeringGoalsSubscribe);
    } else {
      ValidateForm.validateAllFormFields(this.volunteeringGoalsForm);
    }
  }

  updateVolunteeringGoals(value: any) {
    if (this.volunteeringGoalsForm.valid) {
      const volunteeringGoalsSubscribe = this._service.updateVolunteeringGoals(value).subscribe((data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.volunteeringGoalsForm.reset();
            this.closeVolunteeringGoalsModal();
            window.location.reload();
          }, 1000);
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      });
      this.unsubscribe.push(volunteeringGoalsSubscribe);
    } else {
      ValidateForm.validateAllFormFields(this.volunteeringGoalsForm);
    }
  }

  deleteVolunteeringGoals() {
    const volunteeringGoalsSubscribe = this._service.deleteVolunteeringGoals(this.hoursId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            this.closeVolunteeringDeleteModal();
            window.location.reload();
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
    this.unsubscribe.push(volunteeringGoalsSubscribe);
  }
}