import type { PageRequest, PageResult } from './common';

export interface WorkingProcedureFrontendVO {
  key: string;
  procedureCode: string;
  procedureName: string;
  standardTime: number;
  relatedPartId: string;
  department: string;
  equipmentRequired: string;
  status: string;
  description: string;
}

export interface ProcedureQuery {
  keyword?: string;
  department?: string;
  status?: string;
}

export interface IWorkingProcedureService {
  getProcedureList(query: ProcedureQuery, page: PageRequest): Promise<PageResult<WorkingProcedureFrontendVO>>;
  getProcedureById(id: string): Promise<WorkingProcedureFrontendVO | null>;
  createProcedure(data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO>;
  updateProcedure(id: string, data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO>;
  deleteProcedure(id: string): Promise<boolean>;
  batchDeleteProcedure(ids: string[]): Promise<boolean>;
}
