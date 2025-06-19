
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
