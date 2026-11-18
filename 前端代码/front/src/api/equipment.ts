import { request } from '@/utils/request';

export interface EquipmentCreateDTO {
  devicename?: string;
  devicecode?: string;
  device_Type?: string;
  supplier?: string;
  status?: string;
  purchase_Date?: string;
  warranty_Expiry?: string;
  location?: string;
  description?: string;
}

export interface EquipmentUpdateDTO extends EquipmentCreateDTO {
  id: string;
  modifier?: string;
}

export interface EquipmentVO extends EquipmentCreateDTO {
  id?: string;
  createTime?: string;
  updateTime?: string;
}

export interface PersistObjectIdDecryptDTO {
  id: string;
}

export interface PersistObjectIdsDecryptDTO {
  ids: string[];
}

export interface PersistObjectIdModifierDTO {
  id: string;
  modifier?: string;
}

export interface PersistObjectIdsModifierDTO {
  ids: string[];
  modifier?: string;
}

export interface QueryCondition {
  conditionName: string;
  conditionValue: string;
  name: string;
}

export interface QueryRequest {
  filter?: {
    condition?: QueryCondition[];
  };
  sortInfo?: { isAsc: boolean; sortField: string }[];
}

export interface PageVO {
  pageNo: number;
  pageSize: number;
}

export interface QueryRequestWrapper {
  queryRequest?: QueryRequest;
  pageVO?: PageVO;
}

export interface DeleteByConditionVo {
  queryRequest?: QueryRequest;
  modifier?: string;
}

export function getEquipmentList(data: QueryRequestWrapper) {
  return request({
    url: '/Equipment/list',
    method: 'post',
    data,
  });
}

export function queryEquipment(data: QueryRequestWrapper) {
  return request({
    url: '/Equipment/query',
    method: 'post',
    data,
  });
}

export function getEquipment(data: PersistObjectIdDecryptDTO) {
  return request({
    url: '/Equipment/get',
    method: 'post',
    data,
  });
}

export function createEquipment(data: EquipmentCreateDTO) {
  return request({
    url: '/Equipment/add',
    method: 'post',
    data,
  });
}

export function updateEquipment(data: EquipmentUpdateDTO) {
  return request({
    url: '/Equipment/update',
    method: 'post',
    data,
  });
}

export function deleteEquipment(data: PersistObjectIdModifierDTO) {
  return request({
    url: '/Equipment/logicalDelete',
    method: 'post',
    data,
  });
}

export function batchDeleteEquipment(data: PersistObjectIdsModifierDTO) {
  return request({
    url: '/Equipment/batchLogicalDelete',
    method: 'post',
    data,
  });
}

export function countEquipment(data: { queryRequest?: QueryRequest }) {
  return request({
    url: '/Equipment/count',
    method: 'post',
    data,
  });
}
