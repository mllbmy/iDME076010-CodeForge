import { toRepairVO } from '@/services/adapters/repairAdapter';

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

describe('repairAdapter', () => {
  describe('toRepairVO', () => {
    it('maps DTO fields to VO correctly', () => {
      const dto: RepairDTO = {
        id: 'r1',
        equipmentId: 'eq1',
        equipmentName: 'CNC加工中心',
        faultPhenomenon: '主轴异响',
        reportTime: '2024-03-15',
        workOrderId: 'WO-001',
        repairMeasures: '更换轴承',
        repairCost: 3000,
        repairPerson: '李四',
        repairChange: 'A0',
      };
      const vo = toRepairVO(dto);
      expect(vo.key).toBe('r1');
      expect(vo.equipmentId).toBe('eq1');
      expect(vo.equipmentName).toBe('CNC加工中心');
      expect(vo.faultPhenomenon).toBe('主轴异响');
      expect(vo.reportTime).toBe('2024-03-15');
      expect(vo.workOrderId).toBe('WO-001');
      expect(vo.repairMeasures).toBe('更换轴承');
      expect(vo.repairCost).toBe(3000);
      expect(vo.repairPerson).toBe('李四');
      expect(vo.status).toBe('已完成');
    });

    it('converts repairChange A0 to 已完成', () => {
      expect(toRepairVO({ repairChange: 'A0' } as RepairDTO).status).toBe('已完成');
    });

    it('converts repairChange A1 to 进行中', () => {
      expect(toRepairVO({ repairChange: 'A1' } as RepairDTO).status).toBe('进行中');
    });

    it('converts repairChange A2 to 待处理', () => {
      expect(toRepairVO({ repairChange: 'A2' } as RepairDTO).status).toBe('待处理');
    });

    it('defaults to 待处理 for unknown repairChange', () => {
      expect(toRepairVO({ repairChange: 'A3' } as RepairDTO).status).toBe('待处理');
    });

    it('returns default values for empty input', () => {
      const vo = toRepairVO({} as RepairDTO);
      expect(vo.key).toBe('');
      expect(vo.equipmentId).toBe('');
      expect(vo.equipmentName).toBe('');
      expect(vo.faultPhenomenon).toBe('');
      expect(vo.responseTime).toBe(0);
      expect(vo.repairTime).toBe(0);
      expect(vo.repairCost).toBe(0);
      expect(vo.faultImages).toEqual([]);
      expect(vo.status).toBe('待处理');
    });
  });
});
