import { request } from '@/utils/request';

export interface WorkingPlanCreateDTO {
  plan_Name?: string;
  plan_Code?: string;
  plan_Type?: string;
  start_Time?: string;
  end_Time?: string;
  priority?: string;
  status?: string;
  description?: string;
  related_Part?: { id: string };
  workingplan_Procedures?: Record<string, unknown>;
}

export interface WorkingPlanUpdateDTO extends WorkingPlanCreateDTO {
  id: string;
  modifier?: string;
}

export interface WorkingPlanVO extends WorkingPlanCreateDTO {
  id?: string;
  createTime?: string;
  updateTime?: string;
}

export interface QueryCondition {
  conditionName: string;
  conditionValue: string;
  name: string;
}

export interface QueryRequestWrapper {
  queryRequest?: {
    filter?: {
      condition?: QueryCondition[];
    };
    sortInfo?: { isAsc: boolean; sortField: string }[];
  };
  pageVO?: { pageNo: number; pageSize: number };
}

export interface PersistObjectIdModifierDTO {
  id: string;
  modifier?: string;
}

export interface PersistObjectIdsModifierDTO {
  ids: string[];
  modifier?: string;
}

export function addWorkingPlan(data: WorkingPlanCreateDTO) {
  return request({ url: '/WorkingPlan/add', method: 'post', data });
}

export function batchAddWorkingPlan(data: WorkingPlanCreateDTO[]) {
  return request({ url: '/WorkingPlan/batchAdd', method: 'post', data });
}

export function getWorkingPlan(data: { id: string }) {
  return request({ url: '/WorkingPlan/get', method: 'post', data });
}

export function batchGetWorkingPlan(data: { ids: string[] }) {
  return request({ url: '/WorkingPlan/batchGet', method: 'post', data });
}

export function queryWorkingPlan(data: QueryRequestWrapper) {
  return request({ url: '/WorkingPlan/query', method: 'post', data });
}

export function listWorkingPlan(data: QueryRequestWrapper) {
  return request({ url: '/WorkingPlan/list', method: 'post', data });
}

export function countWorkingPlan(data: { queryRequest?: { filter?: { condition?: QueryCondition[] } } }) {
  return request({ url: '/WorkingPlan/count', method: 'post', data });
}

export function updateWorkingPlan(data: WorkingPlanUpdateDTO) {
  return request({ url: '/WorkingPlan/update', method: 'post', data });
}

export function batchUpdateWorkingPlan(data: WorkingPlanUpdateDTO[]) {
  return request({ url: '/WorkingPlan/batchUpdate', method: 'post', data });
}

export function deleteWorkingPlan(data: PersistObjectIdModifierDTO) {
  return request({ url: '/WorkingPlan/logicalDelete', method: 'post', data });
}

export function batchDeleteWorkingPlan(data: PersistObjectIdsModifierDTO) {
  return request({ url: '/WorkingPlan/batchLogicalDelete', method: 'post', data });
}
