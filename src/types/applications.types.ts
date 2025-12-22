export interface Application {
  applicationId: number;
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
    documentType: string;
    documentNumber: number
  };
  program: {
    programId: number;
    code: string;
    name: string;
    description: string;
    durationMonths: number;
    tuitionFee: number;
  };
  campus: {
    id: number;
    name: string;
    location: string;
  };
  status: string;
  feeAmount: number;
  feePaymentStatus: string;
  paymentReference: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment types
export interface EnrollmentRequest {
  applicant: {
    applicantId: number;
  };
  application: {
    applicationId: number;
  };
  enrollmentStatus: string;
  enrolledAt: string;
  startYear: number;
  startMonth: string;
}

export interface Applicant {
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
  documentType?: string;
  documentNumber?: string | number;
}
export interface Document {

    documentId: number;
  content: string; // Base64 encoded content
  documentType: string;
  }
  


export interface DocumentResponse {
  headers: Record<string, string>;
  body: Document[];
  statusCode: string;
  statusCodeValue: number;
}