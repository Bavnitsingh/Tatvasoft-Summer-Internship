export interface VolunteeringHours {
  timesheetId?: number
  userId?: number
  missionId?: number
  timesheet?: Date
  hour?: number
  minute?: number
  action?: number
  dateVolunteered?: Date
  notes?: string
  status?: string
  createdDate?: Date
  missionTitle?: string
}

export interface VolunteeringGoals {
  timesheetId?: number
  userId?: number
  missionId?: number
  action?: number
  dateVolunteered?: Date
  message?: string
  status?: string
  createdDate?: Date
  missionTitle?: string
}
