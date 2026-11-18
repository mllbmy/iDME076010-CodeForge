import { post } from '@/utils/request';
import { AI_DEFAULT_CONFIG } from './types';
import type { AiRequestConfig, AiResponse } from './types';

export async function aiRequest<T>(
  endpoint: string,
  payload: Record<string, unknown>,
  config: AiRequestConfig = {},
): Promise<AiResponse<T>> {
  const { timeout, retryCount, retryDelay, signal } = { ...AI_DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    if (signal?.aborted) {
      throw new DOMException('Request was aborted', 'AbortError');
    }

    try {
      const result = await post<T>(endpoint, payload, {
        timeout,
        signal,
      });

      return {
        data: result,
        source: 'ai',
        latency: Date.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      lastError = error as Error;
      if (attempt < retryCount) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export function isAiAvailable(): boolean {
  const mode = import.meta.env.VITE_API_MODE;
  return mode === 'real';
}
