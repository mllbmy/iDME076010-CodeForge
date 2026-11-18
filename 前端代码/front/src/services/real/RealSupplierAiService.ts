import type { ISupplierAiService, SupplierAiParams, SupplierAiResult } from '../interfaces/ISupplierAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toSupplierAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/supplier/evaluate';

export class RealSupplierAiService implements ISupplierAiService {
  async evaluateSupplier(params: SupplierAiParams): Promise<AiResponse<SupplierAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toSupplierAiResult(response.data),
    };
  }
}
