import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { emitUnauthorized } from './authEvent';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRY = 2;
const RETRY_DELAY = 1000;

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ErrorResponseData {
  message?: string;
  [key: string]: unknown;
}

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 200 || data.success) {
        return response;
      }
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    if (
      (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') &&
      config &&
      (!config._retry || config._retry < MAX_RETRY)
    ) {
      config._retry = (config._retry || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * config._retry!));
      return instance(config);
    }

    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          emitUnauthorized();
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error((error.response.data as ErrorResponseData)?.message || '网络错误');
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请稍后重试');
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  },
);

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

export interface RequestOptions<T = unknown> {
  url: string;
  method?: string;
  data?: T;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export const request = async <T = unknown>(options: RequestOptions): Promise<T> => {
  const { url, method = 'POST', data, params, config = {} } = options;
  const response: AxiosResponse<ApiResponse<T>> = await instance({ url, method, data, params, ...config });
  const resData = response.data;
  if (resData && typeof resData === 'object' && 'data' in resData && 'code' in resData) {
    return resData.data;
  }
  return resData as unknown as T;
};

export const get = async <T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await instance.get(url, { params, ...config });
  const resData = response.data;
  if (resData && typeof resData === 'object' && 'data' in resData && 'code' in resData) {
    return resData.data;
  }
  return resData as unknown as T;
};

export const post = async <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await instance.post(url, data, config);
  const resData = response.data;
  if (resData && typeof resData === 'object' && 'data' in resData && 'code' in resData) {
    return resData.data;
  }
  return resData as unknown as T;
};

export const put = async <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await instance.put(url, data, config);
  const resData = response.data;
  if (resData && typeof resData === 'object' && 'data' in resData && 'code' in resData) {
    return resData.data;
  }
  return resData as unknown as T;
};

export const del = async <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await instance.delete(url, { data, ...config });
  const resData = response.data;
  if (resData && typeof resData === 'object' && 'data' in resData && 'code' in resData) {
    return resData.data;
  }
  return resData as unknown as T;
};

export function createAbortController(): AbortController {
  return new AbortController();
}

export default instance;
