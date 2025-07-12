import { type Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { MissionComponent } from './mission/mission.component';
import { MissionApplicationComponent } from './mission-application/mission-application.component';
import { MissionthemeComponent } from './mission-theme/missiontheme.component';
import { MissionskillComponent } from './mission-skill/missionskill.component';
import { AddMissionComponent } from './mission/add-mission/add-mission.component';
import { UpdateMissionComponent } from './mission/update-mission/update-mission.component';
import { AddEditMissionThemeComponent } from './mission-theme/add-edit-mission-theme/add-edit-mission-theme.component';
import { AddEditMissionSkillComponent } from './mission-skill/add-edit-mission-skill/add-edit-mission-skill.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserTypeGuard } from '../../guards/user-type.guard';
import { ProfileComponent } from './profile/profile.component';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [UserTypeGuard],
  },
  { path: 'user', component: UserComponent, canActivate: [UserTypeGuard] },
  {
    path: 'mission',
    component: MissionComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'missionApplication',
    component: MissionApplicationComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'missionTheme',
    component: MissionthemeComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'missionSkill',
    component: MissionskillComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'addMission',
    component: AddMissionComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'updateMission/:missionId',
    component: UpdateMissionComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'addMissionTheme',
    component: AddEditMissionThemeComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'updateMissionTheme/:id',
    component: AddEditMissionThemeComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'addMissionSkill',
    component: AddEditMissionSkillComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'updateMissionSkill/:id',
    component: AddEditMissionSkillComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'addUser',
    component: AddUserComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'updateUser/:userId',
    component: UpdateUserComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'updateProfile/:userId',
    component: UpdateUserComponent,
    canActivate: [UserTypeGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserTypeGuard],
  },
] as Routes;
