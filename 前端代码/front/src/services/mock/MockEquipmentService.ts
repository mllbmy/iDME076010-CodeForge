import type { IEquipmentService, EquipmentQuery, MaintenanceQuery, RepairQuery } from '../interfaces';
import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from '@/store/types';
import type { PageRequest, PageResult } from '../interfaces/common';
import { generateEquipmentData, generateMaintenanceData, generateRepairData } from './mockData';
import { mockDelay } from './mockConfig';
import { PRIORITY_EQUIPMENT_DATA } from '@/data/priorityEquipmentData';

function paginate<T>(list: T[], page: PageRequest): PageResult<T> {
  const start = (page.curPage - 1) * page.pageSize;
  return {
    list: list.slice(start, start + page.pageSize),
    total: list.length,
    curPage: page.curPage,
    pageSize: page.pageSize,
  };
}

export class MockEquipmentService implements IEquipmentService {
  private equipmentData: EquipmentLedger[] = [];
  private maintenanceData: MaintenanceRecord[] = [];
  private repairData: RepairRecord[] = [];

  constructor() {
    const generatedData = generateEquipmentData();
    this.equipmentData = [...PRIORITY_EQUIPMENT_DATA, ...generatedData];
    this.maintenanceData = generateMaintenanceData(this.equipmentData);
    this.repairData = generateRepairData(this.equipmentData);
  }

  async getEquipmentList(query: EquipmentQuery, page: PageRequest): Promise<PageResult<EquipmentLedger>> {
    await mockDelay();
    let filtered = [...this.equipmentData];
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(
        (e) => e.equipmentName.toLowerCase().includes(kw) || e.equipmentNumber.toLowerCase().includes(kw),
      );
    }
    if (query.status) {
      filtered = filtered.filter((e) => e.status === query.status);
    }
    if (query.department) {
      filtered = filtered.filter((e) => e.department === query.department);
    }
    if (query.showPriority === true || query.showPriority === undefined) {
      filtered.sort((a, b) => {
        const aPriority = a.key.startsWith('priority-') ? -1 : 0;
        const bPriority = b.key.startsWith('priority-') ? -1 : 0;
        return aPriority - bPriority;
      });
    }
    return paginate(filtered, page);
  }

  async getEquipmentById(id: string): Promise<EquipmentLedger | null> {
    await mockDelay();
    return this.equipmentData.find((e) => e.key === id) || null;
  }

  async createEquipment(data: Partial<EquipmentLedger>): Promise<EquipmentLedger> {
    await mockDelay();
    const newItem: EquipmentLedger = {
      key: String(this.equipmentData.length + 1),
      equipmentNumber: `EQ-${String(this.equipmentData.length + 1).padStart(3, '0')}`,
      ...data,
    } as EquipmentLedger;
    this.equipmentData.push(newItem);
    return newItem;
  }

  async updateEquipment(id: string, data: Partial<EquipmentLedger>): Promise<EquipmentLedger> {
    await mockDelay();
    const idx = this.equipmentData.findIndex((e) => e.key === id);
    if (idx === -1) throw new Error('设备不存在');
    this.equipmentData[idx] = { ...this.equipmentData[idx], ...data };
    return this.equipmentData[idx];
  }

  async deleteEquipment(id: string): Promise<boolean> {
    await mockDelay();
    this.equipmentData = this.equipmentData.filter((e) => e.key !== id);
    return true;
  }

  async batchDeleteEquipment(ids: string[]): Promise<boolean> {
    await mockDelay();
    const idSet = new Set(ids);
    this.equipmentData = this.equipmentData.filter((e) => !idSet.has(e.key));
    return true;
  }

  async getMaintenanceList(query: MaintenanceQuery, page: PageRequest): Promise<PageResult<MaintenanceRecord>> {
    await mockDelay();
    let filtered = [...this.maintenanceData];
    if (query.equipmentId) {
      filtered = filtered.filter((m) => m.equipmentId === query.equipmentId);
    }
    if (query.status) {
      filtered = filtered.filter((m) => m.status === query.status);
    }
    return paginate(filtered, page);
  }

  async createMaintenance(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    await mockDelay();
    const newItem = { key: String(this.maintenanceData.length + 1), ...data } as MaintenanceRecord;
    this.maintenanceData.push(newItem);
    return newItem;
  }

  async updateMaintenance(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    await mockDelay();
    const idx = this.maintenanceData.findIndex((m) => m.key === id);
    if (idx === -1) throw new Error('保养记录不存在');
    this.maintenanceData[idx] = { ...this.maintenanceData[idx], ...data };
    return this.maintenanceData[idx];
  }

  async deleteMaintenance(id: string): Promise<boolean> {
    await mockDelay();
    this.maintenanceData = this.maintenanceData.filter((m) => m.key !== id);
    return true;
  }

  async getRepairList(query: RepairQuery, page: PageRequest): Promise<PageResult<RepairRecord>> {
    await mockDelay();
    let filtered = [...this.repairData];
    if (query.equipmentId) {
      filtered = filtered.filter((r) => r.equipmentId === query.equipmentId);
    }
    if (query.status) {
      filtered = filtered.filter((r) => r.status === query.status);
    }
    return paginate(filtered, page);
  }

  async createRepair(data: Partial<RepairRecord>): Promise<RepairRecord> {
    await mockDelay();
    const newItem = { key: String(this.repairData.length + 1), ...data } as RepairRecord;
    this.repairData.push(newItem);
    return newItem;
  }

  async updateRepair(id: string, data: Partial<RepairRecord>): Promise<RepairRecord> {
    await mockDelay();
    const idx = this.repairData.findIndex((r) => r.key === id);
    if (idx === -1) throw new Error('维修记录不存在');
    this.repairData[idx] = { ...this.repairData[idx], ...data };
    return this.repairData[idx];
  }

  async deleteRepair(id: string): Promise<boolean> {
    await mockDelay();
    this.repairData = this.repairData.filter((r) => r.key !== id);
    return true;
  }
}
