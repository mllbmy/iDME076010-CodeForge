import { useEquipmentStore } from '@/store/useEquipmentStore';
import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from '@/store/types';

const makeEquipment = (overrides: Partial<EquipmentLedger> = {}): EquipmentLedger => ({
  key: '1',
  equipmentNumber: 'EQ-001',
  equipmentName: '设备1',
  manufacturerFactory: '厂商A',
  brand: '品牌A',
  supplier: '供应商A',
  productionDate: '2024-01-01',
  modelSpecifications: '规格A',
  serverLife: 5,
  depreciationMethod: '直线法',
  equipmentLocal: '车间A',
  status: '运行中',
  department: '生产部',
  responsiblePerson: '张三',
  extAttrMap: [],
  ...overrides,
});

const makeMaintenance = (overrides: Partial<MaintenanceRecord> = {}): MaintenanceRecord => ({
  key: 'm1',
  planId: 'P-001',
  equipmentId: '1',
  equipmentName: '设备1',
  maintenanceType: '定期保养',
  maintenanceTime: '2024-03-01',
  maintenanceContent: '更换滤芯',
  maintainer: '李四',
  partsReplaced: [],
  cost: 500,
  remark: '',
  status: '已完成',
  ...overrides,
});

const makeRepair = (overrides: Partial<RepairRecord> = {}): RepairRecord => ({
  key: 'r1',
  equipmentId: '1',
  equipmentName: '设备1',
  faultPhenomenon: '异响',
  reportTime: '2024-03-15',
  workOrderId: 'WO-001',
  responseTime: 2,
  repairTime: 8,
  repairMeasures: '更换轴承',
  repairCost: 3000,
  repairPerson: '王五',
  status: '已完成',
  faultImages: [],
  ...overrides,
});

describe('useEquipmentStore', () => {
  beforeEach(() => {
    useEquipmentStore.setState({
      equipmentData: [],
      maintenanceData: [],
      repairData: [],
    });
  });

  describe('addEquipment', () => {
    it('adds equipment to the list', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment());
      expect(useEquipmentStore.getState().equipmentData).toHaveLength(1);
      expect(useEquipmentStore.getState().equipmentData[0].equipmentName).toBe('设备1');
    });

    it('adds multiple equipment items', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1' }));
      store.addEquipment(makeEquipment({ key: '2', equipmentName: '设备2' }));
      expect(useEquipmentStore.getState().equipmentData).toHaveLength(2);
    });
  });

  describe('updateEquipment', () => {
    it('updates equipment by key', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1' }));
      store.updateEquipment('1', { equipmentName: '设备1-更新' });
      expect(useEquipmentStore.getState().equipmentData[0].equipmentName).toBe('设备1-更新');
    });

    it('does not affect other equipment when updating', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1', equipmentName: '设备1' }));
      store.addEquipment(makeEquipment({ key: '2', equipmentName: '设备2' }));
      store.updateEquipment('1', { equipmentName: '设备1-更新' });
      const data = useEquipmentStore.getState().equipmentData;
      expect(data[0].equipmentName).toBe('设备1-更新');
      expect(data[1].equipmentName).toBe('设备2');
    });
  });

  describe('removeEquipment', () => {
    it('removes equipment by key', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1' }));
      store.removeEquipment('1');
      expect(useEquipmentStore.getState().equipmentData).toHaveLength(0);
    });

    it('does not remove non-existent equipment', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1' }));
      store.removeEquipment('999');
      expect(useEquipmentStore.getState().equipmentData).toHaveLength(1);
    });
  });

  describe('getStats', () => {
    it('computes stats correctly', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1', status: '运行中' }));
      store.addEquipment(makeEquipment({ key: '2', status: '故障' }));
      store.addEquipment(makeEquipment({ key: '3', status: '待机' }));
      store.addMaintenance(makeMaintenance({ key: 'm1', status: '已完成', cost: 500 }));
      store.addMaintenance(makeMaintenance({ key: 'm2', status: '进行中', cost: 300 }));
      store.addRepair(makeRepair({ key: 'r1', status: '待处理', repairCost: 2000 }));

      const stats = store.getStats();
      expect(stats.total).toBe(3);
      expect(stats.running).toBe(1);
      expect(stats.fault).toBe(1);
      expect(stats.standby).toBe(1);
      expect(stats.completedMaintenance).toBe(1);
      expect(stats.inProgressMaintenance).toBe(1);
      expect(stats.pendingRepair).toBe(1);
      expect(stats.totalMaintenanceCost).toBe(800);
      expect(stats.totalRepairCost).toBe(2000);
    });

    it('returns zero stats for empty data', () => {
      const stats = useEquipmentStore.getState().getStats();
      expect(stats.total).toBe(0);
      expect(stats.running).toBe(0);
      expect(stats.totalMaintenanceCost).toBe(0);
      expect(stats.totalRepairCost).toBe(0);
    });
  });

  describe('getStatusByManufacturer', () => {
    it('groups equipment by manufacturer', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1', manufacturerFactory: '厂商A', status: '运行中' }));
      store.addEquipment(makeEquipment({ key: '2', manufacturerFactory: '厂商A', status: '故障' }));
      store.addEquipment(makeEquipment({ key: '3', manufacturerFactory: '厂商B', status: '运行中' }));

      const result = store.getStatusByManufacturer();
      expect(result['厂商A'].total).toBe(2);
      expect(result['厂商A'].running).toBe(1);
      expect(result['厂商A'].fault).toBe(1);
      expect(result['厂商B'].total).toBe(1);
      expect(result['厂商B'].running).toBe(1);
    });

    it('returns empty object for no equipment', () => {
      const result = useEquipmentStore.getState().getStatusByManufacturer();
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('getStatusByLocation', () => {
    it('groups equipment by location', () => {
      const store = useEquipmentStore.getState();
      store.addEquipment(makeEquipment({ key: '1', equipmentLocal: '车间A', status: '运行中' }));
      store.addEquipment(makeEquipment({ key: '2', equipmentLocal: '车间A', status: '运行中' }));
      store.addEquipment(makeEquipment({ key: '3', equipmentLocal: '车间B', status: '故障' }));

      const result = store.getStatusByLocation();
      expect(result['车间A'].total).toBe(2);
      expect(result['车间A'].running).toBe(2);
      expect(result['车间B'].total).toBe(1);
      expect(result['车间B'].fault).toBe(1);
    });

    it('returns empty object for no equipment', () => {
      const result = useEquipmentStore.getState().getStatusByLocation();
      expect(Object.keys(result)).toHaveLength(0);
    });
  });
});
