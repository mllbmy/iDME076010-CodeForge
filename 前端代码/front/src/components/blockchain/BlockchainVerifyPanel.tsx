import React, { useCallback, useState } from 'react';
import { Card, Button, Descriptions, Space, Typography, Alert, Tag } from 'antd';
import { SafetyCertificateOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useBlockchainStore } from '@/store/useBlockchainStore';
import type { BlockchainDataType, VerifyResult } from '@/services/interfaces/IBlockchainService';

const { Text } = Typography;

const verifyStatusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
  verified: { color: 'green', icon: <SafetyCertificateOutlined />, text: '验证通过' },
  tampered: { color: 'red', icon: <ExclamationCircleOutlined />, text: '数据被篡改' },
  not_found: { color: 'orange', icon: <SearchOutlined />, text: '链上未找到' },
  verifying: { color: 'blue', icon: <SearchOutlined />, text: '验证中' },
};

interface BlockchainVerifyPanelProps {
  dataType: BlockchainDataType;
  dataId: string;
  dataName: string;
  dataHash: string;
}

export const BlockchainVerifyPanel: React.FC<BlockchainVerifyPanelProps> = ({
  dataType, dataId, dataName, dataHash,
}) => {
  const { verify, getVerifyResult, loading } = useBlockchainStore();
  const result = getVerifyResult(dataId);
  const isLoading = loading[`verify-${dataId}`];
  const [localResult, setLocalResult] = useState<VerifyResult | null>(null);
  const displayResult = localResult || result;

  const handleVerify = useCallback(async () => {
    const r = await verify({ dataType, dataId, dataHash });
    setLocalResult(r);
  }, [verify, dataType, dataId, dataHash]);

  return (
    <Card
      title={<Space><SafetyCertificateOutlined />链上验证</Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="数据标识">{dataName}</Descriptions.Item>
          <Descriptions.Item label="数据哈希"><Text code style={{ fontSize: 11 }}>{dataHash.slice(0, 16)}...</Text></Descriptions.Item>
        </Descriptions>

        {displayResult && (() => {
          const config = verifyStatusConfig[displayResult.verifyStatus];
          return (
            <Alert
              type={displayResult.match ? 'success' : 'error'}
              showIcon
              icon={config.icon}
              message={config.text}
              description={
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="链上哈希"><Text code style={{ fontSize: 11 }}>{displayResult.onChainHash.slice(0, 16)}...</Text></Descriptions.Item>
                  <Descriptions.Item label="区块高度">{displayResult.blockNumber}</Descriptions.Item>
                  <Descriptions.Item label="验证时间">{new Date(displayResult.timestamp).toLocaleString()}</Descriptions.Item>
                  <Descriptions.Item label="比对结果">
                    <Tag color={displayResult.match ? 'green' : 'red'}>{displayResult.match ? '数据一致，未被篡改' : '数据不一致，可能被篡改'}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              }
            />
          );
        })()}

        <Button icon={<SafetyCertificateOutlined />} onClick={handleVerify} loading={isLoading} block>
          验证数据完整性
        </Button>
      </Space>
    </Card>
  );
};
