export interface ProgramCost {
  costId: number;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpenCycle {
  cycleId: number;
  startDate: string;
  endDate: string;
  status: string;
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
  applicationFee: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  contacts: string;
  costs?: Array<{
    id: number;
    description: string;
    amount: number;
  }>;
}

export interface ProgramPageResponse {
  content: Program[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CreateProgramData {
  code: string;
  name: string;
  description: string;
  durationMonths: number;
  tuitionFee: string;
  contacts: string;
}

export interface UpdateProgramData {
  code: string;
  name: string;
  description: string;
  durationMonths: number;
  tuitionFee: string;
  contacts: string;
}
