import type { EquipmentAiResult, MaintenanceSuggestion, FaultPrediction } from '../interfaces/IEquipmentAiService';
import type { CodeAiResult, GeneratedCode } from '../interfaces/ICodeAiService';
import type { RouteAiResult } from '../interfaces/IRouteAiService';
import type { BomAiResult, BomValidationError } from '../interfaces/IBomAiService';
import type { InventoryAiResult, StockOutPrediction, ReplenishmentSuggestion, ConsumptionAnomaly } from '../interfaces/IInventoryAiService';

export const MOCK_MAINTENANCE_SUGGESTIONS: MaintenanceSuggestion[] = [
  {
    type: 'routine',
    priority: 'medium',
    title: '定期保养建议',
    description: '基于设备运行时长和出厂日期，建议进行定期保养',
    suggestedDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    estimatedDuration: '4小时',
    riskIfSkipped: '可能导致精度下降，影响加工质量',
  },
  {
    type: 'precision',
    priority: 'high',
    title: '精密校准',
    description: '设备使用年限较长，建议进行精密校准',
    suggestedDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    estimatedDuration: '8小时',
    riskIfSkipped: '加工精度可能超差',
  },
];

export const MOCK_FAULT_PREDICTIONS: FaultPrediction[] = [
  {
    faultType: '主轴轴承磨损',
    probability: 0.35,
    confidence: 0.82,
    possibleCause: '运行时长较长，轴承疲劳',
    suggestedAction: '建议在下一次保养时检查主轴轴承，准备备件',
    timeWindow: '30天内',
  },
];

export function getMockEquipmentResult(equipmentId: string, equipmentName: string): EquipmentAiResult {
  return {
    equipmentId,
    equipmentName,
    maintenanceSuggestions: MOCK_MAINTENANCE_SUGGESTIONS.map((s) => ({
      ...s,
      description: s.description.replace('设备', equipmentName),
    })),
    faultPredictions: MOCK_FAULT_PREDICTIONS,
    healthScore: 78,
    analysisTime: new Date().toISOString(),
  };
}

export function getMockCodeResult(code: string, type: 'equipment' | 'material', name: string): CodeAiResult {
  const primaryCode: GeneratedCode = {
    code,
    type,
    name,
    rule: type === 'equipment' ? 'MC-{设备类型}-{序号}' : 'MTR-{物料类型}-{序号}',
    segments: code.split('-').map((seg, i) => ({
      label: ['前缀', '类型', '序号'][i] || `段${i}`,
      value: seg,
    })),
  };
  return {
    primaryCode,
    alternatives: [],
    complianceScore: 0.95,
    ruleDescription: type === 'equipment'
      ? '设备编码规则：MC(设备前缀)-{类型缩写}-{3位序号}'
      : '物料编码规则：MTR(物料前缀)-{类型缩写}-{4位序号}',
  };
}

export const MOCK_ROUTE_PROCESSES: { name: string; time: string; equipment: string }[] = [
  { name: '锻造制坯', time: '2h', equipment: '锻压机' },
  { name: '粗车', time: '1.5h', equipment: '数控车床' },
  { name: '精车', time: '2h', equipment: '数控车床' },
  { name: '滚齿', time: '3h', equipment: '数控滚齿机' },
  { name: '磨齿', time: '2.5h', equipment: '数控磨齿机' },
  { name: '热处理', time: '4h', equipment: '渗碳炉' },
  { name: '检验', time: '1h', equipment: '齿轮检测仪' },
];

export const MOCK_ROUTE_PROCESSES_ALT: { name: string; time: string; equipment: string }[] = [
  { name: '下料', time: '0.5h', equipment: '数控锯床' },
  { name: '粗车', time: '1.5h', equipment: '数控车床' },
  { name: '精车', time: '2h', equipment: '数控车床' },
  { name: '磨削', time: '1.5h', equipment: '数控磨床' },
  { name: '检验', time: '0.5h', equipment: '三坐标测量仪' },
];

export const MOCK_ROUTE_PROCESSES_DEFAULT: { name: string; time: string; equipment: string }[] = [
  { name: '下料', time: '1h', equipment: '数控锯床' },
  { name: '粗加工', time: '2h', equipment: '数控车床' },
  { name: '精加工', time: '2h', equipment: '数控铣床' },
  { name: '检验', time: '1h', equipment: '三坐标测量仪' },
];

