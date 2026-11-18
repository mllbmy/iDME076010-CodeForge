import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Space, Typography } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { useBlockchainStore } from '@/store/useBlockchainStore';
import type { BlockchainDataType, CertifyRecord } from '@/services/interfaces/IBlockchainService';

const { Text } = Typography;

interface BlockchainTxHistoryProps {
  dataType: BlockchainDataType;
  dataId: string;
}

export const BlockchainTxHistory: React.FC<BlockchainTxHistoryProps> = ({ dataType, dataId }) => {
  const { getHistory, loading } = useBlockchainStore();
  const [records, setRecords] = useState<CertifyRecord[]>([]);
  const isLoading = loading[`history-${dataId}`];

  useEffect(() => {
    getHistory(dataType, dataId).then(setRecords);
  }, [dataType, dataId, getHistory]);

  const columns = [
    {
      title: '交易哈希', dataIndex: 'txHash', width: 180,
      render: (v: string) => <Text copyable code style={{ fontSize: 11 }}>{v.slice(0, 14)}...{v.slice(-6)}</Text>,
    },
    {
      title: '区块高度', dataIndex: 'blockNumber', width: 100,
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => <Tag color={v === 'confirmed' ? 'green' : v === 'pending' ? 'orange' : 'red'}>{v === 'confirmed' ? '已确认' : v === 'pending' ? '待确认' : '失败'}</Tag>,
    },
    {
      title: '存证时间', dataIndex: 'timestamp', width: 160,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '网络', dataIndex: 'network', width: 140,
      render: (v: string) => <Tag>{v}</Tag>,
    },
  ];

  return (
    <Card
      title={<Space><HistoryOutlined />交易记录</Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Table<CertifyRecord>
        dataSource={records}
        columns={columns}
        rowKey="txHash"
        size="small"
        loading={isLoading}
        pagination={false}
      />
    </Card>
  );
};
