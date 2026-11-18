import { request } from '@/utils/request';

export interface EquipmentMaintenanceCreateDTO {
  maintenanceTime?: string;
  maintenanceId?: string;
  maintenanceMoneny?: string;
  maintenanceTask?: string;
  maintenancePerson?: string;
  maintenanceType?: string;
  maintenanceName?: string;
  maintenanceChange?: 'A0' | 'A1' | 'A2';
}

export interface EquipmentMaintenanceUpdateDTO extends EquipmentMaintenanceCreateDTO {
  id: string;
  modifier?: string;
}

export interface EquipmentMaintenanceSaveAsDTO {
  sourceInstanceId: string;
  maintenanceName?: string;
  maintenancePerson?: string;
  needSetNullAttrs?: string[];
}

export interface EquipmentMaintenanceViewDTO {
  id?: string;
  maintenanceTime?: string;
  maintenanceId?: string;
  maintenanceMoneny?: string;
  maintenanceTask?: string;
  maintenancePerson?: string;
  maintenanceType?: string;
  maintenanceName?: string;
  maintenanceChange?: string;
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

export function addEquipmentMaintenance(data: EquipmentMaintenanceCreateDTO) {
  return request<EquipmentMaintenanceViewDTO>({
    url: '/EquipmentMaintenance/add',
    method: 'post',
    data,
  });
}

export function batchAddEquipmentMaintenance(data: EquipmentMaintenanceCreateDTO[]) {
  return request({
    url: '/EquipmentMaintenance/batchAdd',
    method: 'post',
    data,
  });
}

export function getEquipmentMaintenance(data: PersistObjectIdDecryptDTO) {
  return request<EquipmentMaintenanceViewDTO>({
    url: '/EquipmentMaintenance/get',
    method: 'post',
    data,
  });
}

export function batchGetEquipmentMaintenance(data: PersistObjectIdsDecryptDTO) {
  return request({
    url: '/EquipmentMaintenance/batchGet',
    method: 'post',
    data,
  });
}

export function queryEquipmentMaintenance(data: QueryRequestWrapper) {
  return request({
    url: '/EquipmentMaintenance/query',
    method: 'post',
    data,
  });
}

export function listEquipmentMaintenance(data: QueryRequestWrapper) {
  return request({
    url: '/EquipmentMaintenance/list',
    method: 'post',
    data,
  });
}

export function countEquipmentMaintenance(data: { queryRequest?: QueryRequest }) {
  return request<number>({
    url: '/EquipmentMaintenance/count',
    method: 'post',
    data,
  });
}

export function updateEquipmentMaintenance(data: EquipmentMaintenanceUpdateDTO) {
  return request<EquipmentMaintenanceViewDTO>({
    url: '/EquipmentMaintenance/update',
    method: 'post',
    data,
  });
}

export function batchUpdateEquipmentMaintenance(data: EquipmentMaintenanceUpdateDTO[]) {
  return request({
    url: '/EquipmentMaintenance/batchUpdate',
    method: 'post',
    data,
  });
}

export function saveEquipmentMaintenance(data: EquipmentMaintenanceCreateDTO[]) {
  return request<number>({
    url: '/EquipmentMaintenance/save',
    method: 'post',
    data,
  });
}

export function saveAllEquipmentMaintenance(data: EquipmentMaintenanceCreateDTO[]) {
  return request<number>({
    url: '/EquipmentMaintenance/saveAll',
    method: 'post',
    data,
  });
}

export function saveAsEquipmentMaintenance(data: EquipmentMaintenanceSaveAsDTO) {
  return request<EquipmentMaintenanceViewDTO>({
    url: '/EquipmentMaintenance/saveAs',
    method: 'post',
    data,
  });
}

export function deleteEquipmentMaintenance(data: PersistObjectIdModifierDTO) {
  return request<number>({
    url: '/EquipmentMaintenance/delete',
    method: 'post',
    data,
  });
}

export function batchDeleteEquipmentMaintenance(data: PersistObjectIdsModifierDTO) {
  return request<number>({
    url: '/EquipmentMaintenance/batchDelete',
    method: 'post',
    data,
  });
}

export function logicalDeleteEquipmentMaintenance(data: PersistObjectIdModifierDTO) {
  return request<number>({
    url: '/EquipmentMaintenance/logicalDelete',
    method: 'post',
    data,
  });
}

export function batchLogicalDeleteEquipmentMaintenance(data: PersistObjectIdsModifierDTO) {
  return request<number>({
    url: '/EquipmentMaintenance/batchLogicalDelete',
    method: 'post',
    data,
  });
}

export function deleteByConditionEquipmentMaintenance(data: DeleteByConditionVo) {
  return request<number>({
    url: '/EquipmentMaintenance/deleteByCondition',
    method: 'post',
    data,
  });
}

export function logicalDeleteByConditionEquipmentMaintenance(data: DeleteByConditionVo) {
  return request<number>({
    url: '/EquipmentMaintenance/logicalDeleteByCondition',
    method: 'post',
    data,
  });
}
