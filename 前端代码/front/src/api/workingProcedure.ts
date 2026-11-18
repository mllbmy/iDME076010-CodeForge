import { request } from '@/utils/request';

export interface WorkingProcedureCreateDTO {
  procedure_Name?: string;
  procedure_Code?: string;
  standard_Time?: number;
  related_Part?: { id: string };
  department?: string;
  equipment_Required?: string;
  status?: string;
  description?: string;
}

export interface WorkingProcedureUpdateDTO extends WorkingProcedureCreateDTO {
  id: string;
  modifier?: string;
}

export interface WorkingProcedureVO extends WorkingProcedureCreateDTO {
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

export function addWorkingProcedure(data: WorkingProcedureCreateDTO) {
  return request({ url: '/WorkingProcedure/add', method: 'post', data });
}

export function batchAddWorkingProcedure(data: WorkingProcedureCreateDTO[]) {
  return request({ url: '/WorkingProcedure/batchAdd', method: 'post', data });
}

export function getWorkingProcedure(data: { id: string }) {
  return request({ url: '/WorkingProcedure/get', method: 'post', data });
}

export function batchGetWorkingProcedure(data: { ids: string[] }) {
  return request({ url: '/WorkingProcedure/batchGet', method: 'post', data });
}

export function queryWorkingProcedure(data: QueryRequestWrapper) {
  return request({ url: '/WorkingProcedure/query', method: 'post', data });
}

export function listWorkingProcedure(data: QueryRequestWrapper) {
  return request({ url: '/WorkingProcedure/list', method: 'post', data });
}

export function countWorkingProcedure(data: { queryRequest?: { filter?: { condition?: QueryCondition[] } } }) {
  return request({ url: '/WorkingProcedure/count', method: 'post', data });
}

export function updateWorkingProcedure(data: WorkingProcedureUpdateDTO) {
  return request({ url: '/WorkingProcedure/update', method: 'post', data });
}

export function batchUpdateWorkingProcedure(data: WorkingProcedureUpdateDTO[]) {
  return request({ url: '/WorkingProcedure/batchUpdate', method: 'POST', data });
}

export function deleteWorkingProcedure(data: PersistObjectIdModifierDTO) {
  return request({ url: '/WorkingProcedure/logicalDelete', method: 'POST', data });
}

export function batchDeleteWorkingProcedure(data: PersistObjectIdsModifierDTO) {
  return request({ url: '/WorkingProcedure/batchLogicalDelete', method: 'POST', data });
}
