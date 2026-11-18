export const mockConfig = {
  delay: Number(import.meta.env.VITE_MOCK_DELAY) || 300,
  errorRate: Number(import.meta.env.VITE_MOCK_ERROR_RATE) || 0,
};

export async function mockDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, mockConfig.delay));
}

export async function mockMaybeError(): Promise<void> {
  if (mockConfig.errorRate > 0 && Math.random() < mockConfig.errorRate) {
    throw new Error('模拟请求失败');
  }
}
