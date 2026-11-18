import type { IBomAiService, BomAiParams, BomAiResult } from '../interfaces/IBomAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toBomAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/bom/validate';

export class RealBomAiService implements IBomAiService {
  async validateBom(params: BomAiParams): Promise<AiResponse<BomAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, { bomTree: params.bomTree, partType: params.partType });
    return {
      ...response,
      data: toBomAiResult(response.data),
    };
  }
}
