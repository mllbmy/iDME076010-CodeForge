import type { AiResponse } from '../ai/types';

export interface RepairAiParams {
  faultPhenomenon: string;
  equipmentType: string;
  equipmentName?: string;
}

export interface RepairStep {
  step: number;
  action: string;
  estimatedTime: string;
  requiredParts?: string;
}

export interface RepairPlan {
  planId: string;
  possibleCause: string;
  confidence: number;
  repairSteps: RepairStep[];
  estimatedDuration: string;
  estimatedCost: string;
  requiredSpareParts: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RepairAiResult {
  equipmentType: string;
  faultPhenomenon: string;
  recommendedPlans: RepairPlan[];
  analysisTime: string;
}

export interface IRepairAiService {
  recommendRepairPlan(params: RepairAiParams): Promise<AiResponse<RepairAiResult>>;
}
