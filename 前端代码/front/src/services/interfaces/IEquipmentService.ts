import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from '@/store/types';
import type { PageRequest, PageResult } from './common';

export interface EquipmentQuery {
  keyword?: string;
  status?: string;
  department?: string;
  showPriority?: boolean;
}

export interface MaintenanceQuery {
  keyword?: string;
  status?: string;
  equipmentId?: string;
}

export interface RepairQuery {
  keyword?: string;
  status?: string;
  equipmentId?: string;
}

export interface IEquipmentService {
  getEquipmentList(query: EquipmentQuery, page: PageRequest): Promise<PageResult<EquipmentLedger>>;
  getEquipmentById(id: string): Promise<EquipmentLedger | null>;
  createEquipment(data: Partial<EquipmentLedger>): Promise<EquipmentLedger>;
  updateEquipment(id: string, data: Partial<EquipmentLedger>): Promise<EquipmentLedger>;
  deleteEquipment(id: string): Promise<boolean>;
  batchDeleteEquipment(ids: string[]): Promise<boolean>;

  getMaintenanceList(query: MaintenanceQuery, page: PageRequest): Promise<PageResult<MaintenanceRecord>>;
  createMaintenance(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord>;
  updateMaintenance(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord>;
  deleteMaintenance(id: string): Promise<boolean>;

  getRepairList(query: RepairQuery, page: PageRequest): Promise<PageResult<RepairRecord>>;
  createRepair(data: Partial<RepairRecord>): Promise<RepairRecord>;
  updateRepair(id: string, data: Partial<RepairRecord>): Promise<RepairRecord>;
  deleteRepair(id: string): Promise<boolean>;
}
