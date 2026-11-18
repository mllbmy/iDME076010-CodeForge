import React from 'react';
import { Table, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { VersionRecord } from './types';
import { versionColumns } from './constants';

interface VersionTableProps {
  versionRecords: VersionRecord[];
  onAddVersion: () => void;
}

const VersionTable: React.FC<VersionTableProps> = ({ versionRecords, onAddVersion }) => {
  return (
    <Card
      title="版本管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddVersion}>
          新增版本更新
        </Button>
      }
    >
      <Table
        columns={versionColumns}
        dataSource={versionRecords}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        rowKey="key"
        scroll={{ x: 'max-content', y: 500 }}
        bordered
      />
    </Card>
  );
};

export default VersionTable;
