import type { AiResponse } from '../ai/types';

export interface RouteAiParams {
  partName: string;
  partType: string;
  material?: string;
  quantity?: number;
}

export interface RecommendedProcess {
  step: number;
  processName: string;
  processCode: string;
  estimatedTime: string;
  equipment?: string;
  description: string;
}

export interface RouteAiResult {
  partName: string;
  processes: RecommendedProcess[];
  totalEstimatedTime: string;
  confidence: number;
  alternativeRoutes: { name: string; processes: RecommendedProcess[] }[];
}

export interface IRouteAiService {
  recommendRoute(params: RouteAiParams): Promise<AiResponse<RouteAiResult>>;
}
