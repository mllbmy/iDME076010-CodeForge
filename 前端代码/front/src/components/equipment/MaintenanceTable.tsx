import React from 'react';
import { Table } from 'antd';
import { MaintenanceRecord } from './types';
import { getMaintenanceColumns } from './constants';

interface MaintenanceTableProps {
  dataSource: MaintenanceRecord[];
  onViewDetail: (record: MaintenanceRecord) => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (key: string) => void;
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ dataSource, onViewDetail, onEdit, onDelete }) => {
  const columns = getMaintenanceColumns(onViewDetail, onEdit, onDelete);

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

export default MaintenanceTable;
