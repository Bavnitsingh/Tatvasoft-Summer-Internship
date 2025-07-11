import { type Routes } from "@angular/router"
import { AuthGuard } from "./main/guards/auth.guard"
import { HomeComponent } from "./main/components/home/home.component"
import { NewMissionComponent } from "./main/components/new-mission/new-mission.component"
import { PrivacyPolicyComponent } from "./main/components/privacy-policy/privacy-policy.component"
import { VolunteeringMissionComponent } from "./main/components/volunteering-mission/volunteering-mission.component"
import { ForgotPasswordComponent } from "./main/components/login-register/forgot-password/forgot-password.component"
import { LoginComponent } from "./main/components/login-register/login/login.component"
import { RegisterComponent } from "./main/components/login-register/register/register.component"
import { ResetPasswordComponent } from "./main/components/login-register/reset-password/reset-password.component"
import { UserEditProfileComponent } from "./main/components/user-edit-profile/user-edit-profile.component"
import { VolunteeringTimesheetComponent } from "./main/components/volunteering-timesheet/volunteering-timesheet.component"

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword", component: ResetPasswordComponent },
  { path: "home", component: HomeComponent },
  { path: "addNewMission", component: NewMissionComponent },
  { path: "volunteeringMission/:missionId", component: VolunteeringMissionComponent, canActivate: [AuthGuard] },
  { path: "userProfile/:userId", component: UserEditProfileComponent, canActivate: [AuthGuard] },
  { path: "privacyPolicy", component: PrivacyPolicyComponent },
  { path: "volunteeringTimesheet", component: VolunteeringTimesheetComponent, canActivate: [AuthGuard] },
  { path: "admin", loadChildren: () => import("./main/components/admin-side/admin-side.route") },
]