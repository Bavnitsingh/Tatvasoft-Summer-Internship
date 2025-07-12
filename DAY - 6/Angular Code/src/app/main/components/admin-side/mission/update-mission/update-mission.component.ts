import { DatePipe, NgFor, NgIf } from "@angular/common"
import { Component, OnDestroy, type OnInit } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { NgToastService } from "ng-angular-popup"
import { ToastrService } from "ngx-toastr"
import { CommonService } from "src/app/main/services/common.service"
import { MissionService } from "src/app/main/services/mission.service"
import { APP_CONFIG } from "src/app/main/configs/environment.config"
import { SidebarComponent } from "../../sidebar/sidebar.component"
import { HeaderComponent } from "../../header/header.component"
import { Subscription } from "rxjs"

@Component({
  selector: "app-update-mission",
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: "./update-mission.component.html",
  styleUrls: ["./update-mission.component.css"],
})
export class UpdateMissionComponent implements OnInit, OnDestroy {
  missionId: any
  editData: any
  editMissionForm: FormGroup
  formValid: boolean
  countryList: any[] = []
  cityList: any[] = []
  imageUrl: any[] = []
  missionImage: any = ""
  isFileUpload = false
  isDocUpload = false
  missionDocName: any
  missionDocText: any
  formData = new FormData()
  formDoc = new FormData()
  missionThemeList: any[] = []
  missionSkillList: any[] = []
  typeFlag = false
  imageListArray: any = []
  constructor(
    private _fb: FormBuilder,
    private _service: MissionService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _datePipe: DatePipe,
    private _toast: NgToastService,
  ) {
    this.missionId = this._activateRoute.snapshot.paramMap.get("missionId")
    this.editMissionForm = this._fb.group({
      // Initialize editMissionForm here
      id: [""],
      missionTitle: ["", Validators.compose([Validators.required])],
      missionDescription: ["", Validators.compose([Validators.required])],
      countryId: ["", Validators.compose([Validators.required])],
      cityId: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      totalSheets: [""],
      missionThemeId: ["", Validators.compose([Validators.required])],
      missionSkillId: ["", Validators.compose([Validators.required])],
      missionImages: [""],
    });

    if (this.missionId != 0) {
      this.fetchDetail(this.missionId)
    }
  }
  private unsubscribe: Subscription[] = [];
  

  ngOnInit(): void {
    this.getCountryList()
    this.getMissionSkillList()
    this.getMissionThemeList()
    this.missionDocText = ""
  }

