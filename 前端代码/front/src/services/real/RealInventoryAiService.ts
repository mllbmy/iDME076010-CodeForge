import type { IInventoryAiService, InventoryAiParams, InventoryAiResult } from '../interfaces/IInventoryAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toInventoryAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/inventory/analyze';

export class RealInventoryAiService implements IInventoryAiService {
  async analyzeInventory(params: InventoryAiParams): Promise<AiResponse<InventoryAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toInventoryAiResult(response.data),
    };
  }
}
