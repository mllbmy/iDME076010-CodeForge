import { request } from '@/utils/request';

const BC_BASE = '/blockchain';

export function certifyData(data: Record<string, unknown>) {
  return request({ url: `${BC_BASE}/certify`, method: 'post', data });
}

export function verifyData(data: Record<string, unknown>) {
  return request({ url: `${BC_BASE}/verify`, method: 'post', data });
}

export function getTrace(data: Record<string, unknown>) {
  return request({ url: `${BC_BASE}/trace`, method: 'post', data });
}

export function getHistory(data: Record<string, unknown>) {
  return request({ url: `${BC_BASE}/history`, method: 'post', data });
}
