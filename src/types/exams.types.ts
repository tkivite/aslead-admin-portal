import type { CourseUnit } from "@/types/courses.types";

export interface ExamType {
  examTypeId: number;
  name: string;
  description?: string;
  weightPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  examId: number;
  courseUnit: CourseUnit;
  examType: ExamType;
  examName: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  academicYear: number;
  session: number;
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamCreateRequest {
  examType: {
    examTypeId: number;
  };
  examName: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  academicYear: number;
  session: number;
  instructions?: string;
}

export interface ExamStatistics {
  averageMarks?: number;
  highestMarks?: number;
  lowestMarks?: number;
}

export interface ExamMark {
  marksObtained: number;
  grade?: string;
  remarks?: string;
  markedBy?: string;
  markedAt?: string;
  student?: {
    enrollmentNumber?: string;
    admissionNumber?: string;
    applicant?: {
      firstName: string;
      lastName: string;
    };
    application?: {
      applicant?: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

export default Exam;
