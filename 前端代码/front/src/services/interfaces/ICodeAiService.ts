import type { AiResponse } from '../ai/types';

export type CodeType = 'equipment' | 'material' | 'process';

export interface CodeAiParams {
  name: string;
  type: CodeType;
  category?: string;
  department?: string;
}

export interface GeneratedCode {
  code: string;
  type: CodeType;
  name: string;
  rule: string;
  segments: { label: string; value: string }[];
}

export interface CodeAiResult {
  primaryCode: GeneratedCode;
  alternatives: GeneratedCode[];
  complianceScore: number;
  ruleDescription: string;
}

export interface ICodeAiService {
  generateCode(params: CodeAiParams): Promise<AiResponse<CodeAiResult>>;
  validateCode(code: string, type: CodeType): Promise<AiResponse<{ valid: boolean; message?: string }>>;
}
