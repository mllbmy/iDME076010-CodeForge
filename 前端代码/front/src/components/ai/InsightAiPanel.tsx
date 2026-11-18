import React, { useCallback } from 'react';
import { Card, Button, Alert, List, Tag, Space, Typography, Descriptions, Statistic, Row, Col, Select } from 'antd';
import { RobotOutlined, AlertOutlined, RiseOutlined, BulbOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './AiDegradationWrapper';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import type { InsightItem, TrendPrediction } from '@/services/interfaces/IInsightAiService';

const { Text } = Typography;

const typeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  anomaly: { color: 'orange', icon: <AlertOutlined />, label: '异常发现' },
  trend: { color: 'blue', icon: <RiseOutlined />, label: '趋势预测' },
  suggestion: { color: 'green', icon: <BulbOutlined />, label: '行动建议' },
};

const severityColor: Record<string, string> = { critical: 'red', warning: 'orange', info: 'blue' };

interface InsightAiPanelProps {
  module?: string;
}

export const InsightAiPanel: React.FC<InsightAiPanelProps> = ({ module = 'equipment' }) => {
  const { insightResult, aiStatus, loading, generateInsights } = useAiStore();
  const status = aiStatus.insight;
  const isLoading = loading.insight;

  const [period, setPeriod] = React.useState('month');

  const handleGenerate = useCallback(() => {
    generateInsights({ module, period });
  }, [module, period, generateInsights]);

  return (
    <Card
      title={<Space><RobotOutlined />AI数据洞察</Space>}
      extra={
        <Space>
          <Select value={period} onChange={setPeriod} size="small" style={{ width: 100 }} options={[
            { value: 'week', label: '本周' },
            { value: 'month', label: '本月' },
            { value: 'quarter', label: '本季度' },
          ]} />
          <AiStatusIndicator status={status} />
          <Button type="primary" size="small" icon={<RobotOutlined />} onClick={handleGenerate} loading={isLoading}>分析</Button>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <AiErrorBoundary>
        <AiStatusOverlay status={status} loading={isLoading} onRetry={handleGenerate}>
          {insightResult && (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Alert type="info" showIcon message="AI洞察摘要" description={insightResult.summary} />

              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="异常发现" value={insightResult.insights.filter((i: InsightItem) => i.type === 'anomaly').length} valueStyle={{ color: '#faad14' }} prefix={<AlertOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="趋势预测" value={insightResult.trendPredictions.length} valueStyle={{ color: '#1677ff' }} prefix={<RiseOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="行动建议" value={insightResult.insights.filter((i: InsightItem) => i.type === 'suggestion').length} valueStyle={{ color: '#52c41a' }} prefix={<BulbOutlined />} />
                </Col>
              </Row>

              <Card type="inner" title="洞察详情" size="small">
                <List
                  size="small"
                  dataSource={insightResult.insights}
                  renderItem={(item: InsightItem) => {
                    const config = typeConfig[item.type];
                    return (
                      <List.Item>
                        <List.Item.Meta
                          avatar={config.icon}
                          title={<Space><Tag color={config.color}>{config.label}</Tag><Tag color={severityColor[item.severity]}>{item.severity}</Tag>{item.title}</Space>}
                          description={
                            <Space direction="vertical" size={2}>
                              <Text>{item.description}</Text>
                              {item.metric && <Text type="secondary">指标: {item.metric} = {item.value}{item.change && ` (${item.change})`}</Text>}
                            </Space>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Card>

              {insightResult.trendPredictions.length > 0 && (
                <Card type="inner" title="趋势预测" size="small">
                  <List
                    size="small"
                    dataSource={insightResult.trendPredictions}
                    renderItem={(item: TrendPrediction) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Space><RiseOutlined />{item.metric}</Space>}
                          description={
                            <Descriptions column={4} size="small">
                              <Descriptions.Item label="当前值">{item.currentValue}{item.unit}</Descriptions.Item>
                              <Descriptions.Item label="预测值"><Text strong>{item.predictedValue}{item.unit}</Text></Descriptions.Item>
                              <Descriptions.Item label="预测周期">{item.horizon}</Descriptions.Item>
                              <Descriptions.Item label="置信度">{Math.round(item.confidence * 100)}%</Descriptions.Item>
                            </Descriptions>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}
            </Space>
          )}
        </AiStatusOverlay>
      </AiErrorBoundary>
    </Card>
  );
};
