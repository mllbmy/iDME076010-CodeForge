export interface ExtAttr {
  key: string;
  value: string;
}

export interface EquipmentLedger {
  key: string;
  equipmentNumber: string;
  equipmentName: string;
  manufacturerFactory: string;
  brand: string;
  supplier: string;
  productionDate: string;
  modelSpecifications: string;
  serverLife: number;
  depreciationMethod: string;
  equipmentLocal: string;
  status: string;
  department: string;
  responsiblePerson: string;
  extAttrMap: ExtAttr[];
}

export interface MaintenanceRecord {
  key: string;
  planId: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  maintenanceTime: string;
  maintenanceContent: string;
  maintainer: string;
  partsReplaced: { name: string; quantity: number; model: string }[];
  cost: number;
  remark: string;
  status: string;
}

export interface RepairRecord {
  key: string;
  equipmentId: string;
  equipmentName: string;
  faultPhenomenon: string;
  reportTime: string;
  workOrderId: string;
  responseTime: number;
  repairTime: number;
  repairMeasures: string;
  repairCost: number;
  repairPerson: string;
  status: string;
  faultImages: string[];
}

export interface EquipmentMonitoringData {
  equipmentId: string;
  equipmentName: string;
  status: string;
  temperature: number;
  vibration: number;
  load: number;
  health: number;
  runtime: number;
  alertLevel?: 'normal' | 'warning' | 'alert';
}

export interface AlertRule {
  id: string;
  name: string;
  equipmentId: string;
  equipmentName: string;
  metric: string;
  operator: string;
  warningThreshold: number;
  alertThreshold: number;
  enabled: boolean;
  description?: string;
}

export interface AlertRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  metric: string;
  value: number;
  threshold: number;
  level: 'warning' | 'alert';
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface TrendData {
  time: string;
  temperature: number;
  vibration: number;
  load: number;
}
