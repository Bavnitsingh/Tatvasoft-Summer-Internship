import { Component, OnDestroy, ViewChild, type OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/main/services/auth.service';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/main/services/client.service';
import { Role } from 'src/app/main/enums/roles.enum';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, ReactiveFormsModule, NgIf],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(
    private _fb: FormBuilder,
    private _service: AuthService,
    private _clientService: ClientService,
    private _toastr: ToastrService,
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _toast: NgToastService
  ) {}
  updateForm: FormGroup;
  formValid: boolean;
  userId: string; // Store the user ID
  updateData: any;
  isupdateProfile: boolean;
  currentLoggedInUser: any;
  headText: string = 'Update User';
  userImage: any = '';
  selectedFile: File;
  previewUrl: string | ArrayBuffer;
  @ViewChild('imageInput') imageInputRef: any;

  ngOnInit(): void {
    // Initialize updateForm as an empty FormGroup instance
    this.updateForm = this._fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      emailAddress: ['', [Validators.required, Validators.email]],
    });
    const url = this._router.url;
    if (url.includes('updateProfile')) {
      this.isupdateProfile = true;
      this.headText = 'Update Profile';
    }
    this.currentLoggedInUser = this._service.getUserDetail();

    // Extract user ID from route params
    this.userId = this._activateRoute.snapshot.paramMap.get('userId');
    if (this.userId && this.currentLoggedInUser) {
      const currentRole = this.currentLoggedInUser.userType;
      if (currentRole != Role.Admin) {
        if (this.userId != this.currentLoggedInUser.userId) {
          this._toast.error({
            detail: 'ERROR',
            summary: 'You are not authorized to access this page',
            duration: APP_CONFIG.toastDuration,
          });
          history.back();
        }
      }
      // Call method to fetch user data by ID
      this.fetchDetail(this.userId);
    }
  }

  passwordCompareValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('password')?.value === fc.get('confirmPassword')?.value
      ? null
      : { notmatched: true };
  }
  get firstName() {
    return this.updateForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.updateForm.get('lastName') as FormControl;
  }
  get phoneNumber() {
    return this.updateForm.get('phoneNumber') as FormControl;
  }
  get emailAddress() {
    return this.updateForm.get('emailAddress') as FormControl;
  }
  // Define getters for other form controls

  fetchDetail(id: any) {
    const getUserSubscribe = this._clientService
      .loginUserDetailById(id)
      .subscribe((data: any) => {
        this.updateData = data.data;
        this.updateForm = this._fb.group({
          id: [this.updateData.id],
          firstName: [
            this.updateData.firstName,
            Validators.compose([Validators.required]),
          ],
          lastName: [
            this.updateData.lastName,
            Validators.compose([Validators.required]),
          ],
          phoneNumber: [
            this.updateData.phoneNumber,
            Validators.compose([
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(10),
            ]),
          ],
          emailAddress: [
            {
              value: this.updateData.emailAddress,
              disabled: this.isupdateProfile,
            },
            Validators.compose([Validators.required, Validators.email]),
          ],
          userType: [this.updateData.userType],
        });
      });
    this.unsubscribe.push(getUserSubscribe);
  }

  onSubmit() {
    this.formValid = true;
    if (this.updateForm.valid) {
      const formData = new FormData();
      const updatedUserData = this.updateForm.getRawValue();
      Object.keys(updatedUserData).forEach((key) => {
        formData.append(key, updatedUserData[key]);
      });

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      const updateUserSubscribe = this._service.updateUser(formData).subscribe(
        (data: any) => {
          if (data.result == 1) {
            this._toast.success({
              detail: 'SUCCESS',
              summary: this.isupdateProfile
                ? 'Profile Updated Successfully'
                : data.data,
              duration: APP_CONFIG.toastDuration,
            });
            setTimeout(() => {
              if (this.isupdateProfile) {
                this._router.navigate(['admin/profile']);
              } else {
                this._router.navigate(['admin/user']);
              }
            }, 1000);
          } else {
            this._toastr.error(data.message);
          }
        },
        (err) =>
          this._toast.error({
            detail: 'ERROR',
            summary: err.message,
            duration: APP_CONFIG.toastDuration,
          })
      );
      this.formValid = false;
      this.unsubscribe.push(updateUserSubscribe);
    }
  }

  onCancel() {
    if (this.isupdateProfile) {
      this._router.navigate(['admin/profile']);
    } else {
      this._router.navigateByUrl('admin/user');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  getFullImageUrl(imagePath: string): string {
    return imagePath ? `${APP_CONFIG.imageBaseUrl}/${imagePath}` : '';
  }

  triggerImageInput(): void {
    this.imageInputRef.nativeElement.click();
  }

  cancelImageChange(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.updateData.profileImage = null;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/Images/default-user.png';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
