import React, { useCallback } from 'react';
import { Card, Button, Table, Tag, Space, Typography, Statistic, Row, Col } from 'antd';
import { RobotOutlined, WarningOutlined, ShoppingCartOutlined, AlertOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import type { StockOutPrediction, ReplenishmentSuggestion, ConsumptionAnomaly } from '@/services/interfaces/IInventoryAiService';

const { Text } = Typography;

const urgencyColor: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };
const severityColor: Record<string, string> = { critical: 'red', warning: 'orange' };

interface InventoryAiPanelProps {
  category?: string;
}

export const InventoryAiPanel: React.FC<InventoryAiPanelProps> = ({ category }) => {
  const { inventoryResult, aiStatus, loading, analyzeInventory } = useAiStore();
  const status = aiStatus.inventory;
  const isLoading = loading.inventory;

  const handleAnalyze = useCallback(() => {
    analyzeInventory({ category, days: 30 });
  }, [category, analyzeInventory]);

  const stockOutColumns = [
    { title: '物料名称', dataIndex: 'materialName', width: 140 },
    { title: '当前库存', dataIndex: 'currentStock', width: 100, render: (v: number, r: StockOutPrediction) => `${v} ${r.unit}` },
    { title: '日消耗', dataIndex: 'dailyConsumption', width: 90, render: (v: number, r: StockOutPrediction) => `${v} ${r.unit}/天` },
    {
      title: '预计断货', dataIndex: 'daysUntilOut', width: 100,
      render: (v: number) => <Tag color={v <= 7 ? 'red' : v <= 14 ? 'orange' : 'green'}>{v}天后</Tag>,
    },
    {
      title: '置信度', dataIndex: 'confidence', width: 80,
      render: (v: number) => `${Math.round(v * 100)}%`,
    },
  ];

  const replenishColumns = [
    { title: '物料名称', dataIndex: 'materialName', width: 140 },
    { title: '当前库存', dataIndex: 'currentStock', width: 90 },
    {
      title: '建议补货', dataIndex: 'suggestedQuantity', width: 100,
      render: (v: number, r: ReplenishmentSuggestion) => <Text strong>{v} {r.unit}</Text>,
    },
    {
      title: '紧急度', dataIndex: 'urgency', width: 80,
      render: (v: string) => <Tag color={urgencyColor[v]}>{v === 'high' ? '紧急' : v === 'medium' ? '一般' : '低'}</Tag>,
    },
    { title: '原因', dataIndex: 'reason' },
    { title: '交期', dataIndex: 'estimatedLeadTime', width: 80 },
  ];

  const anomalyColumns = [
    { title: '物料名称', dataIndex: 'materialName', width: 140 },
    { title: '异常类型', dataIndex: 'anomalyType', width: 100 },
    { title: '描述', dataIndex: 'description' },
    {
      title: '严重度', dataIndex: 'severity', width: 80,
      render: (v: string) => <Tag color={severityColor[v]}>{v === 'critical' ? '严重' : '警告'}</Tag>,
    },
  ];

  return (
    <Card
      title={<Space><RobotOutlined />AI库存智能分析</Space>}
      extra={<Space><AiStatusIndicator status={status} /><Button type="primary" size="small" icon={<RobotOutlined />} onClick={handleAnalyze} loading={isLoading}>分析</Button></Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <AiErrorBoundary>
        <AiStatusOverlay status={status} loading={isLoading} onRetry={handleAnalyze}>
          {inventoryResult && (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="断货风险" value={inventoryResult.stockOutPredictions.length} prefix={<WarningOutlined />} valueStyle={{ color: inventoryResult.stockOutPredictions.length > 0 ? '#ff4d4f' : '#52c41a' }} />
                </Col>
                <Col span={8}>
                  <Statistic title="补货建议" value={inventoryResult.replenishmentSuggestions.length} prefix={<ShoppingCartOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="消耗异常" value={inventoryResult.anomalies.length} prefix={<AlertOutlined />} valueStyle={{ color: inventoryResult.anomalies.length > 0 ? '#faad14' : '#52c41a' }} />
                </Col>
              </Row>

              {inventoryResult.stockOutPredictions.length > 0 && (
                <Card type="inner" title="断货预测" size="small">
                  <Table<StockOutPrediction> dataSource={inventoryResult.stockOutPredictions} columns={stockOutColumns} rowKey="materialId" size="small" pagination={false} />
                </Card>
              )}

              {inventoryResult.replenishmentSuggestions.length > 0 && (
                <Card type="inner" title="补货建议" size="small">
                  <Table<ReplenishmentSuggestion> dataSource={inventoryResult.replenishmentSuggestions} columns={replenishColumns} rowKey="materialId" size="small" pagination={false} />
                </Card>
              )}

              {inventoryResult.anomalies.length > 0 && (
                <Card type="inner" title="消耗异常" size="small">
                  <Table<ConsumptionAnomaly> dataSource={inventoryResult.anomalies} columns={anomalyColumns} rowKey="materialId" size="small" pagination={false} />
                </Card>
              )}
            </Space>
          )}
        </AiStatusOverlay>
      </AiErrorBoundary>
    </Card>
  );
};
