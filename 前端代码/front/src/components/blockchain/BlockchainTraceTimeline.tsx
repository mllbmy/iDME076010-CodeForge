import React, { useEffect, useState } from 'react';
import { Card, Timeline, Tag, Space, Typography, Descriptions } from 'antd';
import { BranchesOutlined } from '@ant-design/icons';
import { useBlockchainStore } from '@/store/useBlockchainStore';
import type { BlockchainDataType, TraceNode } from '@/services/interfaces/IBlockchainService';

const { Text } = Typography;

interface BlockchainTraceTimelineProps {
  dataType: BlockchainDataType;
  dataId: string;
  dataName?: string;
}

export const BlockchainTraceTimeline: React.FC<BlockchainTraceTimelineProps> = ({ dataType, dataId }) => {
  const { getTrace } = useBlockchainStore();
  const [nodes, setNodes] = useState<TraceNode[]>([]);

  useEffect(() => {
    getTrace({ dataType, dataId }).then(setNodes);
  }, [dataType, dataId, getTrace]);

  return (
    <Card
      title={<Space><BranchesOutlined />数据溯源</Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Timeline
        mode="left"
        items={nodes.map((node) => ({
          color: 'green',
          children: (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Space>
                  <Tag color="blue">{node.action}</Tag>
                  <Text type="secondary">{node.operator}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{new Date(node.timestamp).toLocaleString()}</Text>
                </Space>
              </div>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="交易哈希">
                  <Text copyable code style={{ fontSize: 11 }}>{node.txHash.slice(0, 14)}...{node.txHash.slice(-6)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="区块">{node.blockNumber}</Descriptions.Item>
              </Descriptions>
            </div>
          ),
        }))}
      />
    </Card>
  );
};
