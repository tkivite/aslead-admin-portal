export interface Campus {
  id: number;
  name: string;
  location: string;
  country: string;
  county: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampusPageResponse {
  content: Campus[];
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

export interface CreateCampusData {
  name: string;
  location: string;
  county: string;
  country: string;
}

export interface UpdateCampusData {
  name: string;
  location: string;
  county: string;
  country: string;
}
