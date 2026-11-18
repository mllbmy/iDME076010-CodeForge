import { MockEquipmentService } from '@/services/mock/MockEquipmentService';
import type { EquipmentQuery, MaintenanceQuery, RepairQuery } from '@/services/interfaces/IEquipmentService';

describe('MockEquipmentService', () => {
  let service: MockEquipmentService;

  beforeEach(() => {
    service = new MockEquipmentService();
  });

  describe('getEquipmentList', () => {
    it('returns paginated equipment data', async () => {
      const result = await service.getEquipmentList({} as EquipmentQuery, { curPage: 1, pageSize: 10 });
      expect(result.list).toBeDefined();
      expect(result.list.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.curPage).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('returns equipment with correct field structure', async () => {
      const result = await service.getEquipmentList({} as EquipmentQuery, { curPage: 1, pageSize: 1 });
      const item = result.list[0];
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('equipmentName');
      expect(item).toHaveProperty('equipmentNumber');
      expect(item).toHaveProperty('status');
      expect(item).toHaveProperty('equipmentLocal');
    });

    it('filters by keyword', async () => {
      const all = await service.getEquipmentList({} as EquipmentQuery, { curPage: 1, pageSize: 1000 });
      if (all.list.length > 0) {
        const keyword = all.list[0].equipmentName.substring(0, 2);
        const filtered = await service.getEquipmentList({ keyword }, { curPage: 1, pageSize: 1000 });
        expect(filtered.list.length).toBeLessThanOrEqual(all.list.length);
      }
    });

    it('filters by status', async () => {
      const result = await service.getEquipmentList({ status: '运行中' } as EquipmentQuery, { curPage: 1, pageSize: 1000 });
      result.list.forEach((item) => {
        expect(item.status).toBe('运行中');
      });
    });
  });

  describe('getEquipmentById', () => {
    it('returns equipment by id', async () => {
      const list = await service.getEquipmentList({} as EquipmentQuery, { curPage: 1, pageSize: 1 });
      if (list.list.length > 0) {
        const item = await service.getEquipmentById(list.list[0].key);
        expect(item).not.toBeNull();
        expect(item?.key).toBe(list.list[0].key);
      }
    });

    it('returns null for non-existent id', async () => {
      const item = await service.getEquipmentById('non-existent-id');
      expect(item).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('creates equipment', async () => {
      const created = await service.createEquipment({ equipmentName: '新设备', equipmentNumber: 'NEW-001' });
      expect(created.equipmentName).toBe('新设备');
      expect(created.equipmentNumber).toBe('NEW-001');
    });

    it('updates equipment', async () => {
      const created = await service.createEquipment({ equipmentName: '设备', equipmentNumber: 'EQ-001' });
      const updated = await service.updateEquipment(created.key, { equipmentName: '设备-更新' });
      expect(updated.equipmentName).toBe('设备-更新');
    });

    it('deletes equipment', async () => {
      const created = await service.createEquipment({ equipmentName: '待删除', equipmentNumber: 'DEL-001' });
      const result = await service.deleteEquipment(created.key);
      expect(result).toBe(true);
      const found = await service.getEquipmentById(created.key);
      expect(found).toBeNull();
    });
  });

  describe('getMaintenanceList', () => {
    it('returns paginated maintenance data', async () => {
      const result = await service.getMaintenanceList({} as MaintenanceQuery, { curPage: 1, pageSize: 10 });
      expect(result.list).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });

    it('returns maintenance with correct field structure', async () => {
      const result = await service.getMaintenanceList({} as MaintenanceQuery, { curPage: 1, pageSize: 1 });
      if (result.list.length > 0) {
        const item = result.list[0];
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('planId');
        expect(item).toHaveProperty('equipmentName');
        expect(item).toHaveProperty('status');
      }
    });
  });

  describe('getRepairList', () => {
    it('returns paginated repair data', async () => {
      const result = await service.getRepairList({} as RepairQuery, { curPage: 1, pageSize: 10 });
      expect(result.list).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });

    it('returns repair with correct field structure', async () => {
      const result = await service.getRepairList({} as RepairQuery, { curPage: 1, pageSize: 1 });
      if (result.list.length > 0) {
        const item = result.list[0];
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('equipmentName');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('repairCost');
      }
    });
  });
});
