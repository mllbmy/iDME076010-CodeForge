import type { IRepairAiService, RepairAiParams, RepairAiResult } from '../interfaces/IRepairAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toRepairAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/repair/recommend';

export class RealRepairAiService implements IRepairAiService {
  async recommendRepairPlan(params: RepairAiParams): Promise<AiResponse<RepairAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toRepairAiResult(response.data),
    };
  }
}
