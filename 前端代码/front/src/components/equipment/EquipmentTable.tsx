import React from 'react';
import { Table } from 'antd';
import { EquipmentLedger } from './types';
import { getEquipmentLedgerColumns } from './constants';

interface EquipmentTableProps {
  dataSource: EquipmentLedger[];
  onViewDetail: (record: EquipmentLedger) => void;
  onEdit: (record: EquipmentLedger) => void;
  onDelete: (key: string) => void;
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ dataSource, onViewDetail, onEdit, onDelete }) => {
  const columns = getEquipmentLedgerColumns(onViewDetail, onEdit, onDelete);

  const rowClassName = (record: EquipmentLedger) => {
    return record.key.startsWith('priority-') ? 'priority-row' : '';
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      scroll={{ x: 'max-content', y: 500 }}
      bordered
      rowClassName={rowClassName}
      size="middle"
      className="equipment-table-responsive"
    />
  );
};

export default EquipmentTable;
