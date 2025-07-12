import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms"
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
  selector: "app-add-edit-mission-skill",
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, ReactiveFormsModule, NgIf],
  templateUrl: "./add-edit-mission-skill.component.html",
  styleUrls: ["./add-edit-mission-skill.component.css"],
})
export class AddEditMissionSkillComponent implements OnInit, OnDestroy {
  missionSkillForm: FormGroup
  skillId: any
  editData: any
  private unsubscribe: Subscription[] = [];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: NgToastService,
    private _service: MissionService,
    private _activateRoute: ActivatedRoute,
  ) {
    this.skillId = this._activateRoute.snapshot.paramMap.get("id")
  }

  ngOnInit(): void {
    this.missionSkillFormValidate()
    if (this.skillId != null) {
      this.fetchDataById(this.skillId)
    }
  }
  
  missionSkillFormValidate() {
    this.missionSkillForm = this._fb.group({
      id: [0],
      skillName: ["", Validators.compose([Validators.required])],
      status: ["", Validators.compose([Validators.required])],
    })
  }

  fetchDataById(id: any) {
    const missionSkillSubscription = this._service.missionSkillById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.editData = data.data
          this.missionSkillForm.patchValue(this.editData)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(missionSkillSubscription)
  }

  onSubmit() {
    const value = this.missionSkillForm.value
    if (this.missionSkillForm.valid) {
      if (value.id == 0) {
        this.insertData(value)
      } else {
        this.updateData(value)
      }
    } else {
      ValidateForm.validateAllFormFields(this.missionSkillForm)
    }
  }

  insertData(value: any) {
    const addMissionSkillSubscription = this._service.addMissionSkill(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this._router.navigate(["admin/missionSkill"])
          }, 1000)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(addMissionSkillSubscription);
  }

  updateData(value: any) {
    const updateMissionSkillSubscription = this._service.updateMissionSkill(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this._router.navigate(["admin/missionSkill"])
          }, 1000)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(updateMissionSkillSubscription);
  }

  onCancel() {
    this._router.navigate(["admin/missionSkill"])
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
