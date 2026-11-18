import type { IEquipmentService, IAuthService } from './interfaces';
import type { IEquipmentAiService, ICodeAiService, IRouteAiService, IBomAiService, IInventoryAiService, IRepairAiService, IInsightAiService, ISupplierAiService } from './interfaces';
import type { IPartService, IWorkingProcedureService, IWorkingPlanService } from './interfaces';
import { MockEquipmentService } from './mock/MockEquipmentService';
import { MockAuthService } from './mock/MockAuthService';
import { MockEquipmentAiService } from './mock/MockEquipmentAiService';
import { MockCodeAiService } from './mock/MockCodeAiService';
import { MockRouteAiService } from './mock/MockRouteAiService';
import { MockBomAiService } from './mock/MockBomAiService';
import { MockInventoryAiService } from './mock/MockInventoryAiService';
import { MockRepairAiService } from './mock/MockRepairAiService';
import { MockInsightAiService } from './mock/MockInsightAiService';
import { MockSupplierAiService } from './mock/MockSupplierAiService';
import { MockPartService } from './mock/MockPartService';
import { MockWorkingProcedureService } from './mock/MockWorkingProcedureService';
import { MockWorkingPlanService } from './mock/MockWorkingPlanService';
import { RealEquipmentService } from './real/RealEquipmentService';
import { RealAuthService } from './real/RealAuthService';
import { RealEquipmentAiService } from './real/RealEquipmentAiService';
import { RealCodeAiService } from './real/RealCodeAiService';
import { RealRouteAiService } from './real/RealRouteAiService';
import { RealBomAiService } from './real/RealBomAiService';
import { RealInventoryAiService } from './real/RealInventoryAiService';
import { RealRepairAiService } from './real/RealRepairAiService';
import { RealInsightAiService } from './real/RealInsightAiService';
import { RealSupplierAiService } from './real/RealSupplierAiService';
import { RealPartService } from './real/RealPartService';
import { RealWorkingProcedureService } from './real/RealWorkingProcedureService';
import { RealWorkingPlanService } from './real/RealWorkingPlanService';
import type { IBlockchainService } from './interfaces';
import { MockBlockchainService } from './mock/MockBlockchainService';
import { RealBlockchainService } from './real/RealBlockchainService';

type ApiMode = 'mock' | 'real';

function getApiMode(): ApiMode {
  const mode = import.meta.env.VITE_API_MODE;
  if (mode === 'real') return 'real';
  return 'mock';
}

const serviceCache = new Map<string, unknown>();

function getOrCreate<T>(key: string, factory: () => T): T {
  if (!serviceCache.has(key)) {
    serviceCache.set(key, factory());
  }
  return serviceCache.get(key) as T;
}

// 策略B降级方案：保养/维修后端API暂未部署，Real模式下仍使用Mock实例
// 当后端保养/维修API可用后，将 USE_MOCK_MAINTENANCE 和 USE_MOCK_REPAIR 改为 false 即可切换为Real实例
const USE_MOCK_MAINTENANCE = true;
const USE_MOCK_REPAIR = true;

export function getEquipmentService(): IEquipmentService {
  const mode = getApiMode();
  if (mode === 'real' && USE_MOCK_MAINTENANCE && USE_MOCK_REPAIR) {
    return getOrCreate('equipment-real-mock-maint-repair', () => new RealEquipmentService());
  }
  return getOrCreate(`equipment-${mode}`, () =>
    mode === 'real' ? new RealEquipmentService() : new MockEquipmentService(),
  );
}

export function getAuthService(): IAuthService {
  const mode = getApiMode();
  return getOrCreate(`auth-${mode}`, () =>
    mode === 'real' ? new RealAuthService() : new MockAuthService(),
  );
}

export function getEquipmentAiService(): IEquipmentAiService {
  const mode = getApiMode();
  return getOrCreate(`equipment-ai-${mode}`, () =>
    mode === 'real' ? new RealEquipmentAiService() : new MockEquipmentAiService(),
  );
}

export function getCodeAiService(): ICodeAiService {
  const mode = getApiMode();
  return getOrCreate(`code-ai-${mode}`, () =>
    mode === 'real' ? new RealCodeAiService() : new MockCodeAiService(),
  );
}

export function getRouteAiService(): IRouteAiService {
  const mode = getApiMode();
  return getOrCreate(`route-ai-${mode}`, () =>
    mode === 'real' ? new RealRouteAiService() : new MockRouteAiService(),
  );
}

export function getBomAiService(): IBomAiService {
  const mode = getApiMode();
  return getOrCreate(`bom-ai-${mode}`, () =>
    mode === 'real' ? new RealBomAiService() : new MockBomAiService(),
  );
}

export function getInventoryAiService(): IInventoryAiService {
  const mode = getApiMode();
  return getOrCreate(`inventory-ai-${mode}`, () =>
    mode === 'real' ? new RealInventoryAiService() : new MockInventoryAiService(),
  );
}

export function getRepairAiService(): IRepairAiService {
  const mode = getApiMode();
  return getOrCreate(`repair-ai-${mode}`, () =>
    mode === 'real' ? new RealRepairAiService() : new MockRepairAiService(),
  );
}

export function getInsightAiService(): IInsightAiService {
  const mode = getApiMode();
  return getOrCreate(`insight-ai-${mode}`, () =>
    mode === 'real' ? new RealInsightAiService() : new MockInsightAiService(),
  );
}

export function getSupplierAiService(): ISupplierAiService {
  const mode = getApiMode();
  return getOrCreate(`supplier-ai-${mode}`, () =>
    mode === 'real' ? new RealSupplierAiService() : new MockSupplierAiService(),
  );
}

export function getBlockchainService(): IBlockchainService {
  const mode = getApiMode();
  return getOrCreate(`blockchain-${mode}`, () =>
    mode === 'real' ? new RealBlockchainService() : new MockBlockchainService(),
  );
}

export function getPartService(): IPartService {
  const mode = getApiMode();
  return getOrCreate(`part-${mode}`, () =>
    mode === 'real' ? new RealPartService() : new MockPartService(),
  );
}

export function getWorkingProcedureService(): IWorkingProcedureService {
  const mode = getApiMode();
  return getOrCreate(`working-procedure-${mode}`, () =>
    mode === 'real' ? new RealWorkingProcedureService() : new MockWorkingProcedureService(),
  );
}

export function getWorkingPlanService(): IWorkingPlanService {
  const mode = getApiMode();
  return getOrCreate(`working-plan-${mode}`, () =>
    mode === 'real' ? new RealWorkingPlanService() : new MockWorkingPlanService(),
  );
}

if (import.meta.env.PROD && getApiMode() === 'mock') {
  console.error('生产环境禁止使用 Mock 模式！');
}
