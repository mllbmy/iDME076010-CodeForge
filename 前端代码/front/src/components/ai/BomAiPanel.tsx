import React, { useCallback, useState } from 'react';
import { Card, Button, Alert, Table, Tag, Space, Typography, Statistic, Row, Col } from 'antd';
import { RobotOutlined, CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { AiBomSkipConfirm } from './AiBomSkipConfirm';
import { useAiStore } from '@/store/useAiStore';
import type { BomAiParams, BomValidationError } from '@/services/interfaces/IBomAiService';

const { Text } = Typography;

const levelIcon: Record<string, React.ReactNode> = {
  error: <WarningOutlined style={{ color: '#ff4d4f' }} />,
  warning: <WarningOutlined style={{ color: '#faad14' }} />,
  info: <InfoCircleOutlined style={{ color: '#1677ff' }} />,
};

const levelColor: Record<string, string> = { error: 'red', warning: 'orange', info: 'blue' };
const categoryLabel: Record<string, string> = { 'parent-child': '父子关系', quantity: '数量', position: '位号' };

interface BomAiPanelProps {
  bomTree: BomAiParams['bomTree'];
  partType?: string;
  onLocateNode?: (nodeId: string) => void;
}

export const AiBomValidator: React.FC<BomAiPanelProps> = ({ bomTree, partType, onLocateNode }) => {
  const { bomResult, aiStatus, loading, validateBom } = useAiStore();
  const status = aiStatus.bom;
  const isLoading = loading.bom;
  const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);

  const handleValidate = useCallback(() => {
    validateBom({ bomTree, partType });
  }, [bomTree, partType, validateBom]);

  const hasError = bomResult ? bomResult.summary.errorCount > 0 : false;
  const hasWarning = bomResult ? bomResult.summary.warningCount > 0 : false;
  const isValid = bomResult ? bomResult.valid && bomResult.summary.errorCount === 0 : false;

  const columns = [
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      render: (level: string) => <Tag color={levelColor[level]} icon={levelIcon[level]}>{level.toUpperCase()}</Tag>,
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 100,
      render: (category: string) => categoryLabel[category] || category,
    },
    {
      title: '节点',
      dataIndex: 'nodeName',
      width: 120,
    },
    {
      title: '问题',
      dataIndex: 'message',
    },
    {
      title: '建议',
      dataIndex: 'suggestion',
      render: (suggestion?: string) => suggestion ? <Text type="success">{suggestion}</Text> : '-',
    },
  ];

  return (
    <Card
      title={<Space><RobotOutlined />AI BOM校验</Space>}
      extra={<Space><AiStatusIndicator status={status} /><Button type="primary" size="small" icon={<RobotOutlined />} onClick={handleValidate} loading={isLoading}>校验</Button></Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <AiErrorBoundary>
        <AiStatusOverlay status={status} loading={isLoading} onRetry={handleValidate}>
          {bomResult && (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="错误" value={bomResult.summary.errorCount} valueStyle={{ color: '#ff4d4f' }} prefix={<WarningOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="警告" value={bomResult.summary.warningCount} valueStyle={{ color: '#faad14' }} prefix={<WarningOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="提示" value={bomResult.summary.infoCount} valueStyle={{ color: '#1677ff' }} prefix={<InfoCircleOutlined />} />
                </Col>
              </Row>

              {bomResult.errors.length > 0 && (
                <Table<BomValidationError>
                  dataSource={bomResult.errors}
                  columns={columns}
                  rowKey="nodeId"
                  size="small"
                  pagination={false}
                  scroll={{ y: 240 }}
                  onRow={(record) => ({
                    onClick: () => {
                      if (onLocateNode && record.level === 'error') {
                        onLocateNode(record.nodeId);
                      }
                    },
                    style: record.level === 'error' ? { cursor: 'pointer' } : {},
                  })}
                />
              )}

              {hasError && (
                <Alert type="error" showIcon message="存在错误项，请修正后提交" />
              )}

              {!hasError && hasWarning && (
                <Space>
                  <Alert type="warning" showIcon message="存在警告项" style={{ flex: 1 }} />
                  <Button type="primary" onClick={() => setSkipConfirmOpen(true)}>忽略警告继续提交</Button>
                </Space>
              )}

              {isValid && (
                <Alert
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                  message="校验通过，可安全提交"
                />
              )}
            </Space>
          )}
        </AiStatusOverlay>
      </AiErrorBoundary>

      <AiBomSkipConfirm
        open={skipConfirmOpen}
        warningCount={bomResult?.summary.warningCount || 0}
        onConfirm={() => setSkipConfirmOpen(false)}
        onCancel={() => setSkipConfirmOpen(false)}
      />
    </Card>
  );
};
