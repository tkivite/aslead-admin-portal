import { Application } from "./applications.types";

export interface Student {
  studentId: number;
  applicant: {
    applicantId: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    citizenship: string;
    currentEducationLevel: string;
    createdAt: string;
    updatedAt: string;
    documentType: string;
    documentNumber: number;
  };
  application: Application;
  enrollmentStatus: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  admissionNumber: string;
}

export interface Campus {
  id: number;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditStudentData {
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    citizenship: string;
    currentEducationLevel: string;
  };
  programId: number;
  campusId: number;
  enrollmentStatus: string;
}
