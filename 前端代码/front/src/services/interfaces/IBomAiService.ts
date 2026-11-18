import type { AiResponse } from '../ai/types';

export interface BomNode {
  id: string;
  partName: string;
  partCode: string;
  quantity: number;
  positionNo?: string;
  parentPositionNo?: string;
  children?: BomNode[];
}

export interface BomValidationError {
  level: 'error' | 'warning' | 'info';
  category: 'parent-child' | 'quantity' | 'position';
  nodeId: string;
  nodeName: string;
  message: string;
  suggestion?: string;
}

export interface BomAiParams {
  bomTree: BomNode[];
  partType?: string;
}

export interface BomAiResult {
  valid: boolean;
  errors: BomValidationError[];
  summary: {
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

export interface IBomAiService {
  validateBom(params: BomAiParams): Promise<AiResponse<BomAiResult>>;
}
