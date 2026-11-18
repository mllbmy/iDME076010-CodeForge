import React from 'react';
import { Table, Button, Space, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Process } from './types';

interface ProcessTableProps {
  dataSource: Process[];
  onEdit: (record: Process) => void;
  onDelete: (key: string) => void;
  onMove: (key: string, direction: 'up' | 'down') => void;
  totalData?: Process[];
}

const ProcessTable: React.FC<ProcessTableProps> = ({ dataSource, onEdit, onDelete, onMove }) => {
  const processColumns: ColumnsType<Process> = [
    {
      title: '排序',
      key: 'sort',
      width: 80,
      render: (_: unknown, record: Process, index: number) => (
        <Space>
          <Tooltip title="上移">
            <Button
              type="text"
              size="small"
              icon={<HolderOutlined rotate={90} />}
              onClick={() => onMove(record.key, 'up')}
              disabled={index === 0}
            />
          </Tooltip>
          <Tooltip title="下移">
            <Button
              type="text"
              size="small"
              icon={<HolderOutlined rotate={270} />}
              onClick={() => onMove(record.key, 'down')}
              disabled={index === dataSource.length - 1}
            />
          </Tooltip>
        </Space>
      ),
    },
    { title: '工序ID', dataIndex: 'processId', key: 'processId', width: 120 },
    { title: '工序名称', dataIndex: 'processName', key: 'processName', width: 120 },
    { title: '工序描述', dataIndex: 'processDescription', key: 'processDescription', ellipsis: true },
    { title: '所属车间', dataIndex: 'workshop', key: 'workshop', width: 120 },
    {
      title: '标准工时',
      dataIndex: 'standardHours',
      key: 'standardHours',
      width: 120,
      render: (hours: number) => (
        <Tag color="blue">{hours}h</Tag>
      )
    },
    { title: '使用设备', dataIndex: 'equipment', key: 'equipment', width: 150, ellipsis: true },
    { title: '操作员', dataIndex: 'operator', key: 'operator', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>
      )
    },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 110 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: Process) => (
        <Space size="small">
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
      columns={processColumns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      scroll={{ x: 'max-content', y: 500 }}
      bordered
    />
  );
};

export default ProcessTable;
