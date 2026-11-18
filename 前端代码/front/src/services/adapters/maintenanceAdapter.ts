import type { MaintenanceRecord } from '@/store/types';
import type { EquipmentMaintenanceViewDTO, EquipmentMaintenanceCreateDTO } from '@/api/equipmentMaintenance';

export function toMaintenanceVO(dto: EquipmentMaintenanceViewDTO): MaintenanceRecord {
  return {
    key: dto.id || '',
    planId: dto.maintenanceId || '',
    equipmentId: '',
    equipmentName: dto.maintenanceName || '',
    maintenanceType: dto.maintenanceType || '',
    maintenanceTime: dto.maintenanceTime || '',
    maintenanceContent: dto.maintenanceTask || '',
    maintainer: dto.maintenancePerson || '',
    partsReplaced: [],
    cost: Number(dto.maintenanceMoneny) || 0,
    remark: '',
    status:
      dto.maintenanceChange === 'A0' ? '已完成' : dto.maintenanceChange === 'A1' ? '进行中' : '待处理',
  };
}

export function toMaintenanceDTO(vo: Partial<MaintenanceRecord>): EquipmentMaintenanceCreateDTO {
  const statusToChange = (status?: string): 'A0' | 'A1' | 'A2' | undefined => {
    if (status === '已完成') return 'A0';
    if (status === '进行中') return 'A1';
    if (status === '待处理') return 'A2';
    return undefined;
  };

  return {
    maintenanceId: vo.planId,
    maintenanceName: vo.equipmentName,
    maintenanceType: vo.maintenanceType,
    maintenanceTime: vo.maintenanceTime,
    maintenanceTask: vo.maintenanceContent,
    maintenancePerson: vo.maintainer,
    maintenanceMoneny: vo.cost !== undefined ? String(vo.cost) : undefined,
    maintenanceChange: statusToChange(vo.status),
  };
}
