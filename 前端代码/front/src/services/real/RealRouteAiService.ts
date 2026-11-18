import type { IRouteAiService, RouteAiParams, RouteAiResult } from '../interfaces/IRouteAiService';
import type { AiResponse } from '../ai/types';
import { aiRequest } from '../ai/aiClient';
import { toRouteAiResult } from '../adapters/aiAdapter';

const ENDPOINT = '/ai/route/recommend';

export class RealRouteAiService implements IRouteAiService {
  async recommendRoute(params: RouteAiParams): Promise<AiResponse<RouteAiResult>> {
    const response = await aiRequest<Record<string, unknown>>(ENDPOINT, params as unknown as Record<string, unknown>);
    return {
      ...response,
      data: toRouteAiResult(response.data),
    };
  }
}
