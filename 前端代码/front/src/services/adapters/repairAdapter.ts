import type { RepairRecord } from '@/store/types';
import type { EquipmentRepairCreateDTO } from '@/api/equipmentRepair';

interface RepairDTO {
  id?: string;
  equipmentId?: string;
  equipmentName?: string;
  faultPhenomenon?: string;
  reportTime?: string;
  workOrderId?: string;
  repairMeasures?: string;
  repairCost?: number;
  repairPerson?: string;
  repairChange?: string;
}

export function toRepairVO(dto: RepairDTO): RepairRecord {
  return {
    key: dto.id || '',
    equipmentId: dto.equipmentId || '',
    equipmentName: dto.equipmentName || '',
    faultPhenomenon: dto.faultPhenomenon || '',
    reportTime: dto.reportTime || '',
    workOrderId: dto.workOrderId || '',
    responseTime: 0,
    repairTime: 0,
    repairMeasures: dto.repairMeasures || '',
    repairCost: dto.repairCost || 0,
    repairPerson: dto.repairPerson || '',
    status:
      dto.repairChange === 'A0' ? '已完成' : dto.repairChange === 'A1' ? '进行中' : '待处理',
    faultImages: [],
  };
}

export function toRepairDTO(vo: Partial<RepairRecord>): EquipmentRepairCreateDTO {
  const statusToChange = (status?: string): 'A0' | 'A1' | 'A2' | undefined => {
    if (status === '已完成') return 'A0';
    if (status === '进行中') return 'A1';
    if (status === '待处理') return 'A2';
    return undefined;
  };

  return {
    equipmentrepairId: vo.equipmentId,
    equipmentrepairName: vo.equipmentName,
    equipmentrepairBroken: vo.faultPhenomenon,
    equipmentrepairTime: vo.reportTime,
    equipmentrepairReply: vo.workOrderId,
    equipmentrepairPerson: vo.repairPerson,
    equipmentrepairMoneny: vo.repairCost !== undefined ? String(vo.repairCost) : undefined,
    equipmentrepairLongtime: vo.repairTime !== undefined ? String(vo.repairTime) : undefined,
    equipmentrepairChange: statusToChange(vo.status),
  };
}
