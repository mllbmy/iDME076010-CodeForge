export function aiDelay(min = 300, max = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

export function aiMockSuccess<T>(data: T, latency = 500): { data: T; source: 'mock'; latency: number; timestamp: number } {
  return { data, source: 'mock', latency, timestamp: Date.now() };
}
