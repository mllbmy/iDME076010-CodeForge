import type { IInventoryAiService, InventoryAiParams, InventoryAiResult } from '../interfaces/IInventoryAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockInventoryResult } from './aiMockData';

export class MockInventoryAiService implements IInventoryAiService {
  async analyzeInventory(_params: InventoryAiParams): Promise<AiResponse<InventoryAiResult>> {
    await aiDelay(400, 800);
    const result = getMockInventoryResult();
    return aiMockSuccess(result, 600);
  }
}
