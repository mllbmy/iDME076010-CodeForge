import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EquipmentMonitoringData, AlertRule, AlertRecord, TrendData } from './types';

interface AlertStore {
  equipmentMonitoringData: EquipmentMonitoringData[];
  alertRules: AlertRule[];
  alertRecords: AlertRecord[];
  trendData: TrendData[];

  setEquipmentMonitoringData: (data: EquipmentMonitoringData[]) => void;
  setAlertRules: (data: AlertRule[]) => void;
  setAlertRecords: (data: AlertRecord[]) => void;
  setTrendData: (data: TrendData[]) => void;
  addAlertRule: (rule: Omit<AlertRule, 'id'>) => AlertRule;
  updateAlertRule: (id: string, updates: Partial<AlertRule>) => void;
  deleteAlertRule: (id: string) => void;
  addAlertRecord: (record: Omit<AlertRecord, 'id'>) => AlertRecord;
  getAIMonitoringStats: () => { total: number; running: number; warning: number; alert: number; avgHealth: number };
}

export const useAlertStore = create<AlertStore>()(
  devtools(
    (set, get) => ({
      equipmentMonitoringData: [],
      alertRules: [],
      alertRecords: [],
      trendData: [],

      setEquipmentMonitoringData: (data) => set({ equipmentMonitoringData: data }),
      setAlertRules: (data) => set({ alertRules: data }),
      setAlertRecords: (data) => set({ alertRecords: data }),
      setTrendData: (data) => set({ trendData: data }),

      addAlertRule: (rule) => {
        const newRule: AlertRule = { ...rule, id: Date.now().toString() };
        set((state) => ({ alertRules: [...state.alertRules, newRule] }), false, 'addAlertRule');
        return newRule;
      },

      updateAlertRule: (id, updates) =>
        set(
          (state) => ({
            alertRules: state.alertRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
          }),
          false,
          'updateAlertRule',
        ),

      deleteAlertRule: (id) =>
        set((state) => ({ alertRules: state.alertRules.filter((r) => r.id !== id) }), false, 'deleteAlertRule'),

      addAlertRecord: (record) => {
        const newRecord: AlertRecord = { ...record, id: Date.now().toString() };
        set((state) => ({ alertRecords: [...state.alertRecords, newRecord] }), false, 'addAlertRecord');
        return newRecord;
      },

      getAIMonitoringStats: () => {
        const { equipmentMonitoringData } = get();
        const total = equipmentMonitoringData.length;
        const running = equipmentMonitoringData.filter((e) => e.status === '运行中').length;
        const warning = equipmentMonitoringData.filter((e) => e.alertLevel === 'warning').length;
        const alert = equipmentMonitoringData.filter((e) => e.alertLevel === 'alert').length;
        const avgHealth =
          total > 0
            ? Math.round(equipmentMonitoringData.reduce((sum, e) => sum + e.health, 0) / total)
            : 0;
        return { total, running, warning, alert, avgHealth };
      },
    }),
    { name: 'AlertStore' },
  ),
);