export function getMockRouteResult(
  partName: string,
  processes: { name: string; time: string; equipment: string }[],
): RouteAiResult {
  return {
    partName,
    processes: processes.map((p, i) => ({
      step: i + 1,
      processName: p.name,
      processCode: `PR-${String(i + 1).padStart(3, '0')}`,
      estimatedTime: p.time,
      equipment: p.equipment,
      description: `${p.name}工序`,
    })),
    totalEstimatedTime: processes.reduce((sum, p) => sum + parseFloat(p.time), 0) + 'h',
    confidence: 0.85,
    alternativeRoutes: [],
  };
}

export function getMockBomResult(errors: BomValidationError[]): BomAiResult {
  return {
    valid: errors.filter((e) => e.level === 'error').length === 0,
    errors,
    summary: {
      errorCount: errors.filter((e) => e.level === 'error').length,
      warningCount: errors.filter((e) => e.level === 'warning').length,
      infoCount: errors.filter((e) => e.level === 'info').length,
    },
  };
}

import type { RepairAiResult, RepairPlan } from '../interfaces/IRepairAiService';

export const MOCK_REPAIR_PLANS: RepairPlan[] = [
  {
    planId: 'plan-001',
    possibleCause: '主轴轴承磨损',
    confidence: 0.85,
    repairSteps: [
      { step: 1, action: '拆卸主轴组件', estimatedTime: '1h' },
      { step: 2, action: '检测轴承游隙', estimatedTime: '0.5h', requiredParts: '千分表' },
      { step: 3, action: '更换主轴轴承（型号：NN3020）', estimatedTime: '1.5h', requiredParts: 'NN3020轴承×1' },
      { step: 4, action: '重新装配并校准', estimatedTime: '1h', requiredParts: '润滑脂×1' },
    ],
    estimatedDuration: '4h',
    estimatedCost: '¥3,500',
    requiredSpareParts: ['NN3020轴承×1', '润滑脂×1'],
    riskLevel: 'medium',
  },
  {
    planId: 'plan-002',
    possibleCause: '主轴动平衡失调',
    confidence: 0.60,
    repairSteps: [
      { step: 1, action: '拆卸主轴', estimatedTime: '1h' },
      { step: 2, action: '动平衡检测', estimatedTime: '1h', requiredParts: '动平衡仪' },
      { step: 3, action: '校正动平衡', estimatedTime: '2h' },
      { step: 4, action: '回装并试运行', estimatedTime: '1h' },
    ],
    estimatedDuration: '5h',
    estimatedCost: '¥2,000',
    requiredSpareParts: [],
    riskLevel: 'low',
  },
];

export function getMockRepairResult(equipmentType: string, faultPhenomenon: string): RepairAiResult {
  return {
    equipmentType,
    faultPhenomenon,
    recommendedPlans: MOCK_REPAIR_PLANS,
    analysisTime: new Date().toISOString(),
  };
}

export const MOCK_STOCK_OUT_PREDICTIONS: StockOutPrediction[] = [
  {
    materialId: 'MTR-SH-1001',
    materialName: '42CrMo合金钢',
    currentStock: 120,
    unit: 'kg',
    dailyConsumption: 15,
    daysUntilOut: 8,
    confidence: 0.92,
  },
  {
    materialId: 'MTR-BE-2003',
    materialName: 'NN3020滚针轴承',
    currentStock: 8,
    unit: '个',
    dailyConsumption: 2,
    daysUntilOut: 4,
    confidence: 0.88,
  },
  {
    materialId: 'MTR-SE-3005',
    materialName: 'O型密封圈',
    currentStock: 45,
    unit: '个',
    dailyConsumption: 3,
    daysUntilOut: 15,
    confidence: 0.75,
  },
];

