import { request } from '@/utils/request';

const AI_BASE = '/ai';

export function analyzeEquipment(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/equipment/analyze`, method: 'post', data });
}

export function batchAnalyzeEquipments(data: { items: Record<string, unknown>[] }) {
  return request({ url: `${AI_BASE}/equipment/batchAnalyze`, method: 'post', data });
}

export function generateCode(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/code/generate`, method: 'post', data });
}

export function validateCode(data: { code: string; type: string }) {
  return request({ url: `${AI_BASE}/code/validate`, method: 'post', data });
}

export function recommendRoute(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/route/recommend`, method: 'post', data });
}

export function validateBom(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/bom/validate`, method: 'post', data });
}

export function analyzeInventory(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/inventory/analyze`, method: 'post', data });
}

export function recommendRepairPlan(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/repair/recommend`, method: 'post', data });
}

export function generateInsights(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/insight/generate`, method: 'post', data });
}

export function evaluateSupplier(data: Record<string, unknown>) {
  return request({ url: `${AI_BASE}/supplier/evaluate`, method: 'post', data });
}
