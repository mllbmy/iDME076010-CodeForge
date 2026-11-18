import { validateEquipmentParams, shouldTriggerMaintenance, validateBomLimits } from '@/store/useAiStore';

const PART_CODE_REGEX = /^MC-[A-Z]{2,4}-\d{3}$/;
const PROCESS_CODE_REGEX = /^MTR-\d{3,4}$/;

describe('validateEquipmentParams', () => {
  it('returns missing fields when params are empty', () => {
    const result = validateEquipmentParams({
      equipmentId: '',
      equipmentName: '',
      productionDate: '',
      serverLife: 0,
      status: '',
    });
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('设备ID');
    expect(result.missing).toContain('设备名称');
    expect(result.missing).toContain('生产日期');
    expect(result.missing).toContain('使用年限');
    expect(result.missing).toContain('设备状态');
  });

  it('returns valid when all required params are present', () => {
    const result = validateEquipmentParams({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 5,
      status: '运行中',
    });
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('returns missing for serverLife <= 0', () => {
    const result = validateEquipmentParams({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: -1,
      status: '运行中',
    });
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('使用年限');
  });
});

describe('shouldTriggerMaintenance', () => {
  it('triggers when serverLife >= 3', () => {
    const result = shouldTriggerMaintenance({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 3,
      status: '运行中',
      lastMaintenanceDate: new Date().toISOString(),
    });
    expect(result).toBe(true);
  });

  it('triggers when days since last maintenance >= 180', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 200);
    const result = shouldTriggerMaintenance({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 1,
      status: '运行中',
      lastMaintenanceDate: oldDate.toISOString(),
    });
    expect(result).toBe(true);
  });

  it('triggers when runtime >= 5000', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10);
    const result = shouldTriggerMaintenance({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 1,
      status: '运行中',
      lastMaintenanceDate: recentDate.toISOString(),
      runtime: 5000,
    });
    expect(result).toBe(true);
  });

  it('does not trigger when conditions are not met', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10);
    const result = shouldTriggerMaintenance({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 1,
      status: '运行中',
      lastMaintenanceDate: recentDate.toISOString(),
      runtime: 1000,
    });
    expect(result).toBe(false);
  });

  it('triggers when no lastMaintenanceDate provided', () => {
    const result = shouldTriggerMaintenance({
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 1,
      status: '运行中',
    });
    expect(result).toBe(true);
  });
});

describe('PART_CODE_REGEX', () => {
  it('matches valid part codes', () => {
    expect(PART_CODE_REGEX.test('MC-GE-001')).toBe(true);
    expect(PART_CODE_REGEX.test('MC-GEAR-123')).toBe(true);
  });

  it('rejects invalid part codes', () => {
    expect(PART_CODE_REGEX.test('MC-A-001')).toBe(false);
    expect(PART_CODE_REGEX.test('MC-ABCDE-001')).toBe(false);
    expect(PART_CODE_REGEX.test('MC-GE-12')).toBe(false);
    expect(PART_CODE_REGEX.test('MC-GE-1234')).toBe(false);
  });
});

describe('PROCESS_CODE_REGEX', () => {
  it('matches valid process codes', () => {
    expect(PROCESS_CODE_REGEX.test('MTR-001')).toBe(true);
    expect(PROCESS_CODE_REGEX.test('MTR-1234')).toBe(true);
  });

  it('rejects invalid process codes', () => {
    expect(PROCESS_CODE_REGEX.test('MTR-01')).toBe(false);
    expect(PROCESS_CODE_REGEX.test('MTR-12345')).toBe(false);
    expect(PROCESS_CODE_REGEX.test('MTX-001')).toBe(false);
  });
});

describe('validateBomLimits', () => {
  it('returns invalid when node count > 500', () => {
    const bomTree = Array.from({ length: 501 }, (_, i) => ({
      id: `node-${i}`,
      partName: `Part${i}`,
      partCode: `P${i}`,
      quantity: 1,
    }));
    const result = validateBomLimits(bomTree);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('501');
    expect(result.error).toContain('500');
  });

  it('returns invalid when depth > 10', () => {
    const buildDeep = (depth: number): any => {
      if (depth <= 0) return { id: 'leaf', partName: 'Leaf', partCode: 'L', quantity: 1 };
      return {
        id: `node-${depth}`,
        partName: `Node${depth}`,
        partCode: `N${depth}`,
        quantity: 1,
        children: [buildDeep(depth - 1)],
      };
    };
    const bomTree = [buildDeep(11)];
    const result = validateBomLimits(bomTree);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('11');
    expect(result.error).toContain('10');
  });

  it('returns valid within limits', () => {
    const bomTree = [
      {
        id: 'root',
        partName: 'Root',
        partCode: 'R',
        quantity: 1,
        children: [
          { id: 'child', partName: 'Child', partCode: 'C', quantity: 2 },
        ],
      },
    ];
    const result = validateBomLimits(bomTree);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