export const MOCK_REPLENISHMENT_SUGGESTIONS: ReplenishmentSuggestion[] = [
  {
    materialId: 'MTR-SH-1001',
    materialName: '42CrMo合金钢',
    currentStock: 120,
    suggestedQuantity: 500,
    unit: 'kg',
    urgency: 'high',
    reason: '预计8天后断货，供应商平均交期5天，建议立即下单',
    estimatedLeadTime: '5天',
  },
  {
    materialId: 'MTR-BE-2003',
    materialName: 'NN3020滚针轴承',
    currentStock: 8,
    suggestedQuantity: 30,
    unit: '个',
    urgency: 'high',
    reason: '库存极低，消耗加速，可能存在批量需求',
    estimatedLeadTime: '7天',
  },
  {
    materialId: 'MTR-SE-3005',
    materialName: 'O型密封圈',
    currentStock: 45,
    suggestedQuantity: 80,
    unit: '个',
    urgency: 'medium',
    reason: '可与螺栓合并采购，节省物流成本',
    estimatedLeadTime: '3天',
  },
];

export const MOCK_CONSUMPTION_ANOMALIES: ConsumptionAnomaly[] = [
  {
    materialId: 'MTR-BE-2003',
    materialName: 'NN3020滚针轴承',
    anomalyType: '消耗加速',
    description: '近7天日均消耗2个，较上月均值(0.8个/天)增长150%',
    severity: 'warning',
  },
];

export function getMockInventoryResult(): InventoryAiResult {
  return {
    stockOutPredictions: MOCK_STOCK_OUT_PREDICTIONS,
    replenishmentSuggestions: MOCK_REPLENISHMENT_SUGGESTIONS,
    anomalies: MOCK_CONSUMPTION_ANOMALIES,
    analysisTime: new Date().toISOString(),
  };
}

import type { InsightAiResult, InsightItem, TrendPrediction } from '../interfaces/IInsightAiService';

export const MOCK_INSIGHT_ITEMS: InsightItem[] = [
  {
    id: 'ins-001',
    type: 'anomaly',
    severity: 'warning',
    title: '设备故障率环比上升',
    description: '本月设备故障率较上月上升15%，主要集中在热处理车间',
    metric: '故障率',
    value: 0.15,
    change: '+15%',
  },
  {
    id: 'ins-002',
    type: 'anomaly',
    severity: 'critical',
    title: '井式渗碳炉故障频次异常',
    description: '井式渗碳炉本月故障3次，历史月均1.2次，超出正常范围150%',
    metric: '故障频次',
    value: 3,
    change: '+150%',
  },
  {
    id: 'ins-003',
    type: 'suggestion',
    severity: 'info',
    title: '建议增加轴承类备件库存',
    description: '轴承类备件消耗加速，当前库存仅能维持12天',
    metric: '库存天数',
    value: 12,
    change: '-40%',
  },
];

export const MOCK_TREND_PREDICTIONS: TrendPrediction[] = [
  {
    metric: '维修成本',
    currentValue: 52000,
    predictedValue: 61360,
    unit: '元',
    horizon: '下月',
    confidence: 0.78,
  },
  {
    metric: '设备综合效率(OEE)',
    currentValue: 85,
    predictedValue: 88,
    unit: '%',
    horizon: 'Q3',
    confidence: 0.72,
  },
];

export function getMockInsightResult(): InsightAiResult {
  return {
    summary: '本月设备故障率环比上升15%，主要集中在热处理车间；维修成本较上月增加¥12,000（+23%）；井式渗碳炉故障频次异常（3次/月，均值1.2次）',
    insights: MOCK_INSIGHT_ITEMS,
    trendPredictions: MOCK_TREND_PREDICTIONS,
    analysisTime: new Date().toISOString(),
  };
}

import type { SupplierAiResult, SupplierEvaluation } from '../interfaces/ISupplierAiService';

export function getMockSupplierResult(supplierName: string): SupplierAiResult {
  const evaluation: SupplierEvaluation = {
    supplierName,
    qualityScore: 85,
    deliveryScore: 78,
    costScore: 90,
    overallScore: 84,
    grade: 'B',
    strengths: ['产品质量稳定', '价格竞争力强', '技术响应及时'],
    weaknesses: ['交期偶有延迟', '小批量订单响应慢'],
    recommendations: ['建议签订长期协议锁定交期', '建立安全库存应对交期波动'],
  };
  return {
    evaluation,
    analysisTime: new Date().toISOString(),
  };
}
