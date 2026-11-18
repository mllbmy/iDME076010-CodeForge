import { toMaintenanceVO, toMaintenanceDTO } from '@/services/adapters/maintenanceAdapter';
import type { EquipmentMaintenanceViewDTO } from '@/api/equipmentMaintenance';
import type { MaintenanceRecord } from '@/store/types';

describe('maintenanceAdapter', () => {
  describe('toMaintenanceVO', () => {
    it('maps DTO fields to VO correctly', () => {
      const dto: EquipmentMaintenanceViewDTO = {
        id: 'm1',
        maintenanceId: 'PLAN-001',
        maintenanceName: 'CNC保养',
        maintenanceType: '定期保养',
        maintenanceTime: '2024-03-01',
        maintenanceTask: '更换润滑油',
        maintenancePerson: '张三',
        maintenanceMoneny: '500',
        maintenanceChange: 'A0',
      };
      const vo = toMaintenanceVO(dto);
      expect(vo.key).toBe('m1');
      expect(vo.planId).toBe('PLAN-001');
      expect(vo.equipmentName).toBe('CNC保养');
      expect(vo.maintenanceType).toBe('定期保养');
      expect(vo.maintenanceTime).toBe('2024-03-01');
      expect(vo.maintenanceContent).toBe('更换润滑油');
      expect(vo.maintainer).toBe('张三');
      expect(vo.cost).toBe(500);
      expect(vo.status).toBe('已完成');
    });

    it('converts maintenanceChange A0 to 已完成', () => {
      const dto = { maintenanceChange: 'A0' } as EquipmentMaintenanceViewDTO;
      expect(toMaintenanceVO(dto).status).toBe('已完成');
    });

    it('converts maintenanceChange A1 to 进行中', () => {
      const dto = { maintenanceChange: 'A1' } as EquipmentMaintenanceViewDTO;
      expect(toMaintenanceVO(dto).status).toBe('进行中');
    });

    it('converts maintenanceChange A2 to 待处理', () => {
      const dto = { maintenanceChange: 'A2' } as EquipmentMaintenanceViewDTO;
      expect(toMaintenanceVO(dto).status).toBe('待处理');
    });

    it('defaults to 待处理 for unknown maintenanceChange', () => {
      const dto = { maintenanceChange: 'A3' } as EquipmentMaintenanceViewDTO;
      expect(toMaintenanceVO(dto).status).toBe('待处理');
    });

    it('returns default values for empty input', () => {
      const vo = toMaintenanceVO({} as EquipmentMaintenanceViewDTO);
      expect(vo.key).toBe('');
      expect(vo.planId).toBe('');
      expect(vo.equipmentName).toBe('');
      expect(vo.cost).toBe(0);
      expect(vo.partsReplaced).toEqual([]);
      expect(vo.status).toBe('待处理');
    });
  });

  describe('toMaintenanceDTO', () => {
    it('maps VO fields to DTO correctly', () => {
      const vo: Partial<MaintenanceRecord> = {
        planId: 'PLAN-001',
        equipmentName: 'CNC保养',
        maintenanceType: '定期保养',
        maintenanceTime: '2024-03-01',
        maintenanceContent: '更换润滑油',
        maintainer: '张三',
        cost: 500,
        status: '已完成',
      };
      const dto = toMaintenanceDTO(vo);
      expect(dto.maintenanceId).toBe('PLAN-001');
      expect(dto.maintenanceName).toBe('CNC保养');
      expect(dto.maintenanceType).toBe('定期保养');
      expect(dto.maintenanceTime).toBe('2024-03-01');
      expect(dto.maintenanceTask).toBe('更换润滑油');
      expect(dto.maintenancePerson).toBe('张三');
      expect(dto.maintenanceMoneny).toBe('500');
      expect(dto.maintenanceChange).toBe('A0');
    });

    it('converts status 已完成 to A0', () => {
      expect(toMaintenanceDTO({ status: '已完成' }).maintenanceChange).toBe('A0');
    });

    it('converts status 进行中 to A1', () => {
      expect(toMaintenanceDTO({ status: '进行中' }).maintenanceChange).toBe('A1');
    });

    it('converts status 待处理 to A2', () => {
      expect(toMaintenanceDTO({ status: '待处理' }).maintenanceChange).toBe('A2');
    });

    it('returns undefined maintenanceChange for unknown status', () => {
      expect(toMaintenanceDTO({ status: '未知' }).maintenanceChange).toBeUndefined();
    });
  });
});
