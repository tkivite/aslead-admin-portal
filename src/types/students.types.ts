import { Application } from "./applications.types"

export interface Student {
  studentId: number
  applicant: {
    applicantId: number
    firstName: string
    lastName: string
    email: string
    mobile: string
    dob: string
    citizenship: string
    currentEducationLevel: string
    createdAt: string
    updatedAt: string
  }
  application: Application
  enrollmentStatus: string
  enrolledAt: string
  createdAt: string
  updatedAt: string
}