  getCountryList() {
    const countryListSubscription = this._commonService.countryList().subscribe((data: any) => {
      if (data.result == 1) {
        this.countryList = data.data
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
      }
    })
    this.unsubscribe.push(countryListSubscription);
  }
  getCityList(countryId: any) {
    countryId = countryId.target.value
    const cityListSubscription = this._commonService.cityList(countryId).subscribe((data: any) => {
      if (data.result == 1) {
        this.cityList = data.data
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
      }
    })
    this.unsubscribe.push(cityListSubscription);
  }
  hideOrShow(e: any) {
    if (e.target.value == "Time") {
      this.typeFlag = true
    } else {
      this.typeFlag = false
    }
  }
  getMissionSkillList() {
    const getMissionSkillListSubscription = this._service.getMissionSkillList().subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.missionSkillList = data.data
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(getMissionSkillListSubscription);
  }
  getMissionThemeList() {
    const getMissionThemeListSubscription = this._service.getMissionThemeList().subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.missionThemeList = data.data
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(getMissionThemeListSubscription);
  }
  fetchDetail(id: any) {
    const fetchDetailSubscription = this._service.missionDetailById(id).subscribe((data: any) => {
      this.editData = data.data
      const startDateformat = this._datePipe.transform(this.editData.startDate, "yyyy-MM-dd")
      this.editData.startDate = startDateformat
      const endDateformat = this._datePipe.transform(this.editData.endDate, "yyyy-MM-dd")
      this.editData.endDate = endDateformat
      const registrationDeadLineDateformat = this._datePipe.transform(this.editData.registrationDeadLine, "yyyy-MM-dd")
      this.editData.registrationDeadLine = registrationDeadLineDateformat
      this.editMissionForm.patchValue({
        id: this.editData.id,
        missionTitle: this.editData.missionTitle,
        missionDescription: this.editData.missionDescription,
        countryId: this.editData.countryId,
        cityId: this.editData.cityId,
        startDate: this.editData.startDate,
        endDate: this.editData.endDate,
        totalSheets: this.editData.totalSheets,
        missionThemeId: this.editData.missionThemeId,
        missionSkillId: this.editData.missionSkillId?.split(","),
        missionImages: "",
      });

      const cityListSubscription = this._commonService.cityList(this.editData.countryId).subscribe((data: any) => {
        this.cityList = data.data
      })
      if (this.editData.missionImages) {
        const imageList = this.editData.missionImages
        this.imageUrl = imageList.split(",")
        for (const photo of this.imageUrl) {
          this.imageListArray.push(this._service.imageUrl + "/" + photo.replaceAll("\\", "/"))
        }
      }
      this.unsubscribe.push(cityListSubscription);
    })
    this.unsubscribe.push(fetchDetailSubscription);
  }
  get countryId() {
    return this.editMissionForm.get("countryId") as FormControl
  }
  get cityId() {
    return this.editMissionForm.get("cityId") as FormControl
  }
  get missionTitle() {
    return this.editMissionForm.get("missionTitle") as FormControl
  }
  get missionDescription() {
    return this.editMissionForm.get("missionDescription") as FormControl
  }
  get startDate() {
    return this.editMissionForm.get("startDate") as FormControl
  }
  get endDate() {
    return this.editMissionForm.get("endDate") as FormControl
  }
  get missionThemeId() {
    return this.editMissionForm.get("missionThemeId") as FormControl
  }
  get missionSkillId() {
    return this.editMissionForm.get("missionSkillId") as FormControl
  }
  get missionImages() {
    return this.editMissionForm.get("missionImages") as FormControl
  }

  onSelectedImage(event: any) {
    const files = event.target.files
    if (this.imageListArray.length > 5) {
      return this._toast.error({ detail: "ERROR", summary: "Maximum 6 images can be added.", duration: APP_CONFIG.toastDuration })
    }
    if (files) {
      for (const file of files) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.imageListArray.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
      for (let i = 0; i < files.length; i++) {
        this.formData.append("file", files[i])
        this.formData.append("moduleName", "Mission")
      }
      this.isFileUpload = true
    }
  }

  async onSubmit() {
    this.formValid = true
    const value = this.editMissionForm.value
    let updateImageUrl : any [] = []
    var SkillLists = Array.isArray(value.missionSkillId) ? value.missionSkillId.join(",") : ""
    value.missionSkillId = SkillLists

    if (this.editMissionForm.valid) {
      if (this.isFileUpload) {
        console.log(this.formData);
        await this._commonService
          .uploadImage(this.formData)
          .pipe()
          .toPromise()
          .then(
            (res: any) => {
              if (res.success) {
                updateImageUrl = res.data
              }
            },
            (err) => this._toast.error({ detail: "ERROR", summary: err.error.message }),
          )
      }
      if (this.isFileUpload) {
        let imageList = updateImageUrl.map(e => e.replace(/\s/g, "")).join(",");
        value.missionImages = imageList;
      } else {
        value.missionImages = this.editData.missionImages
      }
      const updateMissionSubscription = this._service.updateMission(value).subscribe(
        (data: any) => {
          if (data.result == 1) {
            //this.toastr.success(data.data);
            this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
            setTimeout(() => {
              this._router.navigate(["admin/mission"])
            }, 1000)
          } else {
            this._toastr.error(data.message)
            // this._toast.error({detail:"ERROR",summary:data.message,duration:3000});
          }
        },
        (err) => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }),
      )
      this.unsubscribe.push(updateMissionSubscription);
    }
  }
  onCancel() {
    this._router.navigateByUrl
    ("admin/mission")
  }
  onRemoveImage(item: any) {
    const index: number = this.imageListArray.indexOf(item)
    if (item !== -1) {
      this.imageListArray.splice(index, 1)
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
