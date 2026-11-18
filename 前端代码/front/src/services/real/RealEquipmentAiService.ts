import type { IEquipmentAiService, EquipmentAiParams, EquipmentAiResult } from '../interfaces/IEquipmentAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toEquipmentAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/equipment/analyze';
const BATCH_ENDPOINT = '/ai/equipment/batchAnalyze';

export class RealEquipmentAiService implements IEquipmentAiService {
  async analyzeEquipment(params: EquipmentAiParams): Promise<AiResponse<EquipmentAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toEquipmentAiResult(response.data),
    };
  }

  async batchAnalyzeEquipments(params: EquipmentAiParams[]): Promise<AiResponse<EquipmentAiResult[]>> {
    const response = await aiRequest<{ list: Record<string, unknown>[] }>(
      BATCH_ENDPOINT,
      { items: params },
    );
    return {
      ...response,
      data: (response.data.list || []).map(toEquipmentAiResult),
    };
  }
}
