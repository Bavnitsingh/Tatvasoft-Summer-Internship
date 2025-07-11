import {
  Component,
  OnDestroy,
  type OnInit,
  type QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionName,
  ListBoxComponent,
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from '../../helpers/validate-form.helper';

import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG } from '../../configs/environment.config';
import { CommonService } from '../../services/common.service';
import { ContactUs, ChangePassword } from '../../interfaces/user.interface';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
declare var window: any;
@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.css'],
  standalone: true,
  imports: [FormsModule, ListBoxModule, ReactiveFormsModule, NavbarComponent, CommonModule]
})
export class UserEditProfileComponent implements OnInit, OnDestroy {
  changePasswordModal: any;
  addyourSkillModal: any;
  contactUsModal: any;
  loginUserId: any;
  loginDetail: any;
  loginName: any;
  loginUserDetails: any;
  countryList: any[] = [];
  cityList: any[] = [];
  skillList: any[] = [];
  skillList1: any[] = [];
  userSkillList: any[] = [];
  isFileUpload = false;
  userImage: any = '';
  formData = new FormData();
  userProfileForm: FormGroup;
  userId: any;
  editData: any;
  firstName: any;
  lastName: any;
  contactUsForm: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _commonService: CommonService,
    private _service: ClientService,
    private _loginService: AuthService,
    private _router: Router,
    private _toast: NgToastService,
    private _fb: FormBuilder,
    private _activateRouter: ActivatedRoute
  ) {
    this.userId = this._activateRouter.snapshot.paramMap.get('userId');
  }

  public data: string[] = [
    'Anthropology',
    'Archeology',
    'Astronomy',
    'Computer Science',
    'Environmental Science',
    'History',
    'Library Sciences',
    'Mathematics',
    'Music Theory',
    'Research',
    'Administrative Support',
    'Customer Service',
    'Data Entry',
    'Executive Admin',
    'Office Management',
    'Office Reception',
    'Program Management',
    'Transactions',
    'Agronomy',
    'Animal Care / Handling',
    'Animal Therapy',
    'Aquarium Maintenance',
    'Botany',
    'Environmental Education',
    'Environmental Policy',
    'Farming',
  ];

  public data1: string[] = [
    'Computer Science',
    'Data Entry',
    'Office Management',
  ];

  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: ['transferTo', 'transferFrom'],
  };

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
      this.loginDetail = this._loginService.getUserDetail();
      data == null
        ? (this.loginUserId = this.loginDetail.userId)
        : (this.loginUserId = data.userId);
      data == null
        ? (this.loginName = this.loginDetail.fullName)
        : (this.loginName = data.fullName);
      data == null
        ? (this.firstName = this.loginDetail.firstName)
        : (this.firstName = data.firstName);
      data == null
        ? (this.lastName = this.loginDetail.lastName)
        : (this.lastName = data.lastName);
      data == null
        ? (this.contactUs.userId = this.loginDetail.userId)
        : (this.contactUs.userId = data.userId);
      data == null
        ? (this.contactUs.name = this.loginDetail.fullName)
        : (this.contactUs.name = data.fullName);
      data == null
        ? (this.contactUs.emailAddress = this.loginDetail.emailAddress)
        : (this.contactUs.emailAddress = data.emailAddress);
    });

    this.userFormCheckValid();
    this.loginUserDetailByUserId(this.loginUserId);

    this.getUserSkill();
    this.fetchData(this.userId);

    this.getCountryList();

    this.changePasswordModal = new window.bootstrap.Modal(
      document.getElementById('changePasswordModal')
    );
    this.addyourSkillModal = new window.bootstrap.Modal(
      document.getElementById('addSkillModal')
    );
    this.contactUsModal = new window.bootstrap.Modal(
      document.getElementById('contactUsModal')
    );
  }
  @ViewChildren(ListBoxComponent)
  private listbox: QueryList<ListBoxComponent>;

  public onSubmitSkillModal(event: ActionName): void {
    let data = [],
      data1 = [];
    if (this.listbox && this.listbox.length) {
      this.listbox.forEach((item: ListBoxComponent, index: number) => {
        if (index === 0) {
          data = item.data;
        } else {
          data1 = item.data;
        }
      });
      this.skillList1 = data1;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

  saveSkill() {
    const value = {
      skill: this.skillList1.join(','),
      userId: this.loginUserId,
    };
    const addUserSkillSubscribe = this._commonService.addUserSkill(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: 'SUCCESS', summary: data.data });
          setTimeout(() => {
            this.closeAddYourSkillModal();
          }, 1000);
        } else {
          this._toast.error({ detail: 'ERROR', summary: data.message });
        }
      },
      (err) => this._toast.error({ detail: 'ERROR', summary: err.message })
    );
    this.unsubscribe.push(addUserSkillSubscribe);
  }

  getUserSkill() {
    const userSkillSubscirbe = this._commonService.getUserSkill(this.loginUserId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          if (data.data.length > 0) {
            this.userSkillList = data.data;
            this.userSkillList = this.userSkillList[0].text.split(',');
          } else {
            this.userSkillList = this.data1;
          }
        } else {
          this._toast.error({ detail: 'ERROR', summary: data.message });
        }
      },
      (err) => this._toast.error({ detail: 'ERROR', summary: err.message })
    );
    this.unsubscribe.push(userSkillSubscirbe);
  }

  getCountryList() {
    const countryListSubscribe = this._commonService.countryList().subscribe((data: any) => {
      if (data.result == 1) {
        this.countryList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(countryListSubscribe);
  }

  getCityList(countryId: any) {
    countryId = countryId.target.value;
    const cityListSubscribe = this._commonService.cityList(countryId).subscribe((data: any) => {
      if (data.result == 1) {
        this.cityList = data.data;
      } else {
        this._toast.error({
          detail: 'ERROR',
          summary: data.message,
          duration: APP_CONFIG.toastDuration,
        });
      }
    });
    this.unsubscribe.push(cityListSubscribe);
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

  onSelectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.formData = new FormData();
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.userImage = e.target.result;
      };

      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append('file', event.target.files[i]);
        this.formData.append('moduleName', 'UserImage');
      }
      this.isFileUpload = true;
    }
  }

  userFormCheckValid() {
    this.userProfileForm = this._fb.group({
      id: [0],
      name: [
        this.firstName,
        Validators.compose([Validators.required, Validators.maxLength(16)]),
      ],
      surname: [
        this.lastName,
        Validators.compose([Validators.required, Validators.maxLength(16)]),
      ],
      employeeId: [''],
      manager: [''],
      title: ['', Validators.compose([Validators.maxLength(255)])],
      department: ['', Validators.compose([Validators.maxLength(16)])],
      myProfile: [null, Validators.compose([Validators.required])],
      whyIVolunteer: [''],
      countryId: [null, Validators.compose([Validators.required])],
      cityId: [null, Validators.compose([Validators.required])],
      avilability: [''],
      linkdInUrl: [''],
      mySkills: ['', Validators.compose([Validators.required])],
      userImage: ['', Validators.compose([Validators.required])],
      userId: [''],
    });
  }

  fetchData(id: any) {
    const userProfileSubscribe = this._service.getUserProfileDetailById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.editData = data.data;
          if (this.editData != undefined) {
            this.userProfileForm = this._fb.group({
              id: [this.editData.id],
              name: [
                this.editData.name,
                Validators.compose([Validators.required]),
              ],
              surname: [
                this.editData.surname,
                Validators.compose([Validators.required]),
              ],
              employeeId: [this.editData.employeeId],
              manager: [this.editData.manager],
              title: [this.editData.title],
              department: [this.editData.department],
              myProfile: [
                this.editData.myProfile,
                Validators.compose([Validators.required]),
              ],
              whyIVolunteer: [this.editData.whyIVolunteer],
              countryId: [
                this.editData.countryId,
                Validators.compose([Validators.required]),
              ],
              cityId: [
                this.editData.cityId,
                Validators.compose([Validators.required]),
              ],
              avilability: [this.editData.avilability],
              linkdInUrl: [this.editData.linkdInUrl],
              mySkills: [
                this.editData.mySkills.split(','),
                Validators.compose([Validators.required]),
              ],
              userImage: [''],
              userId: [this.editData.userId],
            });
            const cityListSubscribe = this._commonService
              .cityList(this.editData.countryId)
              .subscribe((data: any) => {
                this.cityList = data.data;
              });
            if (this.editData.userImage) {
              this.userImage =
                this._service.imageUrl + '/' + this.editData.userImage;
            }
            this.unsubscribe.push(userProfileSubscribe, cityListSubscribe);
          }
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
    
  }

  async onSubmit() {
    let imageUrl = '';
    const formValue = this.userProfileForm.value;
    formValue.userId = this.userId;
    if (this.userProfileForm.valid) {
      if (this.isFileUpload) {
         await this._commonService
          .uploadImage(this.formData)
          .pipe()
          .toPromise()
          .then(
            (res: any) => {
              if (res.success) {
                imageUrl = res.data[0];
              }
            },
            (err) => {
              this._toast.error({
                detail: 'ERROR',
                summary: err.message,
                duration: APP_CONFIG.toastDuration,
              });
            }
          );
      }
      if (this.isFileUpload) {
        formValue.userImage = imageUrl;
      } else {
        formValue.userImage = this.editData.userImage;
      }

      const mySkillLists = formValue.mySkills.join(',');
      formValue.mySkills = mySkillLists;
      formValue.status = true;
      const userProfileUpdateSubscribe = this._service.loginUserProfileUpdate(formValue).subscribe(
        (res: any) => {
          if (res.result == 1) {
            this._toast.success({
              detail: 'SUCCESS',
              summary: res.data,
              duration: APP_CONFIG.toastDuration,
            });
            setTimeout(() => {
              this._router.navigate(['home']);
            }, 1000);
          } else {
            this._toast.error({
              detail: 'ERROR',
              summary: res.message,
              duration: APP_CONFIG.toastDuration,
            });
          }
        },
        (err) => {
          this._toast.error({
            detail: 'ERROR',
            summary: err.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      );
      this.unsubscribe.push(userProfileUpdateSubscribe);
    } else {
      ValidateForm.validateAllFormFields(this.userProfileForm);
    }

  }
  contactUs: ContactUs;
  changePass: ChangePassword;

  onSubmitContactUs(form: NgForm) {
    form.value.userId = this.contactUs.userId;
    form.value.name = this.contactUs.name;
    form.value.emailAddress = this.contactUs.emailAddress;
    const contactUsSubscribe = this._commonService.contactUs(form.value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({
            detail: 'SUCCESS',
            summary: data.data,
            duration: APP_CONFIG.toastDuration,
          });
          setTimeout(() => {
            form.value.subject = '';
            form.value.message = '';
            this.closeContactUsModal();
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
    this.unsubscribe.push(contactUsSubscribe);
  }

  passwordCompareValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('newPassword')?.value === fc.get('confirmPassword')?.value
      ? null
      : { notmatched: true };
  }

  onSubmitChangePassword(changePasswordForm: NgForm) {
    const value = changePasswordForm.value;
    value.userId = this.loginUserId;
    if (changePasswordForm.valid) {
      const changePasswordSubscribe = this._loginService.changePassword(value).subscribe(
        (data: any) => {
          if (data.result == 1) {
            this._toast.success({
              detail: 'SUCCESS',
              summary: data.data,
              duration: APP_CONFIG.toastDuration,
            });
            setTimeout(() => {
              this.closeChangePasswordModal();
              this._loginService.loggedOut();
              this._router.navigate(['']);
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
      this.unsubscribe.push(changePasswordSubscribe);
    }
  }

  onCancel() {
    this._router.navigate(['/']);
  }

  openChangePasswordModal() {
    this.changePasswordModal.show();
  }

  closeChangePasswordModal() {
    this.changePasswordModal.hide();
  }

  openAddYourSkillModal() {
    this.addyourSkillModal.show();
    this.data1 = this.userSkillList;
  }

  closeAddYourSkillModal() {
    this.addyourSkillModal.hide();
    window.location.reload();
  }

  openContactUsModal() {
    this.contactUsModal.show();
  }

  closeContactUsModal() {
    this.contactUsModal.hide();
  }
}