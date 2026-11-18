export enum AiDegradedReason {
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  PARAMS_MISSING = 'PARAMS_MISSING',
  DATA_INVALID = 'DATA_INVALID',
  NOT_TRIGGERED = 'NOT_TRIGGERED',
}

export const DEGRADED_MESSAGES: Record<AiDegradedReason, string> = {
  [AiDegradedReason.SERVICE_UNAVAILABLE]: 'AI服务暂不可用，请稍后重试',
  [AiDegradedReason.TIMEOUT]: 'AI分析超时，请稍后重试',
  [AiDegradedReason.PARAMS_MISSING]: '设备参数不完整，请补充设备信息',
  [AiDegradedReason.DATA_INVALID]: 'AI建议数据异常，请忽略',
  [AiDegradedReason.NOT_TRIGGERED]: '设备状态良好，当前无需AI保养建议',
};
