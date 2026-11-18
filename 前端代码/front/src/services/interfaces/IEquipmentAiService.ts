import type { AiResponse } from '../ai/types';

export interface EquipmentAiParams {
  equipmentId: string;
  equipmentName: string;
  productionDate: string;
  serverLife: number;
  status: string;
  runtime?: number;
  lastMaintenanceDate?: string;
}

export interface MaintenanceSuggestion {
  type: 'routine' | 'precision' | 'emergency';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestedDate: string;
  estimatedDuration: string;
  riskIfSkipped: string;
}

export interface FaultPrediction {
  faultType: string;
  probability: number;
  confidence: number;
  possibleCause: string;
  suggestedAction: string;
  timeWindow: string;
}

export interface EquipmentAiResult {
  equipmentId: string;
  equipmentName: string;
  maintenanceSuggestions: MaintenanceSuggestion[];
  faultPredictions: FaultPrediction[];
  healthScore: number;
  analysisTime: string;
}

export interface IEquipmentAiService {
  analyzeEquipment(params: EquipmentAiParams): Promise<AiResponse<EquipmentAiResult>>;
  batchAnalyzeEquipments(params: EquipmentAiParams[]): Promise<AiResponse<EquipmentAiResult[]>>;
}
