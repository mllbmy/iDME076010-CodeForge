import type { EquipmentLedger } from '@/store/types';

export interface EquipmentVO {
  id?: string;
  devicename?: string;
  devicecode?: string;
  device_Type?: string;
  status?: string;
  supplier?: string;
  specification?: string;
  purchase_Date?: string;
  warranty_Expiry?: string;
  location?: string;
  original_Value?: number;
  residual_Rate?: number;
  useful_Life_Years?: number;
  depreciation_Method?: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  modifier?: string;
}

const STATUS_DISPLAY: Record<string, string> = {
  D001: '运行中',
  D002: '停用',
};

const DEPRECIATION_DISPLAY: Record<string, string> = {
  B001: '双倍余额递减法',
  B002: '年限平均法',
  B003: '年数总和法',
  B004: '工作量法',
};

const DEVICE_TYPE_DISPLAY: Record<string, string> = {
  A001: '伺服电机',
  A002: '数控机床',
  A003: '铣床',
  A004: '三坐标测量机',
  A005: '车床',
  A006: '锻造设备',
  A007: '铸造设备',
  A008: '热处理设备',
  A009: '磨床',
};

const STATUS_TO_CODE: Record<string, string> = {
  '运行中': 'D001',
  '待机': 'D001',
  '维护中': 'D002',
  '故障': 'D002',
};

const DEPRECIATION_TO_CODE: Record<string, string> = {
  '年限平均法': 'B002',
  '双倍余额递减法': 'B001',
  '年数总和法': 'B003',
  '工作量法': 'B004',
};

export function toEquipmentVO(dto: EquipmentVO): EquipmentLedger {
  const descParts = (dto.description || '').split(' | ');
  return {
    key: dto.id || '',
    equipmentNumber: dto.devicecode || '',
    equipmentName: dto.devicename || '',
    manufacturerFactory: descParts[1] || '',
    brand: descParts[2] || '',
    supplier: dto.supplier || '',
    productionDate: dto.purchase_Date || '',
    modelSpecifications: dto.specification || descParts[0] || '',
    serverLife: dto.useful_Life_Years || 0,
    depreciationMethod: DEPRECIATION_DISPLAY[dto.depreciation_Method || ''] || dto.depreciation_Method || '',
    equipmentLocal: dto.location || '',
    status: STATUS_DISPLAY[dto.status || ''] || dto.status || '',
    department: descParts[4]?.replace('部门:', '') || DEVICE_TYPE_DISPLAY[dto.device_Type || ''] || '',
    responsiblePerson: descParts[3]?.replace('负责人:', '') || '',
    extAttrMap: [],
  };
}

export function toEquipmentDTO(vo: Partial<EquipmentLedger>) {
  return {
    devicename: vo.equipmentName,
    devicecode: vo.equipmentNumber,
    supplier: vo.supplier,
    status: STATUS_TO_CODE[vo.status || ''] || vo.status,
    purchase_Date: vo.productionDate,
    location: vo.equipmentLocal,
    specification: vo.modelSpecifications,
    useful_Life_Years: vo.serverLife,
    depreciation_Method: DEPRECIATION_TO_CODE[vo.depreciationMethod || ''] || vo.depreciationMethod,
    description: [vo.equipmentName, vo.manufacturerFactory, vo.brand, `负责人:${vo.responsiblePerson}`, `部门:${vo.department}`].filter(Boolean).join(' | '),
  };
}
