import React from 'react';
import { Alert, Spin, Button, Space, Tooltip } from 'antd';
import { RobotOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import type { AiDegradationLevel, AiStatus } from '@/services/ai/types';

interface AiDegradationWrapperProps {
  status: AiStatus;
  loading?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  title?: string;
}

const levelConfig: Record<AiDegradationLevel, { type: 'success' | 'warning' | 'error'; label: string }> = {
  full: { type: 'success', label: 'AI服务正常' },
  partial: { type: 'warning', label: 'AI服务降级' },
  unavailable: { type: 'error', label: 'AI服务不可用' },
};

export const AiStatusOverlay: React.FC<AiDegradationWrapperProps> = ({
  status,
  loading = false,
  onRetry,
  children,
  title = 'AI智能分析',
}) => {
  const { available, degradationLevel, lastError } = status;
  const config = levelConfig[degradationLevel];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" tip="AI分析中..."><div /></Spin>
      </div>
    );
  }

  if (!available) {
    return (
      <Alert
        type={config.type}
        showIcon
        icon={<WarningOutlined />}
        message={`${title} - ${config.label}`}
        description={lastError || 'AI服务暂时不可用，请稍后重试'}
        action={
          onRetry ? (
            <Button size="small" type="primary" onClick={onRetry} icon={<ReloadOutlined />}>
              重试
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div>
      {degradationLevel !== 'full' && (
        <Alert
          type="warning"
          showIcon
          message="AI服务降级运行"
          description="部分AI功能可能受限，结果仅供参考"
          style={{ marginBottom: 12 }}
          closable
        />
      )}
      {children}
    </div>
  );
};

interface AiStatusIndicatorProps {
  status: AiStatus;
  size?: 'small' | 'default';
}

export const AiStatusIndicator: React.FC<AiStatusIndicatorProps> = ({ status, size = 'small' }) => {
  const { available, degradationLevel, lastLatency } = status;
  const color = !available ? 'red' : degradationLevel === 'full' ? 'green' : 'orange';
  const label = !available ? '不可用' : degradationLevel === 'full' ? '正常' : '降级';

  return (
    <Tooltip title={lastLatency ? `延迟: ${lastLatency}ms` : undefined}>
      <Space size={4}>
        <RobotOutlined style={{ color, fontSize: size === 'small' ? 14 : 18 }} />
        <span style={{ color, fontSize: size === 'small' ? 12 : 14 }}>{label}</span>
      </Space>
    </Tooltip>
  );
};
