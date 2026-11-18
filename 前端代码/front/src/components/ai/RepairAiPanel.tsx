import React, { useCallback, useState } from 'react';
import { Card, Input, Button, Collapse, Space, Typography, Tag, List, Descriptions, Alert } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator, AiConfirmLight } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import type { RepairPlan } from '@/services/interfaces/IRepairAiService';

const { Text } = Typography;

const riskColor: Record<string, string> = { high: 'red', medium: 'orange', low: 'green' };
const riskLabel: Record<string, string> = { high: '高风险', medium: '中风险', low: '低风险' };

interface RepairAiPanelProps {
  equipmentType: string;
  equipmentName?: string;
  onAcceptPlan?: (plan: RepairPlan) => void;
}

export const RepairAiPanel: React.FC<RepairAiPanelProps> = ({ equipmentType, equipmentName, onAcceptPlan }) => {
  const { repairResult, aiStatus, loading, recommendRepair } = useAiStore();
  const status = aiStatus.repair;
  const isLoading = loading.repair;

  const [faultPhenomenon, setFaultPhenomenon] = useState('');

  const handleRecommend = useCallback(() => {
    if (!faultPhenomenon.trim()) return;
    recommendRepair({ faultPhenomenon: faultPhenomenon.trim(), equipmentType, equipmentName });
  }, [faultPhenomenon, equipmentType, equipmentName, recommendRepair]);

  return (
    <Card
      title={<Space><RobotOutlined />AI维修方案推荐</Space>}
      extra={<AiStatusIndicator status={status} />}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="描述故障现象（如：主轴振动大，加工精度下降）"
            value={faultPhenomenon}
            onChange={(e) => setFaultPhenomenon(e.target.value)}
            onPressEnter={handleRecommend}
          />
          <Button type="primary" icon={<RobotOutlined />} onClick={handleRecommend} loading={isLoading}>推荐方案</Button>
        </Space.Compact>

        <AiErrorBoundary>
          <AiStatusOverlay status={status} loading={isLoading} onRetry={handleRecommend}>
            {repairResult && (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Alert type="info" message={`已为"${repairResult.faultPhenomenon}"生成${repairResult.recommendedPlans.length}个维修方案`} />

                <Collapse
                  items={repairResult.recommendedPlans.map((plan, i) => ({
                    key: plan.planId,
                    label: (
                      <Space>
                        <Tag color={riskColor[plan.riskLevel]}>{riskLabel[plan.riskLevel]}</Tag>
                        <Text strong>方案{i + 1}: {plan.possibleCause}</Text>
                        <Tag color="blue">置信度 {Math.round(plan.confidence * 100)}%</Tag>
                      </Space>
                    ),
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        <Descriptions column={3} size="small">
                          <Descriptions.Item label="预计耗时">{plan.estimatedDuration}</Descriptions.Item>
                          <Descriptions.Item label="预计费用">{plan.estimatedCost}</Descriptions.Item>
                          <Descriptions.Item label="风险等级"><Tag color={riskColor[plan.riskLevel]}>{riskLabel[plan.riskLevel]}</Tag></Descriptions.Item>
                        </Descriptions>

                        <Card type="inner" title="维修步骤" size="small">
                          <List
                            size="small"
                            dataSource={plan.repairSteps}
                            renderItem={(step) => (
                              <List.Item>
                                <Space>
                                  <Tag>{step.step}</Tag>
                                  <Text>{step.action}</Text>
                                  <Text type="secondary">({step.estimatedTime})</Text>
                                  {step.requiredParts && <Tag color="blue">需: {step.requiredParts}</Tag>}
                                </Space>
                              </List.Item>
                            )}
                          />
                        </Card>

                        {plan.requiredSpareParts.length > 0 && (
                          <div>
                            <Text type="secondary">所需备件: </Text>
                            {plan.requiredSpareParts.map((part, j) => (
                              <Tag key={j} color="orange">{part}</Tag>
                            ))}
                          </div>
                        )}

                        {onAcceptPlan && (
                          <AiConfirmLight
                            suggestion={`采纳方案${i + 1}: ${plan.possibleCause}，预计耗时${plan.estimatedDuration}，费用${plan.estimatedCost}`}
                            confidence={plan.confidence}
                            onAccept={() => onAcceptPlan(plan)}
                            onReject={() => {}}
                          />
                        )}
                      </Space>
                    ),
                  }))}
                />
              </Space>
            )}
          </AiStatusOverlay>
        </AiErrorBoundary>
      </Space>
    </Card>
  );
};
