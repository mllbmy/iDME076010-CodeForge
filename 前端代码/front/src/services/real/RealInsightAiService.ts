import type { IInsightAiService, InsightAiParams, InsightAiResult } from '../interfaces/IInsightAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toInsightAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/insight/generate';

export class RealInsightAiService implements IInsightAiService {
  async generateInsights(params: InsightAiParams): Promise<AiResponse<InsightAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toInsightAiResult(response.data),
    };
  }
}
