export interface AiRequestConfig {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

export interface AiResponse<T> {
  data: T;
  source: 'ai' | 'mock' | 'cache';
  latency: number;
  timestamp: number;
}

export enum AiDegradationLevel {
  FULL = 'full',
  PARTIAL = 'partial',
  UNAVAILABLE = 'unavailable',
}

export interface AiStatus {
  available: boolean;
  degradationLevel: AiDegradationLevel;
  lastError?: string;
  lastLatency?: number;
}

export const AI_DEFAULT_CONFIG: Required<AiRequestConfig> = {
  timeout: Number(import.meta.env.VITE_AI_TIMEOUT) || 10000,
  retryCount: Number(import.meta.env.VITE_AI_RETRY_COUNT) || 2,
  retryDelay: Number(import.meta.env.VITE_AI_RETRY_INTERVAL) || 1000,
  signal: undefined as unknown as AbortSignal,
};

export type MaintenancePredictRequest = import('@/services/interfaces/IEquipmentAiService').EquipmentAiParams;
export type MaintenancePredictResult = import('@/services/interfaces/IEquipmentAiService').EquipmentAiResult;
export type CodeGenerateRequest = import('@/services/interfaces/ICodeAiService').CodeAiParams;
export type CodeGenerateResult = import('@/services/interfaces/ICodeAiService').CodeAiResult;
export type RouteRecommendRequest = import('@/services/interfaces/IRouteAiService').RouteAiParams;
export type RouteRecommendResult = import('@/services/interfaces/IRouteAiService').RouteAiResult;
export type BomValidateRequest = import('@/services/interfaces/IBomAiService').BomAiParams;
export type BomValidateResult = import('@/services/interfaces/IBomAiService').BomAiResult;
export type RepairRecommendRequest = import('@/services/interfaces/IRepairAiService').RepairAiParams;
export type RepairRecommendResult = import('@/services/interfaces/IRepairAiService').RepairAiResult;
export type InventoryAnalyzeRequest = import('@/services/interfaces/IInventoryAiService').InventoryAiParams;
export type InventoryAnalyzeResult = import('@/services/interfaces/IInventoryAiService').InventoryAiResult;
export type InsightGenerateRequest = import('@/services/interfaces/IInsightAiService').InsightAiParams;
export type InsightGenerateResult = import('@/services/interfaces/IInsightAiService').InsightAiResult;
export type SupplierEvaluateRequest = import('@/services/interfaces/ISupplierAiService').SupplierAiParams;
export type SupplierEvaluateResult = import('@/services/interfaces/ISupplierAiService').SupplierAiResult;
