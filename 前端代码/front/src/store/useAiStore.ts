import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AiDegradationLevel, AiStatus } from '@/services/ai/types';
import type { EquipmentAiResult, EquipmentAiParams } from '@/services/interfaces/IEquipmentAiService';
import type { CodeAiResult, CodeAiParams } from '@/services/interfaces/ICodeAiService';
import type { RouteAiResult, RouteAiParams } from '@/services/interfaces/IRouteAiService';
import type { BomAiResult, BomAiParams, BomNode } from '@/services/interfaces/IBomAiService';
import type { InventoryAiResult, InventoryAiParams } from '@/services/interfaces/IInventoryAiService';
import type { RepairAiResult, RepairAiParams } from '@/services/interfaces/IRepairAiService';
import type { InsightAiResult, InsightAiParams } from '@/services/interfaces/IInsightAiService';
import type { SupplierAiResult, SupplierAiParams } from '@/services/interfaces/ISupplierAiService';
import { getEquipmentAiService, getCodeAiService, getRouteAiService, getBomAiService, getInventoryAiService, getRepairAiService, getInsightAiService, getSupplierAiService } from '@/services/registry';
import { AiDegradedReason } from '@/services/ai/aiDegraded';
import { DEGRADED_MESSAGES } from '@/services/ai/aiDegraded';
import { dataStore } from '@/store/dataStore';

const PART_CODE_REGEX = /^MC-[A-Z]{2,4}-\d{3}$/;
const PROCESS_CODE_REGEX = /^MTR-\d{3,4}$/;

export function validateEquipmentParams(params: EquipmentAiParams): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!params.equipmentId) missing.push('设备ID');
  if (!params.equipmentName) missing.push('设备名称');
  if (!params.productionDate) missing.push('生产日期');
  if (!params.serverLife || params.serverLife <= 0) missing.push('使用年限');
  if (!params.status) missing.push('设备状态');
  return { valid: missing.length === 0, missing };
}

export function shouldTriggerMaintenance(params: EquipmentAiParams): boolean {
  if (params.serverLife >= 3) return true;
  if (params.lastMaintenanceDate) {
    const daysSinceLast = (Date.now() - new Date(params.lastMaintenanceDate).getTime()) / 86400000;
    if (daysSinceLast >= 180) return true;
  } else {
    return true;
  }
  if (params.runtime && params.runtime >= 5000) return true;
  return false;
}

export function validateBomLimits(bomTree: BomNode[]): { valid: boolean; error?: string } {
  let nodeCount = 0;
  let maxDepth = 0;

  function countNodes(nodes: BomNode[], depth: number) {
    for (const node of nodes) {
      nodeCount++;
      if (depth > maxDepth) maxDepth = depth;
      if (node.children) countNodes(node.children, depth + 1);
    }
  }
  countNodes(bomTree, 1);

  if (nodeCount > 500) return { valid: false, error: `BOM节点数(${nodeCount})超过上限(500)` };
  if (maxDepth > 10) return { valid: false, error: `BOM层级深度(${maxDepth})超过上限(10)` };
  return { valid: true };
}

function checkCodeUniqueness(code: string, codeType: string): boolean {
  if (codeType === 'equipment') {
    const equipmentData = dataStore.getEquipmentData();
    return !equipmentData.some((e) => e.equipmentNumber === code);
  }
  return true;
}

interface AiStore {
  aiStatus: Record<string, AiStatus>;
  loading: Record<string, boolean>;

  equipmentResult: EquipmentAiResult | null;
  codeResult: CodeAiResult | null;
  routeResult: RouteAiResult | null;
  bomResult: BomAiResult | null;
  inventoryResult: InventoryAiResult | null;
  repairResult: RepairAiResult | null;
  insightResult: InsightAiResult | null;
  supplierResult: SupplierAiResult | null;

  degradedReason: AiDegradedReason | null;
  missingParams: string[];
  codeFormatError: string | null;
  codeConflictError: string | null;

