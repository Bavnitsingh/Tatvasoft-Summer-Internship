import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { APP_CONFIG } from "src/app/main/configs/environment.config"
import ValidateForm from "src/app/main/helpers/validate-form.helper"
import { MissionService } from "src/app/main/services/mission.service"
import { HeaderComponent } from "../../header/header.component"
import { SidebarComponent } from "../../sidebar/sidebar.component"
import { NgIf } from "@angular/common"
import { Subscription } from "rxjs"

@Component({
  selector: "app-add-edit-mission-theme",
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, ReactiveFormsModule, NgIf],
  templateUrl: "./add-edit-mission-theme.component.html",
  styleUrls: ["./add-edit-mission-theme.component.css"],
})
export class AddEditMissionThemeComponent implements OnInit, OnDestroy {
  // Component implementation
  missionThemeForm: FormGroup
  themeId: any
  editData: any
  private unsubscribe: Subscription[] = [];
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: NgToastService,
    private _service: MissionService,
    private _activeRoute: ActivatedRoute,
  ) {
    this.themeId = this._activeRoute.snapshot.paramMap.get("id")
    if (this.themeId != null) {
      this.fetchDataById(this.themeId)
    }
  }

  ngOnInit(): void {
    this.missionThemeFormValidate()
  }

  missionThemeFormValidate() {
    this.missionThemeForm = this._fb.group({
      id: [0],
      themeName: ["", Validators.compose([Validators.required])],
      status: ["", Validators.compose([Validators.required])],
    })
  }

  fetchDataById(id: any) {
    const missionThemeSubscribe = this._service.missionThemeById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.editData = data.data
          this.missionThemeForm.patchValue(this.editData)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(missionThemeSubscribe)
  }

  onSubmit() {
    const value = this.missionThemeForm.value
    if (this.missionThemeForm.valid) {
      if (value.id == 0) {
        this.insertData(value)
      } else {
        this.updateData(value)
      }
    } else {
      ValidateForm.validateAllFormFields(this.missionThemeForm)
    }
  }

  insertData(value: any) {
    const missionThemeSubscribe = this._service.addMissionTheme(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this._router.navigate(["admin/missionTheme"])
          }, 1000)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(missionThemeSubscribe)
  }

  updateData(value: any) {
    const updateMissionThemeSubscribe = this._service.updateMissionTheme(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this._router.navigate(["admin/missionTheme"])
          }, 1000)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(updateMissionThemeSubscribe);
  }

  onCancel() {
    this._router.navigateByUrl("admin/missionTheme")
  }
  
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
