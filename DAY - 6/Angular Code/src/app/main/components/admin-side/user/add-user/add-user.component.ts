import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { AuthService } from 'src/app/main/services/auth.service';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, ReactiveFormsModule, NgIf],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  addUserForm!: FormGroup;
  formValid = false;
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.addUserForm = this.fb.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        phoneNumber: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        emailAddress: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10),
          ],
        ],
        confirmPassword: [null, Validators.required],
      },
      {
        validators: [this.passwordCompareValidator],
      }
    );
  }

  passwordCompareValidator(fc: AbstractControl): ValidationErrors | null {
    const password = fc.get('password')?.value;
    const confirmPassword = fc.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notmatched: true };
  }

  // Getters for template binding
  get firstName() {
    return this.addUserForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.addUserForm.get('lastName') as FormControl;
  }
  get phoneNumber() {
    return this.addUserForm.get('phoneNumber') as FormControl;
  }
  get emailAddress() {
    return this.addUserForm.get('emailAddress') as FormControl;
  }
  get password() {
    return this.addUserForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.addUserForm.get('confirmPassword') as FormControl;
  }

  onSubmit(): void {
    this.formValid = true;

    if (this.addUserForm.valid) {
      const { confirmPassword, ...formValues } = this.addUserForm.value;

      // Ensure backend PascalCase keys
      const userData = {
        FirstName: formValues.firstName,
        LastName: formValues.lastName,
        EmailAddress: formValues.emailAddress,
        PhoneNumber: formValues.phoneNumber,
        Password: formValues.password,
        UserType: 'user',
      };

      const sub = this.authService.addUser(userData).subscribe({
        next: (response: any) => {
          if (response.result === 1) {
            this.toast.success({
              detail: 'SUCCESS',
              summary: response.data,
              duration: APP_CONFIG.toastDuration,
            });
            setTimeout(() => this.router.navigate(['admin/user']), 1000);
          } else {
            this.toast.error({
              detail: 'ERROR',
              summary: response.message,
              duration: APP_CONFIG.toastDuration,
            });
          }
        },
        error: () => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Something went wrong!',
            duration: APP_CONFIG.toastDuration,
          });
        },
      });

      this.unsubscribe.push(sub);
      this.formValid = false;
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('admin/user');
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }
}
