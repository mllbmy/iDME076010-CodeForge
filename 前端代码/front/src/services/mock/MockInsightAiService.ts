import type { IInsightAiService, InsightAiParams, InsightAiResult } from '../interfaces/IInsightAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockInsightResult } from './aiMockData';

export class MockInsightAiService implements IInsightAiService {
  async generateInsights(_params: InsightAiParams): Promise<AiResponse<InsightAiResult>> {
    await aiDelay(400, 800);
    const result = getMockInsightResult();
    return aiMockSuccess(result, 600);
  }
}
