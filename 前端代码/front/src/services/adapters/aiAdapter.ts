import type { EquipmentAiResult, MaintenanceSuggestion, FaultPrediction } from '../interfaces/IEquipmentAiService';
import type { CodeAiResult, GeneratedCode } from '../interfaces/ICodeAiService';
import type { RouteAiResult, RecommendedProcess } from '../interfaces/IRouteAiService';
import type { BomAiResult, BomValidationError } from '../interfaces/IBomAiService';
import type { InventoryAiResult, StockOutPrediction, ReplenishmentSuggestion, ConsumptionAnomaly } from '../interfaces/IInventoryAiService';

export function toMaintenanceSuggestion(data: Record<string, unknown>): MaintenanceSuggestion {
  return {
    type: (data.type as MaintenanceSuggestion['type']) || 'routine',
    priority: (data.priority as MaintenanceSuggestion['priority']) || 'medium',
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    suggestedDate: (data.suggestedDate as string) || '',
    estimatedDuration: (data.estimatedDuration as string) || '',
    riskIfSkipped: (data.riskIfSkipped as string) || '',
  };
}

export function toFaultPrediction(data: Record<string, unknown>): FaultPrediction {
  return {
    faultType: (data.faultType as string) || '',
    probability: (data.probability as number) || 0,
    confidence: (data.confidence as number) || 0,
    possibleCause: (data.possibleCause as string) || '',
    suggestedAction: (data.suggestedAction as string) || '',
    timeWindow: (data.timeWindow as string) || '',
  };
}

export function toEquipmentAiResult(data: Record<string, unknown>): EquipmentAiResult {
  return {
    equipmentId: (data.equipmentId as string) || '',
    equipmentName: (data.equipmentName as string) || '',
    maintenanceSuggestions: ((data.maintenanceSuggestions as Record<string, unknown>[]) || []).map(toMaintenanceSuggestion),
    faultPredictions: ((data.faultPredictions as Record<string, unknown>[]) || []).map(toFaultPrediction),
    healthScore: (data.healthScore as number) || 0,
    analysisTime: (data.analysisTime as string) || new Date().toISOString(),
  };
}

export function toGeneratedCode(data: Record<string, unknown>): GeneratedCode {
  return {
    code: (data.code as string) || '',
    type: (data.type as GeneratedCode['type']) || 'equipment',
    name: (data.name as string) || '',
    rule: (data.rule as string) || '',
    segments: ((data.segments as Record<string, unknown>[]) || []).map((s) => ({
      label: (s.label as string) || '',
      value: (s.value as string) || '',
    })),
  };
}

export function toCodeAiResult(data: Record<string, unknown>): CodeAiResult {
  return {
    primaryCode: toGeneratedCode((data.primaryCode as Record<string, unknown>) || {}),
    alternatives: ((data.alternatives as Record<string, unknown>[]) || []).map(toGeneratedCode),
    complianceScore: (data.complianceScore as number) || 0,
    ruleDescription: (data.ruleDescription as string) || '',
  };
}

export function toRecommendedProcess(data: Record<string, unknown>): RecommendedProcess {
  return {
    step: (data.step as number) || 0,
    processName: (data.processName as string) || '',
    processCode: (data.processCode as string) || '',
    estimatedTime: (data.estimatedTime as string) || '',
    equipment: data.equipment as string | undefined,
    description: (data.description as string) || '',
  };
}

export function toRouteAiResult(data: Record<string, unknown>): RouteAiResult {
  return {
    partName: (data.partName as string) || '',
    processes: ((data.processes as Record<string, unknown>[]) || []).map(toRecommendedProcess),
    totalEstimatedTime: (data.totalEstimatedTime as string) || '',
    confidence: (data.confidence as number) || 0,
    alternativeRoutes: ((data.alternativeRoutes as Record<string, unknown>[]) || []).map((r) => ({
      name: (r.name as string) || '',
      processes: ((r.processes as Record<string, unknown>[]) || []).map(toRecommendedProcess),
    })),
  };
}

export function toBomValidationError(data: Record<string, unknown>): BomValidationError {
  return {
    level: (data.level as BomValidationError['level']) || 'info',
    category: (data.category as BomValidationError['category']) || 'quantity',
    nodeId: (data.nodeId as string) || '',
    nodeName: (data.nodeName as string) || '',
    message: (data.message as string) || '',
    suggestion: data.suggestion as string | undefined,
  };
}

export function toBomAiResult(data: Record<string, unknown>): BomAiResult {
  const errors = ((data.errors as Record<string, unknown>[]) || []).map(toBomValidationError);
  const summary = (data.summary as Record<string, unknown>) || {};
  return {
    valid: (data.valid as boolean) ?? errors.filter((e) => e.level === 'error').length === 0,
    errors,
    summary: {
      errorCount: (summary.errorCount as number) ?? errors.filter((e) => e.level === 'error').length,
      warningCount: (summary.warningCount as number) ?? errors.filter((e) => e.level === 'warning').length,
      infoCount: (summary.infoCount as number) ?? errors.filter((e) => e.level === 'info').length,
    },
  };
}

import type { RepairAiResult, RepairPlan, RepairStep } from '../interfaces/IRepairAiService';

export function toRepairStep(data: Record<string, unknown>): RepairStep {
  return {
    step: (data.step as number) || 0,
    action: (data.action as string) || '',
    estimatedTime: (data.estimatedTime as string) || '',
    requiredParts: (data.requiredParts as string) || undefined,
  };
}

