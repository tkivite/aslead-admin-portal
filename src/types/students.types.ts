import { Application } from "./applications.types";

export interface Student {
  studentId: number;
  applicant: {
    applicantId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    citizenship: string;
    currentEducationLevel: string;
    createdAt: string;
    updatedAt: string;
  };
  application: Application;
  enrollmentStatus: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  admissionNumber: string;
}
export interface Program {
  programId: number;
  code: string;
  name: string;
  description: string;
  durationMonths: number;
  tuitionFee: number;
  applicationFee: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  costs?: Array<{
    id: number;
    description: string;
    amount: number;
  }>;
}

export interface Campus {
  id: number;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
