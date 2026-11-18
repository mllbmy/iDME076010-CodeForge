import type { ICodeAiService, CodeAiParams, CodeAiResult, CodeType } from '../interfaces/ICodeAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockCodeResult } from './aiMockData';

function generateEquipmentCode(name: string): string {
  const typeMap: Record<string, string> = {
    '滚齿机': 'RG', '磨齿机': 'MG', '车床': 'TC', '铣床': 'MC',
    '加工中心': 'VMC', '测量仪': 'CMM', '磨床': 'GR', '锯床': 'SAW',
  };
  let typeCode = 'EQ';
  for (const [key, code] of Object.entries(typeMap)) {
    if (name.includes(key)) { typeCode = code; break; }
  }
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `MC-${typeCode}-${seq}`;
}

function generateMaterialCode(name: string): string {
  const typeMap: Record<string, string> = {
    '齿轮': 'GR', '轴': 'SH', '轴承': 'BE', '箱体': 'HO',
    '法兰': 'FL', '螺栓': 'BO', '密封': 'SE',
  };
  let typeCode = 'OT';
  for (const [key, code] of Object.entries(typeMap)) {
    if (name.includes(key)) { typeCode = code; break; }
  }
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `MTR-${typeCode}-${seq}`;
}

export class MockCodeAiService implements ICodeAiService {
  async generateCode(params: CodeAiParams): Promise<AiResponse<CodeAiResult>> {
    await aiDelay(200, 500);
    const code = params.type === 'equipment' ? generateEquipmentCode(params.name) : generateMaterialCode(params.name);
    const result = getMockCodeResult(code, params.type as 'equipment' | 'material', params.name);
    return aiMockSuccess(result, 300);
  }

  async validateCode(code: string, type: CodeType): Promise<AiResponse<{ valid: boolean; message?: string }>> {
    await aiDelay(200, 500);
    const prefix = type === 'equipment' ? 'MC-' : 'MTR-';
    const valid = code.startsWith(prefix) && code.length >= 8;
    return aiMockSuccess(
      { valid, message: valid ? undefined : `编码必须以${prefix}开头且长度≥8` },
      100,
    );
  }
}
