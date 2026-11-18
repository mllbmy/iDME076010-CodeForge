import type { AiResponse } from '../ai/types';

export interface SupplierAiParams {
  supplierName: string;
}

export interface SupplierEvaluation {
  supplierName: string;
  qualityScore: number;
  deliveryScore: number;
  costScore: number;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface SupplierAiResult {
  evaluation: SupplierEvaluation;
  analysisTime: string;
}

export interface ISupplierAiService {
  evaluateSupplier(params: SupplierAiParams): Promise<AiResponse<SupplierAiResult>>;
}
