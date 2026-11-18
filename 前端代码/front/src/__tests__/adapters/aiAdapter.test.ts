import {
  toMaintenanceSuggestion,
  toFaultPrediction,
  toEquipmentAiResult,
  toGeneratedCode,
  toCodeAiResult,
  toRecommendedProcess,
  toRouteAiResult,
  toBomValidationError,
  toBomAiResult,
} from '@/services/adapters/aiAdapter';

describe('aiAdapter', () => {
  describe('toMaintenanceSuggestion', () => {
    it('maps fields defensively', () => {
      const data = {
        type: 'emergency',
        priority: 'high',
        title: '更换滤芯',
        description: '滤芯老化',
        suggestedDate: '2024-06-01',
        estimatedDuration: '2h',
        riskIfSkipped: '设备停机',
      };
      const result = toMaintenanceSuggestion(data);
      expect(result.type).toBe('emergency');
      expect(result.priority).toBe('high');
      expect(result.title).toBe('更换滤芯');
      expect(result.description).toBe('滤芯老化');
      expect(result.suggestedDate).toBe('2024-06-01');
      expect(result.estimatedDuration).toBe('2h');
      expect(result.riskIfSkipped).toBe('设备停机');
    });

    it('returns defaults for empty input', () => {
      const result = toMaintenanceSuggestion({});
      expect(result.type).toBe('routine');
      expect(result.priority).toBe('medium');
      expect(result.title).toBe('');
      expect(result.description).toBe('');
    });
  });

  describe('toFaultPrediction', () => {
    it('maps fields defensively', () => {
      const data = {
        faultType: '轴承磨损',
        probability: 0.8,
        confidence: 0.9,
        possibleCause: '长期超负荷',
        suggestedAction: '更换轴承',
        timeWindow: '30天',
      };
      const result = toFaultPrediction(data);
      expect(result.faultType).toBe('轴承磨损');
      expect(result.probability).toBe(0.8);
      expect(result.confidence).toBe(0.9);
      expect(result.possibleCause).toBe('长期超负荷');
      expect(result.suggestedAction).toBe('更换轴承');
      expect(result.timeWindow).toBe('30天');
    });

    it('returns defaults for empty input', () => {
      const result = toFaultPrediction({});
      expect(result.faultType).toBe('');
      expect(result.probability).toBe(0);
      expect(result.confidence).toBe(0);
    });
  });

  describe('toEquipmentAiResult', () => {
    it('maps nested arrays correctly', () => {
      const data = {
        equipmentId: 'EQ-001',
        equipmentName: '测试设备',
        maintenanceSuggestions: [{ type: 'routine', title: '定期保养' }],
        faultPredictions: [{ faultType: '轴承磨损', probability: 0.5 }],
        healthScore: 85,
        analysisTime: '2024-01-01T00:00:00Z',
      };
      const result = toEquipmentAiResult(data);
      expect(result.equipmentId).toBe('EQ-001');
      expect(result.equipmentName).toBe('测试设备');
      expect(result.maintenanceSuggestions).toHaveLength(1);
      expect(result.maintenanceSuggestions[0].title).toBe('定期保养');
      expect(result.faultPredictions).toHaveLength(1);
      expect(result.faultPredictions[0].faultType).toBe('轴承磨损');
      expect(result.healthScore).toBe(85);
      expect(result.analysisTime).toBe('2024-01-01T00:00:00Z');
    });

    it('returns defaults for empty input', () => {
      const result = toEquipmentAiResult({});
      expect(result.equipmentId).toBe('');
      expect(result.equipmentName).toBe('');
      expect(result.maintenanceSuggestions).toHaveLength(0);
      expect(result.faultPredictions).toHaveLength(0);
      expect(result.healthScore).toBe(0);
    });
  });

  describe('toGeneratedCode', () => {
    it('maps fields defensively', () => {
      const data = {
        code: 'MC-GE-001',
        type: 'equipment',
        name: '齿轮',
        rule: 'MC规则',
        segments: [{ label: '前缀', value: 'MC' }, { label: '编号', value: '001' }],
      };
      const result = toGeneratedCode(data);
      expect(result.code).toBe('MC-GE-001');
      expect(result.type).toBe('equipment');
      expect(result.name).toBe('齿轮');
      expect(result.rule).toBe('MC规则');
      expect(result.segments).toHaveLength(2);
      expect(result.segments[0].label).toBe('前缀');
    });

    it('returns defaults for empty input', () => {
      const result = toGeneratedCode({});
      expect(result.code).toBe('');
      expect(result.type).toBe('equipment');
      expect(result.segments).toHaveLength(0);
    });
  });

  describe('toCodeAiResult', () => {
    it('maps fields defensively', () => {
      const data = {
        primaryCode: { code: 'MC-GE-001', type: 'equipment' },
        alternatives: [{ code: 'MC-GE-002', type: 'equipment' }],
        complianceScore: 0.95,
        ruleDescription: '零件编码规则',
      };
      const result = toCodeAiResult(data);
      expect(result.primaryCode.code).toBe('MC-GE-001');
      expect(result.alternatives).toHaveLength(1);
      expect(result.complianceScore).toBe(0.95);
      expect(result.ruleDescription).toBe('零件编码规则');
    });

    it('returns defaults for empty input', () => {
      const result = toCodeAiResult({});
      expect(result.primaryCode.code).toBe('');
      expect(result.alternatives).toHaveLength(0);
      expect(result.complianceScore).toBe(0);
    });
  });

  describe('toRecommendedProcess', () => {
    it('maps fields defensively', () => {
      const data = {
        step: 1,
        processName: '车削',
        processCode: 'MTR-001',
        estimatedTime: '2h',
        equipment: '车床A',
        description: '粗车外圆',
      };
      const result = toRecommendedProcess(data);
      expect(result.step).toBe(1);
      expect(result.processName).toBe('车削');
      expect(result.processCode).toBe('MTR-001');
      expect(result.estimatedTime).toBe('2h');
      expect(result.equipment).toBe('车床A');
      expect(result.description).toBe('粗车外圆');
    });

    it('returns defaults for empty input', () => {
      const result = toRecommendedProcess({});
      expect(result.step).toBe(0);
      expect(result.processName).toBe('');
      expect(result.equipment).toBeUndefined();
    });
  });

  describe('toRouteAiResult', () => {
    it('maps fields defensively', () => {
      const data = {
        partName: '齿轮',
        processes: [{ step: 1, processName: '车削', processCode: 'MTR-001' }],
        totalEstimatedTime: '8h',
        confidence: 0.88,
        alternativeRoutes: [{ name: '方案B', processes: [] }],
      };
      const result = toRouteAiResult(data);
      expect(result.partName).toBe('齿轮');
      expect(result.processes).toHaveLength(1);
      expect(result.totalEstimatedTime).toBe('8h');
      expect(result.confidence).toBe(0.88);
      expect(result.alternativeRoutes).toHaveLength(1);
    });

    it('returns defaults for empty input', () => {
      const result = toRouteAiResult({});
      expect(result.partName).toBe('');
      expect(result.processes).toHaveLength(0);
      expect(result.confidence).toBe(0);
    });
  });

  describe('toBomValidationError', () => {
    it('maps fields defensively', () => {
      const data = {
        level: 'error',
        category: 'quantity',
        nodeId: 'N1',
        nodeName: '齿轮',
        message: '数量为0',
        suggestion: '修改数量',
      };
      const result = toBomValidationError(data);
      expect(result.level).toBe('error');
      expect(result.category).toBe('quantity');
      expect(result.nodeId).toBe('N1');
      expect(result.nodeName).toBe('齿轮');
      expect(result.message).toBe('数量为0');
      expect(result.suggestion).toBe('修改数量');
    });

    it('returns defaults for empty input', () => {
      const result = toBomValidationError({});
      expect(result.level).toBe('info');
      expect(result.category).toBe('quantity');
      expect(result.nodeId).toBe('');
      expect(result.suggestion).toBeUndefined();
    });
  });

  describe('toBomAiResult', () => {
    it('maps fields defensively', () => {
      const data = {
        valid: true,
        errors: [{ level: 'warning', category: 'structure', nodeId: 'N1', nodeName: 'A', message: '层级过深' }],
        summary: { errorCount: 0, warningCount: 1, infoCount: 0 },
      };
      const result = toBomAiResult(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.summary.errorCount).toBe(0);
      expect(result.summary.warningCount).toBe(1);
    });

    it('returns defaults for empty input', () => {
      const result = toBomAiResult({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.summary.errorCount).toBe(0);
    });

    it('infers valid from error levels when valid not set', () => {
      const data = {
        errors: [{ level: 'error', category: 'quantity', nodeId: 'N1', nodeName: 'A', message: '数量为0' }],
      };
      const result = toBomAiResult(data);
      expect(result.valid).toBe(false);
      expect(result.summary.errorCount).toBe(1);
    });
  });
});
