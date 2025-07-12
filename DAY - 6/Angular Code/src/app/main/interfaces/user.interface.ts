export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  userType: string;
  userImage: any;
}

export interface UserDetail {
  id: number;
  userId: number;
  name: string;
  surname: string;
  employeeId: string;
  manager: string;
  title: string;
  department: string;
  myProfile: string;
  whyIVolunteer: string;
  countryId: number;
  cityId: number;
  avilability: string;
  linkdInUrl: string;
  mySkills: any;
  userImage: string;
  status: any;
}

export interface ContactUs {
  id: number;
  userId: number;
  name: string;
  emailAddress: string;
  subject: string;
  message: string;
}

export interface ChangePassword {
  id: number;
  userId: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
