import type { PageRequest, PageResult } from './common';

export interface WorkingPlanFrontendVO {
  key: string;
  planCode: string;
  planName: string;
  planType: string;
  startTime: string;
  endTime: string;
  priority: string;
  status: string;
  description: string;
  relatedPartId: string;
}

export interface PlanQuery {
  keyword?: string;
  planType?: string;
  status?: string;
}

export interface IWorkingPlanService {
  getPlanList(query: PlanQuery, page: PageRequest): Promise<PageResult<WorkingPlanFrontendVO>>;
  getPlanById(id: string): Promise<WorkingPlanFrontendVO | null>;
  createPlan(data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO>;
  updatePlan(id: string, data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO>;
  deletePlan(id: string): Promise<boolean>;
  batchDeletePlan(ids: string[]): Promise<boolean>;
}
