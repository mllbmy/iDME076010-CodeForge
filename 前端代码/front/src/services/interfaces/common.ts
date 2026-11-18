export interface PageRequest {
  curPage: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PageResult<T> {
  list: T[];
  total: number;
  curPage: number;
  pageSize: number;
}
