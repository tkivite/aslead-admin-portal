// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

// Pagination types
export interface PageableInfo {
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageableInfo;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  headers: Record<string, string>;
  body: T;
  statusCode: string;
  statusCodeValue: number;
}

// Applicant types
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

// Program types
export interface ProgramCost {
  costId: number;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  programId: number;
  code: string;
  name: string;
  description: string;
  durationMonths: number;
  tuitionFee: number;
  createdAt: string | null;
  updatedAt: string | null;
  openCycle?: AdmissionCycle | null;
  costs?: ProgramCost[];
}

export interface ProgramCreateRequest {
  code: string;
  name: string;
  description: string;
  durationMonths: number;
  tuitionFee: number;
}

// Admission Cycle types
export interface AdmissionCycle {
  cycleId: number;
  program: Program;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionCycleCreateRequest {
  program: {
    programId: string | number;
  };
  startDate: string;
  endDate: string;
}

// Application types
export interface Application {
  applicationId: number;
  applicant: Applicant;
  program: Program;
  admissionCycle: AdmissionCycle | null;
  status: string;
  feeAmount: number;
  feePaymentStatus: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment types
export interface EnrollmentRequest {
  applicant: {
    applicantId: number;
  };
  enrollmentStatus: string;
  enrolledAt: string;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
}
// Payment types
export interface Payment {
  paymentId: number
  reference: string
  amount: number
  method: string
  date: string
  status: string
  student?: Student | null
  course?: Program | null
}

export interface UnmatchedPayment {
  paymentId: number
  reference: string
  transactionId: string
  phoneNumber: string
  amount: number
  paymentMethod: string
  paymentDate: string
  status: string
  description?: string
  matched: boolean
}

export interface Student {
  studentId: number
  firstName: string
  lastName: string
  email: string
  registrationNumber: string
  program?: Program
}