import { request } from '@/utils/request';

export interface PartCreateDTO {
  name?: string;
  part_Code?: string;
  part_Category?: string;
  material?: string;
  specification?: string;
  weight?: number;
  unit?: string;
  drawing_No?: string;
  status?: string;
  master?: Record<string, unknown>;
  branch?: Record<string, unknown>;
  workingCopy?: boolean;
}

export interface PartUpdateDTO extends PartCreateDTO {
  id: string;
  modifier?: string;
}

export interface PartVO extends PartCreateDTO {
  id?: string;
  createTime?: string;
  updateTime?: string;
}

export interface MasterIdModifierDTO {
  masterId: string;
  modifier?: string;
}

export interface MasterIdsModifierDTO {
  masterIds: string[];
  modifier?: string;
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

export function addPart(data: PartCreateDTO) {
  return request({ url: '/Part/add', method: 'post', data });
}

export function batchAddPart(data: PartCreateDTO[]) {
  return request({ url: '/Part/batchAdd', method: 'post', data });
}

export function getPart(data: { id: string }) {
  return request({ url: '/Part/get', method: 'post', data });
}

export function batchGetPart(data: { ids: string[] }) {
  return request({ url: '/Part/batchGet', method: 'post', data });
}

export function queryPart(data: QueryRequestWrapper) {
  return request({ url: '/Part/query', method: 'post', data });
}

export function listPart(data: QueryRequestWrapper) {
  return request({ url: '/Part/list', method: 'post', data });
}

export function countPart(data: { queryRequest?: { filter?: { condition?: QueryCondition[] } } }) {
  return request({ url: '/Part/count', method: 'post', data });
}

export function updatePart(data: PartUpdateDTO) {
  return request({ url: '/Part/update', method: 'post', data });
}

export function batchUpdatePart(data: PartUpdateDTO[]) {
  return request({ url: '/Part/batchUpdate', method: 'post', data });
}

export function deletePart(data: MasterIdModifierDTO) {
  return request({ url: '/Part/logicalDelete', method: 'post', data });
}

export function batchDeletePart(data: MasterIdsModifierDTO) {
  return request({ url: '/Part/batchLogicalDelete', method: 'post', data });
}
