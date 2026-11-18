import { request } from '@/utils/request';

export interface EquipmentRepairCreateDTO {
  equipmentrepairTime?: string;
  equipmentrepairName?: string;
  equipmentrepairPerson?: string;
  equipmentrepairId?: string;
  equipmentrepairMoneny?: string;
  equipmentrepairLongtime?: string;
  equipmentrepairBroken?: string;
  equipmentrepairChange?: 'A0' | 'A1' | 'A2';
  equipmentrepairReply?: string;
}

export interface EquipmentRepairUpdateDTO extends EquipmentRepairCreateDTO {
  id: string;
  modifier?: string;
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
  select?: string[];
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

export interface EquipmentRepairVO {
  id?: string;
  equipmentrepairTime?: string;
  equipmentrepairName?: string;
  equipmentrepairPerson?: string;
  equipmentrepairId?: string;
  equipmentrepairMoneny?: string;
  equipmentrepairLongtime?: string;
  equipmentrepairBroken?: string;
  equipmentrepairChange?: string;
  equipmentrepairReply?: string;
  createTime?: string;
  updateTime?: string;
}

export function addEquipmentRepair(data: EquipmentRepairCreateDTO) {
  return request({
    url: '/EquipmentRepair/add',
    method: 'post',
    data,
  });
}

export function batchAddEquipmentRepair(data: EquipmentRepairCreateDTO[]) {
  return request({
    url: '/EquipmentRepair/batchAdd',
    method: 'post',
    data,
  });
}

export function getEquipmentRepair(data: PersistObjectIdDecryptDTO) {
  return request({
    url: '/EquipmentRepair/get',
    method: 'post',
    data,
  });
}

export function batchGetEquipmentRepair(data: PersistObjectIdsDecryptDTO) {
  return request({
    url: '/EquipmentRepair/batchGet',
    method: 'post',
    data,
  });
}

export function queryEquipmentRepair(data: QueryRequestWrapper) {
  return request({
    url: '/EquipmentRepair/query',
    method: 'post',
    data,
  });
}

export function listEquipmentRepair(data: QueryRequestWrapper) {
  return request({
    url: '/EquipmentRepair/list',
    method: 'post',
    data,
  });
}

export function countEquipmentRepair(data: { queryRequest?: QueryRequest }) {
  return request({
    url: '/EquipmentRepair/count',
    method: 'post',
    data,
  });
}

export function updateEquipmentRepair(data: EquipmentRepairUpdateDTO) {
  return request({
    url: '/EquipmentRepair/update',
    method: 'post',
    data,
  });
}

export function batchUpdateEquipmentRepair(data: EquipmentRepairUpdateDTO[]) {
  return request({
    url: '/EquipmentRepair/batchUpdate',
    method: 'post',
    data,
  });
}

export function saveEquipmentRepair(data: EquipmentRepairCreateDTO[]) {
  return request({
    url: '/EquipmentRepair/save',
    method: 'post',
    data,
  });
}

export function saveAllEquipmentRepair(data: EquipmentRepairCreateDTO[]) {
  return request({
    url: '/EquipmentRepair/saveAll',
    method: 'post',
    data,
  });
}

export function deleteEquipmentRepair(data: PersistObjectIdModifierDTO) {
  return request({
    url: '/EquipmentRepair/delete',
    method: 'post',
    data,
  });
}

export function batchDeleteEquipmentRepair(data: PersistObjectIdsModifierDTO) {
  return request({
    url: '/EquipmentRepair/batchDelete',
    method: 'post',
    data,
  });
}

export function logicalDeleteEquipmentRepair(data: PersistObjectIdModifierDTO) {
  return request({
    url: '/EquipmentRepair/logicalDelete',
    method: 'post',
    data,
  });
}

export function batchLogicalDeleteEquipmentRepair(data: PersistObjectIdsModifierDTO) {
  return request({
    url: '/EquipmentRepair/batchLogicalDelete',
    method: 'post',
    data,
  });
}

export function deleteByConditionEquipmentRepair(data: DeleteByConditionVo) {
  return request({
    url: '/EquipmentRepair/deleteByCondition',
    method: 'post',
    data,
  });
}

export function logicalDeleteByConditionEquipmentRepair(data: DeleteByConditionVo) {
  return request({
    url: '/EquipmentRepair/logicalDeleteByCondition',
    method: 'post',
    data,
  });
}
