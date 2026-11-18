import React from 'react';
import { Tag, Tooltip, Space } from 'antd';
import { LinkOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { CertifyStatus } from '@/services/interfaces/IBlockchainService';

const statusConfig: Record<CertifyStatus, { color: string; icon: React.ReactNode; text: string }> = {
  confirmed: { color: 'green', icon: <CheckCircleOutlined />, text: '已存证' },
  pending: { color: 'orange', icon: <ClockCircleOutlined />, text: '存证中' },
  failed: { color: 'red', icon: <ExclamationCircleOutlined />, text: '存证失败' },
};

interface BlockchainBadgeProps {
  status?: CertifyStatus;
  certified?: boolean;
  txHash?: string;
  showTxHash?: boolean;
}

export const BlockchainBadge: React.FC<BlockchainBadgeProps> = ({ status, certified, txHash, showTxHash }) => {
  if (!certified && !status) {
    return <Tag icon={<LinkOutlined />} color="default">未存证</Tag>;
  }

  const effectiveStatus = status || (certified ? 'confirmed' : 'pending');
  const config = statusConfig[effectiveStatus];

  return (
    <Space size={4}>
      <Tag icon={config.icon} color={config.color}>{config.text}</Tag>
      {showTxHash && txHash && (
        <Tooltip title={txHash}>
          <Tag style={{ fontFamily: 'monospace', fontSize: 11, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {txHash.slice(0, 10)}...{txHash.slice(-6)}
          </Tag>
        </Tooltip>
      )}
    </Space>
  );
};
