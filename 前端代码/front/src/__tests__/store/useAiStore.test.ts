import { useAiStore } from '@/store/useAiStore';
import type { EquipmentAiParams } from '@/services/interfaces/IEquipmentAiService';
import type { CodeAiParams } from '@/services/interfaces/ICodeAiService';
import type { RouteAiParams } from '@/services/interfaces/IRouteAiService';
import type { BomAiParams } from '@/services/interfaces/IBomAiService';
import { getEquipmentAiService, getCodeAiService, getRouteAiService, getBomAiService } from '@/services/registry';

vi.mock('@/services/registry', () => ({
  getEquipmentAiService: vi.fn(),
  getCodeAiService: vi.fn(),
  getRouteAiService: vi.fn(),
  getBomAiService: vi.fn(),
}));

function resetAiStore() {
  useAiStore.setState({
    aiStatus: {
      equipment: { available: true, degradationLevel: 'full' },
      code: { available: true, degradationLevel: 'full' },
      route: { available: true, degradationLevel: 'full' },
      bom: { available: true, degradationLevel: 'full' },
    },
    loading: { equipment: false, code: false, route: false, bom: false },
    equipmentResult: null,
    codeResult: null,
    routeResult: null,
    bomResult: null,
    degradedReason: null,
    missingParams: [],
    codeFormatError: null,
    codeConflictError: null,
  });
}

describe('useAiStore - analyzeEquipment', () => {
  beforeEach(resetAiStore);

  it('sets loading to true during call', async () => {
    const mockService = {
      analyzeEquipment: vi.fn().mockResolvedValue({
        data: { equipmentId: 'EQ-001', equipmentName: '测试', maintenanceSuggestions: [], faultPredictions: [], healthScore: 80, analysisTime: '2024-01-01' },
        source: 'mock',
        latency: 100,
        timestamp: Date.now(),
      }),
    };
    vi.mocked(getEquipmentAiService).mockReturnValue(mockService as any);

    const params: EquipmentAiParams = {
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 5,
      status: '运行中',
      lastMaintenanceDate: new Date(Date.now() - 200 * 86400000).toISOString(),
    };

    const promise = useAiStore.getState().analyzeEquipment(params);
    expect(useAiStore.getState().loading.equipment).toBe(true);
    await promise;
    expect(useAiStore.getState().loading.equipment).toBe(false);
  });

  it('sets error on service failure', async () => {
    const mockService = {
      analyzeEquipment: vi.fn().mockRejectedValue(new Error('服务不可用')),
    };
    vi.mocked(getEquipmentAiService).mockReturnValue(mockService as any);

    const params: EquipmentAiParams = {
      equipmentId: 'EQ-001',
      equipmentName: '测试设备',
      productionDate: '2020-01-01',
      serverLife: 5,
      status: '运行中',
      lastMaintenanceDate: new Date(Date.now() - 200 * 86400000).toISOString(),
    };

    await useAiStore.getState().analyzeEquipment(params);
    expect(useAiStore.getState().aiStatus.equipment.available).toBe(false);
    expect(useAiStore.getState().loading.equipment).toBe(false);
  });
});

describe('useAiStore - generateCode', () => {
  beforeEach(resetAiStore);

  it('sets loading to true during call', async () => {
    const mockService = {
      generateCode: vi.fn().mockResolvedValue({
        data: { primaryCode: { code: 'MC-GE-001', type: 'equipment', name: '', rule: '', segments: [] }, alternatives: [], complianceScore: 1, ruleDescription: '' },
        source: 'mock',
        latency: 100,
        timestamp: Date.now(),
      }),
    };
    vi.mocked(getCodeAiService).mockReturnValue(mockService as any);

    const params: CodeAiParams = { type: 'equipment', name: '齿轮' };
    const promise = useAiStore.getState().generateCode(params);
    expect(useAiStore.getState().loading.code).toBe(true);
    await promise;
    expect(useAiStore.getState().loading.code).toBe(false);
  });

  it('sets error on service failure', async () => {
    const mockService = {
      generateCode: vi.fn().mockRejectedValue(new Error('编码服务不可用')),
    };
    vi.mocked(getCodeAiService).mockReturnValue(mockService as any);

    await useAiStore.getState().generateCode({ type: 'equipment', name: '齿轮' });
    expect(useAiStore.getState().aiStatus.code.available).toBe(false);
    expect(useAiStore.getState().loading.code).toBe(false);
  });
});

describe('useAiStore - recommendRoute', () => {
  beforeEach(resetAiStore);

  it('sets loading to true during call', async () => {
    const mockService = {
      recommendRoute: vi.fn().mockResolvedValue({
        data: { partName: '齿轮', processes: [], totalEstimatedTime: '0h', confidence: 0.9, alternativeRoutes: [] },
        source: 'mock',
        latency: 100,
        timestamp: Date.now(),
      }),
    };
    vi.mocked(getRouteAiService).mockReturnValue(mockService as any);

    const params: RouteAiParams = { partName: '齿轮', partCode: 'MC-GE-001' };
    const promise = useAiStore.getState().recommendRoute(params);
    expect(useAiStore.getState().loading.route).toBe(true);
    await promise;
    expect(useAiStore.getState().loading.route).toBe(false);
  });

  it('sets error on service failure', async () => {
    const mockService = {
      recommendRoute: vi.fn().mockRejectedValue(new Error('工艺路线服务不可用')),
    };
    vi.mocked(getRouteAiService).mockReturnValue(mockService as any);

    await useAiStore.getState().recommendRoute({ partName: '齿轮', partCode: 'MC-GE-001' });
    expect(useAiStore.getState().aiStatus.route.available).toBe(false);
    expect(useAiStore.getState().loading.route).toBe(false);
  });
});

describe('useAiStore - validateBom', () => {
  beforeEach(resetAiStore);

  it('sets loading to true during call', async () => {
    const mockService = {
      validateBom: vi.fn().mockResolvedValue({
        data: { valid: true, errors: [], summary: { errorCount: 0, warningCount: 0, infoCount: 0 } },
        source: 'mock',
        latency: 100,
        timestamp: Date.now(),
      }),
    };
    vi.mocked(getBomAiService).mockReturnValue(mockService as any);

    const params: BomAiParams = { bomTree: [{ id: '1', partName: 'A', partCode: 'P1', quantity: 1 }] };
    const promise = useAiStore.getState().validateBom(params);
    expect(useAiStore.getState().loading.bom).toBe(true);
    await promise;
    expect(useAiStore.getState().loading.bom).toBe(false);
  });

  it('sets error on service failure', async () => {
    const mockService = {
      validateBom: vi.fn().mockRejectedValue(new Error('BOM服务不可用')),
    };
    vi.mocked(getBomAiService).mockReturnValue(mockService as any);

    await useAiStore.getState().validateBom({ bomTree: [{ id: '1', partName: 'A', partCode: 'P1', quantity: 1 }] });
    expect(useAiStore.getState().aiStatus.bom.available).toBe(false);
    expect(useAiStore.getState().loading.bom).toBe(false);
  });
});
