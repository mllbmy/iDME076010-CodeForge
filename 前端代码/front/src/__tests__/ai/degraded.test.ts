import { AiDegradedReason, DEGRADED_MESSAGES } from '@/services/ai/aiDegraded';

describe('AiDegradedReason enum', () => {
  it('has 5 degradation reason values', () => {
    const reasons = Object.values(AiDegradedReason);
    expect(reasons).toHaveLength(5);
  });

  it('contains SERVICE_UNAVAILABLE', () => {
    expect(AiDegradedReason.SERVICE_UNAVAILABLE).toBe('SERVICE_UNAVAILABLE');
  });

  it('contains TIMEOUT', () => {
    expect(AiDegradedReason.TIMEOUT).toBe('TIMEOUT');
  });

  it('contains PARAMS_MISSING', () => {
    expect(AiDegradedReason.PARAMS_MISSING).toBe('PARAMS_MISSING');
  });

  it('contains DATA_INVALID', () => {
    expect(AiDegradedReason.DATA_INVALID).toBe('DATA_INVALID');
  });

  it('contains NOT_TRIGGERED', () => {
    expect(AiDegradedReason.NOT_TRIGGERED).toBe('NOT_TRIGGERED');
  });
});

describe('DEGRADED_MESSAGES', () => {
  it('has 5 Chinese message entries', () => {
    const messages = Object.values(DEGRADED_MESSAGES);
    expect(messages).toHaveLength(5);
  });

  it('contains correct message for SERVICE_UNAVAILABLE', () => {
    expect(DEGRADED_MESSAGES[AiDegradedReason.SERVICE_UNAVAILABLE]).toBe('AI服务暂不可用，请稍后重试');
  });

  it('contains correct message for TIMEOUT', () => {
    expect(DEGRADED_MESSAGES[AiDegradedReason.TIMEOUT]).toBe('AI分析超时，请稍后重试');
  });

  it('contains correct message for PARAMS_MISSING', () => {
    expect(DEGRADED_MESSAGES[AiDegradedReason.PARAMS_MISSING]).toBe('设备参数不完整，请补充设备信息');
  });

  it('contains correct message for DATA_INVALID', () => {
    expect(DEGRADED_MESSAGES[AiDegradedReason.DATA_INVALID]).toBe('AI建议数据异常，请忽略');
  });

  it('contains correct message for NOT_TRIGGERED', () => {
    expect(DEGRADED_MESSAGES[AiDegradedReason.NOT_TRIGGERED]).toBe('设备状态良好，当前无需AI保养建议');
  });
});
