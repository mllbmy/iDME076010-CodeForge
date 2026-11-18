import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from './types';

interface EquipmentStats {
  total: number;
  running: number;
  standby: number;
  maintenance: number;
  fault: number;
  completedMaintenance: number;
  inProgressMaintenance: number;
  pendingMaintenance: number;
  completedRepair: number;
  inProgressRepair: number;
  pendingRepair: number;
  totalMaintenanceCost: number;
  totalRepairCost: number;
}

interface EquipmentStore {
  equipmentData: EquipmentLedger[];
  maintenanceData: MaintenanceRecord[];
  repairData: RepairRecord[];

  setEquipmentData: (data: EquipmentLedger[]) => void;
  setMaintenanceData: (data: MaintenanceRecord[]) => void;
  setRepairData: (data: RepairRecord[]) => void;
  addEquipment: (item: EquipmentLedger) => void;
  updateEquipment: (key: string, updates: Partial<EquipmentLedger>) => void;
  removeEquipment: (key: string) => void;
  addMaintenance: (item: MaintenanceRecord) => void;
  addRepair: (item: RepairRecord) => void;

  getStats: () => EquipmentStats;
  getStatusByManufacturer: () => Record<string, { total: number; running: number; fault: number }>;
  getStatusByLocation: () => Record<string, { total: number; running: number; fault: number }>;
  getMonthlyMaintenanceData: () => Record<string, { planned: number; fault: number }>;
}

export const useEquipmentStore = create<EquipmentStore>()(
  devtools(
    (set, get) => ({
      equipmentData: [],
      maintenanceData: [],
      repairData: [],

      setEquipmentData: (data) => set({ equipmentData: data }, false, 'setEquipmentData'),
      setMaintenanceData: (data) => set({ maintenanceData: data }, false, 'setMaintenanceData'),
      setRepairData: (data) => set({ repairData: data }, false, 'setRepairData'),

      addEquipment: (item) =>
        set((state) => ({ equipmentData: [...state.equipmentData, item] }), false, 'addEquipment'),

      updateEquipment: (key, updates) =>
        set(
          (state) => ({
            equipmentData: state.equipmentData.map((e) =>
              e.key === key ? { ...e, ...updates } : e,
            ),
          }),
          false,
          'updateEquipment',
        ),

      removeEquipment: (key) =>
        set(
          (state) => ({ equipmentData: state.equipmentData.filter((e) => e.key !== key) }),
          false,
          'removeEquipment',
        ),

      addMaintenance: (item) =>
        set((state) => ({ maintenanceData: [...state.maintenanceData, item] }), false, 'addMaintenance'),

      addRepair: (item) =>
        set((state) => ({ repairData: [...state.repairData, item] }), false, 'addRepair'),

      getStats: () => {
        const { equipmentData, maintenanceData, repairData } = get();
        return {
          total: equipmentData.length,
          running: equipmentData.filter((e) => e.status === '运行中').length,
          standby: equipmentData.filter((e) => e.status === '待机').length,
          maintenance: equipmentData.filter((e) => e.status === '维护中').length,
          fault: equipmentData.filter((e) => e.status === '故障').length,
          completedMaintenance: maintenanceData.filter((m) => m.status === '已完成').length,
          inProgressMaintenance: maintenanceData.filter((m) => m.status === '进行中').length,
          pendingMaintenance: maintenanceData.filter((m) => m.status === '待处理').length,
          completedRepair: repairData.filter((r) => r.status === '已完成').length,
          inProgressRepair: repairData.filter((r) => r.status === '进行中').length,
          pendingRepair: repairData.filter((r) => r.status === '待处理').length,
          totalMaintenanceCost: maintenanceData.reduce((sum, m) => sum + (m.cost || 0), 0),
          totalRepairCost: repairData.reduce((sum, r) => sum + (r.repairCost || 0), 0),
        };
      },

      getStatusByManufacturer: () => {
        const result: Record<string, { total: number; running: number; fault: number }> = {};
        get().equipmentData.forEach((e) => {
          if (!result[e.manufacturerFactory]) {
            result[e.manufacturerFactory] = { total: 0, running: 0, fault: 0 };
          }
          result[e.manufacturerFactory].total++;
          if (e.status === '运行中') result[e.manufacturerFactory].running++;
          if (e.status === '故障') result[e.manufacturerFactory].fault++;
        });
        return result;
      },

      getStatusByLocation: () => {
        const result: Record<string, { total: number; running: number; fault: number }> = {};
        get().equipmentData.forEach((e) => {
          if (!result[e.equipmentLocal]) {
            result[e.equipmentLocal] = { total: 0, running: 0, fault: 0 };
          }
          result[e.equipmentLocal].total++;
          if (e.status === '运行中') result[e.equipmentLocal].running++;
          if (e.status === '故障') result[e.equipmentLocal].fault++;
        });
        return result;
      },

      getMonthlyMaintenanceData: () => {
        const { maintenanceData, repairData } = get();
        const monthlyData: Record<string, { planned: number; fault: number }> = {};
        for (let i = 1; i <= 12; i++) {
          const monthKey = `2024-${i.toString().padStart(2, '0')}`;
          monthlyData[monthKey] = { planned: 0, fault: 0 };
        }
        maintenanceData.forEach((m) => {
          const month = m.maintenanceTime?.substring(0, 7) || '2024-01';
          if (!monthlyData[month]) monthlyData[month] = { planned: 0, fault: 0 };
          if (m.maintenanceType?.includes('定期') || m.maintenanceType?.includes('预防')) {
            monthlyData[month].planned++;
          } else {
            monthlyData[month].fault++;
          }
        });
        repairData.forEach((r) => {
          const month = r.reportTime?.substring(0, 7) || '2024-01';
          if (!monthlyData[month]) monthlyData[month] = { planned: 0, fault: 0 };
          monthlyData[month].fault++;
        });
        return monthlyData;
      },
    }),
    { name: 'EquipmentStore' },
  ),
);
