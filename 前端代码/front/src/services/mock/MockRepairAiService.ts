import type { IRepairAiService, RepairAiParams, RepairAiResult } from '../interfaces/IRepairAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockRepairResult } from './aiMockData';

export class MockRepairAiService implements IRepairAiService {
  async recommendRepairPlan(params: RepairAiParams): Promise<AiResponse<RepairAiResult>> {
    await aiDelay(400, 800);
    const result = getMockRepairResult(params.equipmentType, params.faultPhenomenon);
    return aiMockSuccess(result, 600);
  }
}
