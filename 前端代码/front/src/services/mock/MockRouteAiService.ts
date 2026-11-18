import type { IRouteAiService, RouteAiParams, RouteAiResult } from '../interfaces/IRouteAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { MOCK_ROUTE_PROCESSES, MOCK_ROUTE_PROCESSES_ALT, MOCK_ROUTE_PROCESSES_DEFAULT, getMockRouteResult } from './aiMockData';

const ROUTE_TEMPLATES: Record<string, { name: string; time: string; equipment: string }[]> = {
  '齿轮': MOCK_ROUTE_PROCESSES,
  '轴': MOCK_ROUTE_PROCESSES_ALT,
};

export class MockRouteAiService implements IRouteAiService {
  async recommendRoute(params: RouteAiParams): Promise<AiResponse<RouteAiResult>> {
    await aiDelay(400, 800);
    let matchedTemplate: { name: string; time: string; equipment: string }[] = [];
    for (const [key, processes] of Object.entries(ROUTE_TEMPLATES)) {
      if (params.partName.includes(key) || params.partType.includes(key)) {
        matchedTemplate = processes;
        break;
      }
    }
    if (matchedTemplate.length === 0) {
      matchedTemplate = MOCK_ROUTE_PROCESSES_DEFAULT;
    }
    const result = getMockRouteResult(params.partName, matchedTemplate);
    return aiMockSuccess(result, 600);
  }
}