export function toRepairPlan(data: Record<string, unknown>): RepairPlan {
  return {
    planId: (data.planId as string) || '',
    possibleCause: (data.possibleCause as string) || '',
    confidence: (data.confidence as number) || 0,
    repairSteps: ((data.repairSteps as Record<string, unknown>[]) || []).map(toRepairStep),
    estimatedDuration: (data.estimatedDuration as string) || '',
    estimatedCost: (data.estimatedCost as string) || '',
    requiredSpareParts: (data.requiredSpareParts as string[]) || [],
    riskLevel: (data.riskLevel as RepairPlan['riskLevel']) || 'medium',
  };
}

export function toRepairAiResult(data: Record<string, unknown>): RepairAiResult {
  return {
    equipmentType: (data.equipmentType as string) || '',
    faultPhenomenon: (data.faultPhenomenon as string) || '',
    recommendedPlans: ((data.recommendedPlans as Record<string, unknown>[]) || []).map(toRepairPlan),
    analysisTime: (data.analysisTime as string) || new Date().toISOString(),
  };
}

export function toStockOutPrediction(data: Record<string, unknown>): StockOutPrediction {
  return {
    materialId: (data.materialId as string) || '',
    materialName: (data.materialName as string) || '',
    currentStock: (data.currentStock as number) || 0,
    unit: (data.unit as string) || '',
    dailyConsumption: (data.dailyConsumption as number) || 0,
    daysUntilOut: (data.daysUntilOut as number) || 0,
    confidence: (data.confidence as number) || 0,
  };
}

export function toReplenishmentSuggestion(data: Record<string, unknown>): ReplenishmentSuggestion {
  return {
    materialId: (data.materialId as string) || '',
    materialName: (data.materialName as string) || '',
    currentStock: (data.currentStock as number) || 0,
    suggestedQuantity: (data.suggestedQuantity as number) || 0,
    unit: (data.unit as string) || '',
    urgency: (data.urgency as ReplenishmentSuggestion['urgency']) || 'medium',
    reason: (data.reason as string) || '',
    estimatedLeadTime: (data.estimatedLeadTime as string) || '',
  };
}

export function toConsumptionAnomaly(data: Record<string, unknown>): ConsumptionAnomaly {
  return {
    materialId: (data.materialId as string) || '',
    materialName: (data.materialName as string) || '',
    anomalyType: (data.anomalyType as string) || '',
    description: (data.description as string) || '',
    severity: (data.severity as ConsumptionAnomaly['severity']) || 'warning',
  };
}

export function toInventoryAiResult(data: Record<string, unknown>): InventoryAiResult {
  return {
    stockOutPredictions: ((data.stockOutPredictions as Record<string, unknown>[]) || []).map(toStockOutPrediction),
    replenishmentSuggestions: ((data.replenishmentSuggestions as Record<string, unknown>[]) || []).map(toReplenishmentSuggestion),
    anomalies: ((data.anomalies as Record<string, unknown>[]) || []).map(toConsumptionAnomaly),
    analysisTime: (data.analysisTime as string) || new Date().toISOString(),
  };
}

import type { InsightAiResult, InsightItem, TrendPrediction } from '../interfaces/IInsightAiService';

export function toInsightItem(data: Record<string, unknown>): InsightItem {
  return {
    id: (data.id as string) || '',
    type: (data.type as InsightItem['type']) || 'suggestion',
    severity: (data.severity as InsightItem['severity']) || 'info',
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    metric: (data.metric as string) || undefined,
    value: (data.value as number) || undefined,
    change: (data.change as string) || undefined,
  };
}

export function toTrendPrediction(data: Record<string, unknown>): TrendPrediction {
  return {
    metric: (data.metric as string) || '',
    currentValue: (data.currentValue as number) || 0,
    predictedValue: (data.predictedValue as number) || 0,
    unit: (data.unit as string) || '',
    horizon: (data.horizon as string) || '',
    confidence: (data.confidence as number) || 0,
  };
}

export function toInsightAiResult(data: Record<string, unknown>): InsightAiResult {
  return {
    summary: (data.summary as string) || '',
    insights: ((data.insights as Record<string, unknown>[]) || []).map(toInsightItem),
    trendPredictions: ((data.trendPredictions as Record<string, unknown>[]) || []).map(toTrendPrediction),
    analysisTime: (data.analysisTime as string) || new Date().toISOString(),
  };
}

import type { SupplierAiResult, SupplierEvaluation } from '../interfaces/ISupplierAiService';

export function toSupplierEvaluation(data: Record<string, unknown>): SupplierEvaluation {
  return {
    supplierName: (data.supplierName as string) || '',
    qualityScore: (data.qualityScore as number) || 0,
    deliveryScore: (data.deliveryScore as number) || 0,
    costScore: (data.costScore as number) || 0,
    overallScore: (data.overallScore as number) || 0,
    grade: (data.grade as SupplierEvaluation['grade']) || 'C',
    strengths: (data.strengths as string[]) || [],
    weaknesses: (data.weaknesses as string[]) || [],
    recommendations: (data.recommendations as string[]) || [],
  };
}

export function toSupplierAiResult(data: Record<string, unknown>): SupplierAiResult {
  return {
    evaluation: toSupplierEvaluation((data.evaluation as Record<string, unknown>) || {}),
    analysisTime: (data.analysisTime as string) || new Date().toISOString(),
  };
}
