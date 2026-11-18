import type { IBomAiService, BomAiParams, BomAiResult, BomValidationError } from '../interfaces/IBomAiService';
import type { AiResponse } from '../ai/types';
import { aiDelay, aiMockSuccess } from './aiMockUtils';
import { getMockBomResult } from './aiMockData';

function validateBomTree(nodes: BomAiParams['bomTree']): BomValidationError[] {
  const errors: BomValidationError[] = [];
  const allPositionNos = new Set<string>();

  function traverse(node: BomAiParams['bomTree'][0], parentPositionNo?: string) {
    if (node.positionNo) {
      if (allPositionNos.has(node.positionNo)) {
        errors.push({
          level: 'error',
          category: 'position',
          nodeId: node.id,
          nodeName: node.partName,
          message: `位号 ${node.positionNo} 重复`,
          suggestion: '请检查位号分配，确保唯一',
        });
      }
      allPositionNos.add(node.positionNo);
    }

    if (parentPositionNo && node.positionNo) {
      const parentPrefix = parentPositionNo.split('.')[0];
      const childPrefix = node.positionNo.split('.')[0];
      if (parentPrefix === childPrefix && node.positionNo.length <= parentPositionNo.length) {
        errors.push({
          level: 'warning',
          category: 'parent-child',
          nodeId: node.id,
          nodeName: node.partName,
          message: `子件位号 ${node.positionNo} 与父件 ${parentPositionNo} 关系可能不合理`,
          suggestion: '检查父子件位号层级关系',
        });
      }
    }

    if (node.quantity <= 0) {
      errors.push({
        level: 'error',
        category: 'quantity',
        nodeId: node.id,
        nodeName: node.partName,
        message: '数量必须大于0',
        suggestion: '请修正数量',
      });
    }

    if (node.quantity > 100) {
      errors.push({
        level: 'warning',
        category: 'quantity',
        nodeId: node.id,
        nodeName: node.partName,
        message: `数量 ${node.quantity} 异常偏大`,
        suggestion: '请确认数量是否正确',
      });
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child, node.positionNo);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }
  return errors;
}

export class MockBomAiService implements IBomAiService {
  async validateBom(params: BomAiParams): Promise<AiResponse<BomAiResult>> {
    await aiDelay(300, 700);
    const errors = validateBomTree(params.bomTree);
    const result = getMockBomResult(errors);
    return aiMockSuccess(result, 500);
  }
}
