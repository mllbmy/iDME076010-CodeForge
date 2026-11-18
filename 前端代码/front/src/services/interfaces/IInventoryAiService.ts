import type { AiResponse } from '../ai/types';

export interface InventoryAiParams {
  category?: string;
  days?: number;
}

export interface StockOutPrediction {
  materialId: string;
  materialName: string;
  currentStock: number;
  unit: string;
  dailyConsumption: number;
  daysUntilOut: number;
  confidence: number;
}

export interface ReplenishmentSuggestion {
  materialId: string;
  materialName: string;
  currentStock: number;
  suggestedQuantity: number;
  unit: string;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  estimatedLeadTime: string;
}

export interface ConsumptionAnomaly {
  materialId: string;
  materialName: string;
  anomalyType: string;
  description: string;
  severity: 'warning' | 'critical';
}

export interface InventoryAiResult {
  stockOutPredictions: StockOutPrediction[];
  replenishmentSuggestions: ReplenishmentSuggestion[];
  anomalies: ConsumptionAnomaly[];
  analysisTime: string;
}

export interface IInventoryAiService {
  analyzeInventory(params: InventoryAiParams): Promise<AiResponse<InventoryAiResult>>;
}
