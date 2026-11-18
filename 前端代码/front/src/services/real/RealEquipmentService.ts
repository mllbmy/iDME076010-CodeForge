import type { IEquipmentService, EquipmentQuery, MaintenanceQuery, RepairQuery } from '../interfaces';
import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from '@/store/types';
import type { PageRequest, PageResult } from '../interfaces/common';
import * as equipmentApi from '@/api/equipment';
import * as maintenanceApi from '@/api/equipmentMaintenance';
import * as repairApi from '@/api/equipmentRepair';
import { toEquipmentVO, toEquipmentDTO, toMaintenanceVO, toMaintenanceDTO, toRepairVO, toRepairDTO } from '../adapters';
import type { EquipmentVO } from '@/api/equipment';
import type { EquipmentMaintenanceViewDTO } from '@/api/equipmentMaintenance';
import type { EquipmentRepairVO } from '@/api/equipmentRepair';

export class RealEquipmentService implements IEquipmentService {
  async getEquipmentList(query: EquipmentQuery, page: PageRequest): Promise<PageResult<EquipmentLedger>> {
    const conditions = this.buildConditions(query);
    const backendData = {
      queryRequest: {
        filter: { condition: conditions },
        sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    };

    const res = await equipmentApi.queryEquipment(backendData) as unknown as { data?: { content?: EquipmentVO[]; list?: EquipmentVO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;

    const list = (data?.content || data?.list || []).map(toEquipmentVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async getEquipmentById(id: string): Promise<EquipmentLedger | null> {
    const res = await equipmentApi.getEquipment({ id }) as { data?: EquipmentVO };
    return res.data ? toEquipmentVO(res.data) : null;
  }

  async createEquipment(data: Partial<EquipmentLedger>): Promise<EquipmentLedger> {
    const res = await equipmentApi.createEquipment(toEquipmentDTO(data)) as unknown as { data?: EquipmentVO };
    const rawData = res?.data as EquipmentVO;
    return toEquipmentVO(rawData);
  }

  async updateEquipment(id: string, data: Partial<EquipmentLedger>): Promise<EquipmentLedger> {
    const res = await equipmentApi.updateEquipment({ id, ...toEquipmentDTO(data) }) as unknown as { data?: EquipmentVO };
    const rawData = res?.data as EquipmentVO;
    return toEquipmentVO(rawData);
  }

  async deleteEquipment(id: string): Promise<boolean> {
    await equipmentApi.deleteEquipment({ id, modifier: 'system' });
    return true;
  }

  async batchDeleteEquipment(ids: string[]): Promise<boolean> {
    await equipmentApi.batchDeleteEquipment({ ids, modifier: 'system' });
    return true;
  }

  async getMaintenanceList(_query: MaintenanceQuery, page: PageRequest): Promise<PageResult<MaintenanceRecord>> {
    const res = await maintenanceApi.listEquipmentMaintenance({
      queryRequest: { filter: { condition: [] } },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    }) as unknown as { data?: { content?: EquipmentMaintenanceViewDTO[]; list?: EquipmentMaintenanceViewDTO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;
    const list = (data?.content || data?.list || []).map(toMaintenanceVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async createMaintenance(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const res = await maintenanceApi.addEquipmentMaintenance(toMaintenanceDTO(data)) as unknown as { data?: EquipmentMaintenanceViewDTO };
    const rawData = res?.data as EquipmentMaintenanceViewDTO;
    return toMaintenanceVO(rawData);
  }

  async updateMaintenance(_id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const updateData = { id: _id, ...toMaintenanceDTO(data) };
    const res = await maintenanceApi.updateEquipmentMaintenance(updateData) as unknown as { data?: EquipmentMaintenanceViewDTO };
    const rawData = res?.data as EquipmentMaintenanceViewDTO;
    return toMaintenanceVO(rawData);
  }

  async deleteMaintenance(id: string): Promise<boolean> {
    await maintenanceApi.deleteEquipmentMaintenance({ id });
    return true;
  }

  async getRepairList(_query: RepairQuery, page: PageRequest): Promise<PageResult<RepairRecord>> {
    const res = await repairApi.listEquipmentRepair({
      queryRequest: { filter: { condition: [] } },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    }) as unknown as { data?: { content?: EquipmentRepairVO[]; list?: EquipmentRepairVO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;
    const list = (data?.content || data?.list || []).map(toRepairVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async createRepair(data: Partial<RepairRecord>): Promise<RepairRecord> {
    const res = await repairApi.addEquipmentRepair(toRepairDTO(data)) as unknown as { data?: EquipmentRepairVO };
    const rawData = res?.data as EquipmentRepairVO;
    return toRepairVO(rawData);
  }

  async updateRepair(_id: string, data: Partial<RepairRecord>): Promise<RepairRecord> {
    const updateData = { id: _id, ...toRepairDTO(data) };
    const res = await repairApi.updateEquipmentRepair(updateData) as unknown as { data?: EquipmentRepairVO };
    const rawData = res?.data as EquipmentRepairVO;
    return toRepairVO(rawData);
  }

  async deleteRepair(id: string): Promise<boolean> {
    await repairApi.deleteEquipmentRepair({ id });
    return true;
  }

  private buildConditions(query: EquipmentQuery) {
    const conditions = [];
    if (query.keyword) {
      conditions.push({ conditionName: 'LIKE', conditionValue: `%${query.keyword}%`, name: 'devicename' });
    }
    if (query.status) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.status, name: 'status' });
    }
    if (query.department) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.department, name: 'description' });
    }
    return conditions;
  }
}
