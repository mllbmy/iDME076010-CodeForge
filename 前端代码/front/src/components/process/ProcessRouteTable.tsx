import React from 'react';
import { Table, Button, Space, Tag, Badge, Tooltip, Card, Steps } from 'antd';
import { EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProcessRoute } from './types';
import { BlockchainBadge } from '@/components/blockchain';

interface ProcessRouteTableProps {
  dataSource: ProcessRoute[];
  onEdit: (record: ProcessRoute) => void;
  onDelete: (key: string) => void;
  onViewDetail: (record: ProcessRoute) => void;
}

const ProcessRouteTable: React.FC<ProcessRouteTableProps> = ({ dataSource, onEdit, onDelete, onViewDetail }) => {
  const processRouteColumns: ColumnsType<ProcessRoute> = [
    { title: '工艺路线ID', dataIndex: 'routeId', key: 'routeId', width: 120 },
    { title: '工艺路线名称', dataIndex: 'routeName', key: 'routeName', width: 150 },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (version: string) => <Tag color="purple">{version}</Tag>
    },
    { title: '所属产品', dataIndex: 'product', key: 'product', width: 180 },
    { title: '工艺描述', dataIndex: 'routeDescription', key: 'routeDescription', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>
      )
    },
    {
      title: '工序数量',
      key: 'processCount',
      width: 90,
      render: (_: unknown, record: ProcessRoute) => (
        <Badge count={record.processList.length} showZero style={{ backgroundColor: '#1890ff' }} />
      )
    },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 110 },
    {
      title: '存证状态',
      width: 120,
      render: (_: unknown, record: ProcessRoute) => (
        <BlockchainBadge
          certified={(record as ProcessRoute & { blockchainCertified?: boolean }).blockchainCertified}
          txHash={(record as ProcessRoute & { blockchainTxHash?: string }).blockchainTxHash}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: ProcessRoute) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="primary" ghost icon={<PlayCircleOutlined />} size="small" onClick={() => onViewDetail(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="删除">
            <Button danger icon={<DeleteOutlined />} size="small" onClick={() => onDelete(record.key)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={processRouteColumns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      scroll={{ x: 'max-content', y: 500 }}
      bordered
      expandable={{
        expandedRowRender: (record: ProcessRoute) => (
          <Card size="small" title="工序流程">
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={record.processList.map(step => ({
                title: `${step.step}. ${step.processName}`,
                description: (
                  <div>
                    <p>车间: {step.workshop} | 设备: {step.equipment}</p>
                    <p>标准工时: <Tag color="blue">{step.standardHours}小时</Tag></p>
                  </div>
                ),
              }))}
            />
          </Card>
        ),
      }}
    />
  );
};

export default ProcessRouteTable;
