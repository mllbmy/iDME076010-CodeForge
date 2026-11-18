import type { IEquipmentAiService, EquipmentAiParams, EquipmentAiResult } from '../interfaces/IEquipmentAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockEquipmentResult } from './aiMockData';

export class MockEquipmentAiService implements IEquipmentAiService {
  async analyzeEquipment(params: EquipmentAiParams): Promise<AiResponse<EquipmentAiResult>> {
    await aiDelay(300, 800);
    const result = getMockEquipmentResult(params.equipmentId, params.equipmentName);
    return aiMockSuccess(result, 500);
  }

  async batchAnalyzeEquipments(params: EquipmentAiParams[]): Promise<AiResponse<EquipmentAiResult[]>> {
    await aiDelay(300, 800);
    const results = await Promise.all(params.map((p) => this.analyzeEquipment(p)));
    return aiMockSuccess(results.map((r) => r.data), 800);
  }
}
