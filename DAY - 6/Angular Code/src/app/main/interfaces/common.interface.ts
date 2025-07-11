/**
 * Common interfaces for use across components
 */

// Generic item interface for dropdown components
export interface DropdownItem {
  id: string | number;
  name: string;
  value?: any;
  disabled?: boolean;
}

// Generic option interface for select/radio/checkbox components
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Generic data interface for table components
export interface TableData {
  id: string | number;
  [key: string]: any;
}

// Pagination interface for paginated components
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
}

// Form field interface for form components
export interface FormField {
  name: string;
  label: string;
  type: string;
  value?: any;
  required?: boolean;
  validators?: any[];
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

// User interface for user-related components
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

// Configuration interface for component settings
export interface ComponentConfig {
  id?: string;
  className?: string;
  style?: Record<string, string>;
  [key: string]: any;
}

// Event handler interface for component events
export interface EventHandlers {
  onClick?: (event: any) => void;
  onChange?: (event: any) => void;
  onSubmit?: (data: any) => void;
  [key: string]: ((event: any) => void) | undefined;
}

// API Response interface
export interface ApiResponse<T> {
  result: number;
  success?: boolean;
  data: T;
  message: string;
}

// Country interface
export interface Country {
  id: number;
  name: string;
  ISO: string;
}

// City interface
export interface City {
  id: number;
  countryId: number;
  name: string;
}

// Mission Theme interface
export interface MissionTheme {
  id: number;
  title: string;
  status: boolean;
}

// Mission Skill interface
export interface MissionSkill {
  id: number;
  skillName: string;
  status: boolean;
}

// Mission interface
export interface Mission {
  id: number;
  missionTitle: string;
  missionDescription: string;
  missionOrganisationName?: string;
  missionOrganisationDetail?: string;
  countryId: number;
  cityId: number;
  missionType?: string;
  startDate: string;
  endDate: string;
  totalSheets: number;
  registrationDeadLine?: string;
  missionTheme?: string;
  missionThemeId: number;
  missionSkill?: string;
  missionSkillId: string | string[];
  missionImages?: string;
  missionDocuments?: string;
  missionAvilability?: boolean;
}

// Mission Form interface
export interface MissionForm {
  id?: number;
  missionTitle: string;
  missionDescription: string;
  countryId: number;
  cityId: number;
  startDate: string;
  endDate: string;
  totalSheets: number;
  missionThemeId: number;
  missionSkillId: string | string[];
  missionImages?: string;
}
