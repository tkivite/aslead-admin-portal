export interface GradingSystem {
  gradeId: number;
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GradingSystemCreateRequest {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  description?: string;
}

export default GradingSystem;
