import React, { useCallback, useEffect } from 'react';
import { Card, Descriptions, Tag, Progress, List, Space, Button, Typography, Alert } from 'antd';
import { RobotOutlined, ToolOutlined, AlertOutlined, HeartOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator, AiConfirmLight } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import { useAlertStore } from '@/store/useAlertStore';
import { DEGRADED_MESSAGES } from '@/services/ai/aiDegraded';
import type { EquipmentAiParams, MaintenanceSuggestion, FaultPrediction } from '@/services/interfaces/IEquipmentAiService';

const { Text } = Typography;

const priorityColor: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };
const typeColor: Record<string, string> = { routine: 'green', precision: 'blue', emergency: 'red' };
const typeLabel: Record<string, string> = { routine: '常规', precision: '精密', emergency: '紧急' };

function checkAndNotify(result: { equipmentId: string; equipmentName: string; maintenanceSuggestions: MaintenanceSuggestion[]; faultPredictions: FaultPrediction[] }) {
  const hasHighPriority = result.maintenanceSuggestions.some((s) => s.priority === 'high');
  const hasHighRisk = result.faultPredictions.some((f) => f.probability > 0.5);

  if (!hasHighPriority && !hasHighRisk) return;

  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `ai-alert-${result.equipmentId}-${today}`;
  if (localStorage.getItem(cacheKey)) return;

  const alertStore = useAlertStore.getState();
  alertStore.addAlertRecord({
    equipmentId: result.equipmentId,
    equipmentName: result.equipmentName,
    metric: 'ai-warning',
    value: hasHighRisk ? 1 : 0,
    threshold: 0.5,
    level: 'alert',
    timestamp: new Date().toISOString(),
    status: 'active',
  });

  localStorage.setItem(cacheKey, '1');
}

interface EquipmentAiPanelProps {
  equipment: EquipmentAiParams;
  onAcceptMaintenance?: (suggestion: MaintenanceSuggestion) => void;
}

export const AiMaintenancePanel: React.FC<EquipmentAiPanelProps> = ({
  equipment,
  onAcceptMaintenance,
}) => {
  const { equipmentResult, aiStatus, loading, analyzeEquipment, degradedReason, missingParams } = useAiStore();
  const status = aiStatus.equipment;
  const isLoading = loading.equipment;

  const handleAnalyze = useCallback(() => {
    analyzeEquipment(equipment);
  }, [analyzeEquipment, equipment]);

  useEffect(() => {
    if (equipment?.equipmentId) {
      analyzeEquipment(equipment).then(() => {
        const result = useAiStore.getState().equipmentResult;
        if (result) {
          checkAndNotify(result);
        }
      });
    }
  }, [equipment?.equipmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderMaintenance = (item: MaintenanceSuggestion, index: number) => (
    <List.Item
      key={index}
      actions={onAcceptMaintenance ? [
        <AiConfirmLight
          key="accept"
          suggestion={`${item.title} - 建议日期: ${item.suggestedDate}，预计耗时: ${item.estimatedDuration}`}
          confidence={0.85}
          onAccept={() => onAcceptMaintenance(item)}
          onReject={() => {}}
        />,
      ] : undefined}
    >
      <List.Item.Meta
        title={<Space><Tag color={typeColor[item.type]}>{typeLabel[item.type]}</Tag><Tag color={priorityColor[item.priority]}>{item.priority}</Tag>{item.title}</Space>}
        description={
          <Space direction="vertical" size={2}>
            <Text>{item.description}</Text>
            <Text type="secondary">建议日期: {item.suggestedDate} | 预计耗时: {item.estimatedDuration}</Text>
            <Text type="warning">跳过风险: {item.riskIfSkipped}</Text>
          </Space>
        }
      />
    </List.Item>
  );

  const renderFault = (item: FaultPrediction, index: number) => (
    <List.Item key={index}>
      <List.Item.Meta
        title={<Space><AlertOutlined style={{ color: '#ff4d4f' }} />{item.faultType}</Space>}
        description={
          <Space direction="vertical" size={2}>
            <Text>概率: <Text strong>{Math.round(item.probability * 100)}%</Text> | 置信度: {Math.round(item.confidence * 100)}%</Text>
            <Text>可能原因: {item.possibleCause}</Text>
            <Text type="success">建议措施: {item.suggestedAction}</Text>
            <Text type="secondary">时间窗口: {item.timeWindow}</Text>
          </Space>
        }
      />
    </List.Item>
  );

  const renderDegradedMessage = () => {
    if (degradedReason === 'PARAMS_MISSING') {
      return (
        <Alert
          type="warning"
          message={`${DEGRADED_MESSAGES.PARAMS_MISSING}，缺失：${missingParams.join('、')}`}
          showIcon
        />
      );
    }
    if (degradedReason === 'NOT_TRIGGERED') {
      return (
        <Alert
          type="info"
          message={DEGRADED_MESSAGES.NOT_TRIGGERED}
          showIcon
        />
      );
    }
    return null;
  };

  return (
    <Card
      title={<Space><RobotOutlined />AI设备分析</Space>}
      extra={<Space><AiStatusIndicator status={status} /><Button type="primary" size="small" icon={<ToolOutlined />} onClick={handleAnalyze} loading={isLoading}>分析</Button></Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <AiErrorBoundary>
        <AiStatusOverlay status={status} loading={isLoading} onRetry={handleAnalyze}>
          {renderDegradedMessage()}
          {equipmentResult && (
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <Descriptions column={3} size="small">
                <Descriptions.Item label="设备">{equipmentResult.equipmentName}</Descriptions.Item>
                <Descriptions.Item label="健康评分">
                  <Progress
                    percent={equipmentResult.healthScore}
                    size="small"
                    status={equipmentResult.healthScore >= 80 ? 'success' : equipmentResult.healthScore >= 60 ? 'normal' : 'exception'}
                    format={(p) => <span><HeartOutlined /> {p}</span>}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="分析时间">{new Date(equipmentResult.analysisTime).toLocaleString()}</Descriptions.Item>
              </Descriptions>
              {equipmentResult.maintenanceSuggestions.length > 0 && (
                <Card type="inner" title="保养建议" size="small">
                  <List size="small" dataSource={equipmentResult.maintenanceSuggestions} renderItem={renderMaintenance} />
                </Card>
              )}
              {equipmentResult.faultPredictions.length > 0 && (
                <Card type="inner" title="故障预测" size="small">
                  <List size="small" dataSource={equipmentResult.faultPredictions} renderItem={renderFault} />
                </Card>
              )}
            </Space>
          )}
        </AiStatusOverlay>
      </AiErrorBoundary>
    </Card>
  );
};
