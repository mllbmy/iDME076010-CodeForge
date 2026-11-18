export type { EquipmentLedger, MaintenanceRecord, RepairRecord, ExtAttr } from '@/store/types';

export interface EquipmentStats {
  byManufacturer: Record<string, number>;
  byBrand: Record<string, number>;
  byLocation: Record<string, number>;
  byStatus: Record<string, number>;
}
