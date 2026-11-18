/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE: 'mock' | 'real';
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_MOCK_DELAY: string;
  readonly VITE_MOCK_ERROR_RATE: string;
  readonly VITE_AI_TIMEOUT: string;
  readonly VITE_AI_RETRY_COUNT: string;
  readonly VITE_AI_RETRY_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
