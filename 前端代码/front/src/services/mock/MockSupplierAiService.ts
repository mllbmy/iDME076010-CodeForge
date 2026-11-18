import type { ISupplierAiService, SupplierAiParams, SupplierAiResult } from '../interfaces/ISupplierAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockSupplierResult } from './aiMockData';

export class MockSupplierAiService implements ISupplierAiService {
  async evaluateSupplier(params: SupplierAiParams): Promise<AiResponse<SupplierAiResult>> {
    await aiDelay(400, 800);
    const result = getMockSupplierResult(params.supplierName);
    return aiMockSuccess(result, 600);
  }
}
