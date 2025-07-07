
export interface Application {
  applicationId: number
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
  program: {
    programId: number
    code: string
    name: string
    description: string
    durationMonths: number
    tuitionFee: number
  }
  campus: {
    id: number
    name: string
    location: string
  }
  status: string
  feeAmount: number
  feePaymentStatus: string
  paymentReference: string
  submittedAt: string
  createdAt: string
  updatedAt: string
}



// Enrollment types
export interface EnrollmentRequest {
  applicant: {
    applicantId: number;
  };
  enrollmentStatus: string;
  enrolledAt: string;
}

export interface Applicant {
  applicantId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  citizenship: string;
  currentEducationLevel: string;
  createdAt: string;
  updatedAt: string;
}
export interface Document {
  documentId: number
  content: string // Base64 encoded content
  documentType: string
}