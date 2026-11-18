import type { ICodeAiService, CodeAiParams, CodeAiResult } from '../interfaces/ICodeAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toCodeAiResult } from '../adapters/aiAdapter';

const GENERATE_ENDPOINT = '/ai/code/generate';
const VALIDATE_ENDPOINT = '/ai/code/validate';

export class RealCodeAiService implements ICodeAiService {
  async generateCode(params: CodeAiParams): Promise<AiResponse<CodeAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(GENERATE_ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toCodeAiResult(response.data),
    };
  }

  async validateCode(code: string, type: CodeAiParams['type']): Promise<AiResponse<{ valid: boolean; message?: string }>> {
    const response = await aiRequest<{ valid: boolean; message?: string }>(VALIDATE_ENDPOINT, { code, type });
    return response;
  }
}