  analyzeEquipment: (params: EquipmentAiParams) => Promise<void>;
  generateCode: (params: CodeAiParams) => Promise<void>;
  recommendRoute: (params: RouteAiParams) => Promise<void>;
  validateBom: (params: BomAiParams) => Promise<void>;
  analyzeInventory: (params: InventoryAiParams) => Promise<void>;
  recommendRepair: (params: RepairAiParams) => Promise<void>;
  generateInsights: (params: InsightAiParams) => Promise<void>;
  evaluateSupplier: (params: SupplierAiParams) => Promise<void>;

  updateAiStatus: (module: string, status: Partial<AiStatus>) => void;
  clearResult: (module: 'equipment' | 'code' | 'route' | 'bom' | 'inventory' | 'repair' | 'insight' | 'supplier') => void;
}

const initialStatus = (): AiStatus => ({
  available: true,
  degradationLevel: 'full' as AiDegradationLevel,
});

export const useAiStore = create<AiStore>()(
  devtools(
    (set, get) => ({
      aiStatus: {
        equipment: initialStatus(),
        code: initialStatus(),
        route: initialStatus(),
        bom: initialStatus(),
        inventory: initialStatus(),
        repair: initialStatus(),
        insight: initialStatus(),
        supplier: initialStatus(),
      },
      loading: { equipment: false, code: false, route: false, bom: false, inventory: false, repair: false, insight: false, supplier: false },
      equipmentResult: null,
      codeResult: null,
      routeResult: null,
      bomResult: null,
      inventoryResult: null,
      insightResult: null,
      supplierResult: null,
      repairResult: null,
      degradedReason: null,
      missingParams: [],
      codeFormatError: null,
      codeConflictError: null,

      analyzeEquipment: async (params) => {
        set((s) => ({ loading: { ...s.loading, equipment: true }, degradedReason: null, missingParams: [] }));
        try {
          const paramValidation = validateEquipmentParams(params);
          if (!paramValidation.valid) {
            set({
              degradedReason: AiDegradedReason.PARAMS_MISSING,
              missingParams: paramValidation.missing,
              aiStatus: {
                ...get().aiStatus,
                equipment: {
                  ...get().aiStatus.equipment,
                  available: false,
                  degradationLevel: 'partial' as AiDegradationLevel,
                  lastError: `${DEGRADED_MESSAGES[AiDegradedReason.PARAMS_MISSING]}，缺失：${paramValidation.missing.join('、')}`,
                },
              },
            });
            return;
          }

          if (!shouldTriggerMaintenance(params)) {
            set({
              degradedReason: AiDegradedReason.NOT_TRIGGERED,
              aiStatus: {
                ...get().aiStatus,
                equipment: {
                  ...get().aiStatus.equipment,
                  available: true,
                  degradationLevel: 'partial' as AiDegradationLevel,
                  lastError: DEGRADED_MESSAGES[AiDegradedReason.NOT_TRIGGERED],
                },
              },
            });
            return;
          }

          const service = getEquipmentAiService();
          const response = await service.analyzeEquipment(params);
          set({
            equipmentResult: response.data,
            aiStatus: { ...get().aiStatus, equipment: { ...get().aiStatus.equipment, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            degradedReason: AiDegradedReason.SERVICE_UNAVAILABLE,
            aiStatus: {
              ...s.aiStatus,
              equipment: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, equipment: false } }));
        }
      },

      generateCode: async (params) => {
        set((s) => ({ loading: { ...s.loading, code: true }, codeFormatError: null, codeConflictError: null }));
        try {
          const service = getCodeAiService();
          const response = await service.generateCode(params);
          const result = response.data;

          const regex = params.type === 'process' ? PROCESS_CODE_REGEX : PART_CODE_REGEX;
          if (!regex.test(result.primaryCode.code)) {
            set({
              codeFormatError: `AI编码格式不合规: ${result.primaryCode.code}`,
              aiStatus: { ...get().aiStatus, code: { ...get().aiStatus.code, available: true, lastLatency: response.latency } },
            });
            return;
          }

          if (!checkCodeUniqueness(result.primaryCode.code, params.type)) {
            set({
              codeConflictError: `编码与已有记录冲突: ${result.primaryCode.code}`,
              aiStatus: { ...get().aiStatus, code: { ...get().aiStatus.code, available: true, lastLatency: response.latency } },
            });
            return;
          }

          set({
            codeResult: result,
            aiStatus: { ...get().aiStatus, code: { ...get().aiStatus.code, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              code: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, code: false } }));
        }
      },

      recommendRoute: async (params) => {
        set((s) => ({ loading: { ...s.loading, route: true } }));
        try {
          const service = getRouteAiService();
          const response = await service.recommendRoute(params);
          const result = response.data;
          if (result.processes.length > 20) {
            const originalCount = result.processes.length;
            result.processes = result.processes.slice(0, 20);
            result.totalEstimatedTime = result.processes.reduce((sum, p) => sum + parseFloat(p.estimatedTime), 0) + 'h';
            set({
              routeResult: result,
              aiStatus: {
                ...get().aiStatus,
                route: {
                  ...get().aiStatus.route,
                  available: true,
                  lastLatency: response.latency,
                  lastError: `原始结果包含${originalCount}道工序，已截断为20道`,
                },
              },
            });
          } else {
            set({
              routeResult: result,
              aiStatus: { ...get().aiStatus, route: { ...get().aiStatus.route, available: true, lastLatency: response.latency } },
            });
          }
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              route: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, route: false } }));
        }
      },

      validateBom: async (params) => {
        set((s) => ({ loading: { ...s.loading, bom: true } }));
        try {
          const limitsResult = validateBomLimits(params.bomTree);
          if (!limitsResult.valid) {
            set({
              bomResult: { valid: false, errors: [], summary: { errorCount: 1, warningCount: 0, infoCount: 0 } },
              aiStatus: {
                ...get().aiStatus,
                bom: {
                  ...get().aiStatus.bom,
                  available: true,
                  lastError: limitsResult.error,
                },
              },
            });
            return;
          }

          const service = getBomAiService();
          const response = await service.validateBom(params);
          set({
            bomResult: response.data,
            aiStatus: { ...get().aiStatus, bom: { ...get().aiStatus.bom, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              bom: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, bom: false } }));
        }
      },

      analyzeInventory: async (params) => {
        set((s) => ({ loading: { ...s.loading, inventory: true } }));
        try {
          const service = getInventoryAiService();
          const response = await service.analyzeInventory(params);
          set({
            inventoryResult: response.data,
            aiStatus: { ...get().aiStatus, inventory: { ...get().aiStatus.inventory, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              inventory: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, inventory: false } }));
        }
      },

      recommendRepair: async (params) => {
        set((s) => ({ loading: { ...s.loading, repair: true } }));
        try {
          const service = getRepairAiService();
          const response = await service.recommendRepairPlan(params);
          set({
            repairResult: response.data,
            aiStatus: { ...get().aiStatus, repair: { ...get().aiStatus.repair, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              repair: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, repair: false } }));
        }
      },

      generateInsights: async (params) => {
        set((s) => ({ loading: { ...s.loading, insight: true } }));
        try {
          const service = getInsightAiService();
          const response = await service.generateInsights(params);
          set({
            insightResult: response.data,
            aiStatus: { ...get().aiStatus, insight: { ...get().aiStatus.insight, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              insight: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, insight: false } }));
        }
      },

      evaluateSupplier: async (params) => {
        set((s) => ({ loading: { ...s.loading, supplier: true } }));
        try {
          const service = getSupplierAiService();
          const response = await service.evaluateSupplier(params);
          set({
            supplierResult: response.data,
            aiStatus: { ...get().aiStatus, supplier: { ...get().aiStatus.supplier, available: true, lastLatency: response.latency } },
          });
        } catch (error) {
          set((s) => ({
            aiStatus: {
              ...s.aiStatus,
              supplier: { available: false, degradationLevel: 'unavailable' as AiDegradationLevel, lastError: (error as Error).message },
            },
          }));
        } finally {
          set((s) => ({ loading: { ...s.loading, supplier: false } }));
        }
      },

      updateAiStatus: (module, status) => {
        set((s) => ({
          aiStatus: { ...s.aiStatus, [module]: { ...s.aiStatus[module], ...status } },
        }));
      },

      clearResult: (module) => {
        const field = `${module}Result` as keyof Pick<AiStore, 'equipmentResult' | 'codeResult' | 'routeResult' | 'bomResult'>;
        set({ [field]: null } as Partial<AiStore>);
      },
    }),
    { name: 'AiStore' },
  ),
);
