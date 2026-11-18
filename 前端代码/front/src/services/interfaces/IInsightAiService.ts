import type { AiResponse } from '../ai/types';

export interface InsightAiParams {
  module: string;
  period: string;
}

export interface InsightItem {
  id: string;
  type: 'anomaly' | 'trend' | 'suggestion';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metric?: string;
  value?: number;
  change?: string;
}

export interface TrendPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  unit: string;
  horizon: string;
  confidence: number;
}

export interface InsightAiResult {
  summary: string;
  insights: InsightItem[];
  trendPredictions: TrendPrediction[];
  analysisTime: string;
}

export interface IInsightAiService {
  generateInsights(params: InsightAiParams): Promise<AiResponse<InsightAiResult>>;
}
