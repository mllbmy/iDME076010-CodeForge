import React, { useCallback, useState } from 'react';
import { Card, Input, Button, Progress, Descriptions, Tag, Space, Typography, List } from 'antd';
import { RobotOutlined, CheckCircleOutlined, WarningOutlined, BulbOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import type { SupplierAiResult } from '@/services/interfaces/ISupplierAiService';

const { Text } = Typography;

const gradeColor: Record<string, string> = { A: 'green', B: 'blue', C: 'orange', D: 'red' };

interface SupplierAiPanelProps {
  onAcceptEvaluation?: (evaluation: SupplierAiResult['evaluation']) => void;
}

export const SupplierAiPanel: React.FC<SupplierAiPanelProps> = ({ onAcceptEvaluation: _onAcceptEvaluation }) => {
  const { supplierResult, aiStatus, loading, evaluateSupplier } = useAiStore();
  const status = aiStatus.supplier;
  const isLoading = loading.supplier;

  const [supplierName, setSupplierName] = useState('');

  const handleEvaluate = useCallback(() => {
    if (!supplierName.trim()) return;
    evaluateSupplier({ supplierName: supplierName.trim() });
  }, [supplierName, evaluateSupplier]);

  return (
    <Card
      title={<Space><RobotOutlined />AI供应商评估</Space>}
      extra={<AiStatusIndicator status={status} />}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="输入供应商名称"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            onPressEnter={handleEvaluate}
          />
          <Button type="primary" icon={<RobotOutlined />} onClick={handleEvaluate} loading={isLoading}>评估</Button>
        </Space.Compact>

        <AiErrorBoundary>
          <AiStatusOverlay status={status} loading={isLoading} onRetry={handleEvaluate}>
            {supplierResult && (() => {
              const eval_ = supplierResult.evaluation;
              return (
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="供应商">{eval_.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="综合评级"><Tag color={gradeColor[eval_.grade]} style={{ fontSize: 16 }}>{eval_.grade}</Tag></Descriptions.Item>
                  </Descriptions>

                  <Space direction="vertical" style={{ width: '100%' }} size={8}>
                    <div><Text type="secondary">质量评分</Text><Progress percent={eval_.qualityScore} size="small" status={eval_.qualityScore >= 80 ? 'success' : 'normal'} /></div>
                    <div><Text type="secondary">交期评分</Text><Progress percent={eval_.deliveryScore} size="small" status={eval_.deliveryScore >= 80 ? 'success' : 'normal'} /></div>
                    <div><Text type="secondary">成本评分</Text><Progress percent={eval_.costScore} size="small" status={eval_.costScore >= 80 ? 'success' : 'normal'} /></div>
                    <div><Text strong>综合评分</Text><Progress percent={eval_.overallScore} size="small" status={eval_.overallScore >= 80 ? 'success' : 'exception'} /></div>
                  </Space>

                  {eval_.strengths.length > 0 && (
                    <Card type="inner" title={<Space><CheckCircleOutlined style={{ color: '#52c41a' }} />优势</Space>} size="small">
                      <List size="small" dataSource={eval_.strengths} renderItem={(item: string) => <List.Item><Text>{item}</Text></List.Item>} />
                    </Card>
                  )}

                  {eval_.weaknesses.length > 0 && (
                    <Card type="inner" title={<Space><WarningOutlined style={{ color: '#faad14' }} />不足</Space>} size="small">
                      <List size="small" dataSource={eval_.weaknesses} renderItem={(item: string) => <List.Item><Text>{item}</Text></List.Item>} />
                    </Card>
                  )}

                  {eval_.recommendations.length > 0 && (
                    <Card type="inner" title={<Space><BulbOutlined style={{ color: '#1677ff' }} />建议</Space>} size="small">
                      <List size="small" dataSource={eval_.recommendations} renderItem={(item: string) => <List.Item><Text type="success">{item}</Text></List.Item>} />
                    </Card>
                  )}
                </Space>
              );
            })()}
          </AiStatusOverlay>
        </AiErrorBoundary>
      </Space>
    </Card>
  );
};
