import { toEquipmentVO, toEquipmentDTO } from '@/services/adapters/equipmentAdapter';
import type { EquipmentVO } from '@/api/equipment';

describe('equipmentAdapter', () => {
  describe('toEquipmentVO', () => {
    it('maps backend DTO fields to frontend VO', () => {
      const dto: EquipmentVO = {
        id: '123',
        devicename: 'CNC加工中心',
        devicecode: 'CNC-001',
        device_Type: 'A001',
        supplier: '西门子',
        status: '正常',
        purchase_Date: '2024-01-15',
        location: '车间A-01',
        description: '高精度五轴',
      };
      const vo = toEquipmentVO(dto);
      expect(vo.key).toBe('123');
      expect(vo.equipmentName).toBe('CNC加工中心');
      expect(vo.equipmentNumber).toBe('CNC-001');
      expect(vo.supplier).toBe('西门子');
      expect(vo.status).toBe('正常');
      expect(vo.productionDate).toBe('2024-01-15');
      expect(vo.equipmentLocal).toBe('车间A-01');
      expect(vo.modelSpecifications).toBe('高精度五轴');
    });

    it('returns default values for null/undefined fields', () => {
      const vo = toEquipmentVO({} as EquipmentVO);
      expect(vo.key).toBe('');
      expect(vo.equipmentName).toBe('');
      expect(vo.equipmentNumber).toBe('');
      expect(vo.manufacturerFactory).toBe('');
      expect(vo.brand).toBe('');
      expect(vo.supplier).toBe('');
      expect(vo.productionDate).toBe('');
      expect(vo.modelSpecifications).toBe('');
      expect(vo.serverLife).toBe(0);
      expect(vo.depreciationMethod).toBe('');
      expect(vo.equipmentLocal).toBe('');
      expect(vo.status).toBe('');
      expect(vo.department).toBe('');
      expect(vo.responsiblePerson).toBe('');
      expect(vo.extAttrMap).toEqual([]);
    });
  });

  describe('toEquipmentDTO', () => {
    it('maps frontend VO fields to backend DTO', () => {
      const vo = {
        equipmentName: 'CNC加工中心',
        equipmentNumber: 'CNC-001',
        supplier: '西门子',
        status: '正常',
        productionDate: '2024-01-15',
        equipmentLocal: '车间A-01',
        modelSpecifications: '高精度五轴',
      };
      const dto = toEquipmentDTO(vo);
      expect(dto.devicename).toBe('CNC加工中心');
      expect(dto.devicecode).toBe('CNC-001');
      expect(dto.supplier).toBe('西门子');
      expect(dto.status).toBe('正常');
      expect(dto.purchase_Date).toBe('2024-01-15');
      expect(dto.location).toBe('车间A-01');
      expect(dto.description).toBe('高精度五轴');
    });

    it('returns undefined for missing VO fields', () => {
      const dto = toEquipmentDTO({});
      expect(dto.devicename).toBeUndefined();
      expect(dto.devicecode).toBeUndefined();
      expect(dto.supplier).toBeUndefined();
      expect(dto.status).toBeUndefined();
      expect(dto.purchase_Date).toBeUndefined();
      expect(dto.location).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });
  });

  it('round-trip: toEquipmentVO({id, ...toEquipmentDTO(vo)}) preserves mapped fields', () => {
    const original = {
      equipmentName: '测试设备',
      equipmentNumber: 'EQ-001',
      supplier: '供应商A',
      status: '正常',
      productionDate: '2024-01-01',
      equipmentLocal: '车间B',
      modelSpecifications: '规格型号',
    };
    const dto = toEquipmentDTO(original);
    const vo = toEquipmentVO({ id: '1', ...dto } as EquipmentVO);
    expect(vo.equipmentName).toBe(original.equipmentName);
    expect(vo.equipmentNumber).toBe(original.equipmentNumber);
    expect(vo.supplier).toBe(original.supplier);
    expect(vo.status).toBe(original.status);
    expect(vo.productionDate).toBe(original.productionDate);
    expect(vo.equipmentLocal).toBe(original.equipmentLocal);
    expect(vo.modelSpecifications).toBe(original.modelSpecifications);
  });
});
