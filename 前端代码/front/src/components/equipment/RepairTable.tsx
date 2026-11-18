import React from 'react';
import { Table } from 'antd';
import { RepairRecord } from './types';
import { getRepairColumns } from './constants';

interface RepairTableProps {
  dataSource: RepairRecord[];
  onViewDetail: (record: RepairRecord) => void;
  onEdit: (record: RepairRecord) => void;
  onDelete: (key: string) => void;
}

const RepairTable: React.FC<RepairTableProps> = ({ dataSource, onViewDetail, onEdit, onDelete }) => {
  const columns = getRepairColumns(onViewDetail, onEdit, onDelete);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      scroll={{ x: 'max-content', y: 500 }}
      bordered
    />
  );
};

export default RepairTable;
