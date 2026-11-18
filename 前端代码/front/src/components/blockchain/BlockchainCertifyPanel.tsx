import React, { useCallback } from 'react';
import { Card, Button, Descriptions, Space, Typography, Alert } from 'antd';
import { LinkOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useBlockchainStore } from '@/store/useBlockchainStore';
import { BlockchainBadge } from './BlockchainBadge';
import type { BlockchainDataType, CertifyRecord } from '@/services/interfaces/IBlockchainService';

const { Text } = Typography;

interface BlockchainCertifyPanelProps {
  dataType: BlockchainDataType;
  dataId: string;
  dataName: string;
  payload: Record<string, unknown>;
  onCertified?: (record: CertifyRecord) => void;
}

export const BlockchainCertifyPanel: React.FC<BlockchainCertifyPanelProps> = ({
  dataType, dataId, dataName, payload, onCertified,
}) => {
  const { certify, getCertifyRecord, loading } = useBlockchainStore();
  const record = getCertifyRecord(dataId);
  const isLoading = loading[`certify-${dataId}`];

  const handleCertify = useCallback(async () => {
    const result = await certify({ dataType, dataId, payload });
    onCertified?.(result);
  }, [certify, dataType, dataId, payload, onCertified]);

  return (
    <Card
      title={<Space><LinkOutlined />区块链存证</Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="数据类型">{dataType === 'process_route' ? '工艺路线' : '出入库记录'}</Descriptions.Item>
          <Descriptions.Item label="数据标识">{dataName}</Descriptions.Item>
          <Descriptions.Item label="存证状态">
            <BlockchainBadge certified={!!record} status={record?.status} txHash={record?.txHash} showTxHash />
          </Descriptions.Item>
        </Descriptions>

        {record && (
          <Alert
            type="success"
            showIcon
            icon={<SafetyCertificateOutlined />}
            message="数据已上链存证"
            description={
              <Descriptions column={1} size="small">
                <Descriptions.Item label="交易哈希"><Text copyable code style={{ fontSize: 11 }}>{record.txHash}</Text></Descriptions.Item>
                <Descriptions.Item label="区块高度">{record.blockNumber}</Descriptions.Item>
                <Descriptions.Item label="存证时间">{new Date(record.timestamp).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="区块链网络">{record.network}</Descriptions.Item>
              </Descriptions>
            }
          />
        )}

        {!record && (
          <Button type="primary" icon={<LinkOutlined />} onClick={handleCertify} loading={isLoading} block>
            提交存证
          </Button>
        )}
      </Space>
    </Card>
  );
};
