import React from 'react';
import { Table, Button, Card, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import type { StockRecord } from './types';
import { stockRecordColumns } from './constants';
import { getExcelUtils } from '@/utils/excel';
import { BlockchainVerifyPanel, BlockchainTraceTimeline } from '@/components/blockchain';
import { generateDataHash } from '@/store/useBlockchainStore';

interface StockRecordTableProps {
  stockRecords: StockRecord[];
}

const StockRecordTable: React.FC<StockRecordTableProps> = ({ stockRecords }) => {
  const [blockchainPanelId, setBlockchainPanelId] = React.useState<string | null>(null);
  const exportStockRecordsToExcel = async () => {
    const exportData = stockRecords.map(item => ({
      '物料编码': item.materialId,
      '物料名称': item.materialName,
      '类型': item.type === 'in' ? '入库' : '出库',
      '数量': item.quantity,
      '变动前库存': item.beforeStock,
      '变动后库存': item.afterStock,
      '关联单号': item.relatedOrder,
      '操作人': item.operator,
      '操作时间': item.operateTime,
      '备注': item.remark,
    }));

    const XLSX = await getExcelUtils();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, '出入库记录');
    XLSX.writeFile(wb, '出入库记录.xlsx');
  };

  return (
    <>
      <Card
      title="出入库记录"
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={exportStockRecordsToExcel}>导出Excel</Button>
          <Button
            icon={<SafetyCertificateOutlined />}
            onClick={() => {
              const firstRecord = stockRecords[0];
              if (firstRecord) setBlockchainPanelId(firstRecord.key);
            }}
          >
            链上验证
          </Button>
        </Space>
      }
    >
      <Table
        columns={stockRecordColumns}
        dataSource={stockRecords}
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
    {blockchainPanelId && (() => {
      const record = stockRecords.find(r => r.key === blockchainPanelId);
      if (!record) return null;
      return (
        <>
          <BlockchainVerifyPanel
            dataType="stock_record"
            dataId={record.key}
            dataName={`${record.materialName} - ${record.type === 'in' ? '入库' : '出库'}`}
            dataHash={generateDataHash({
              materialId: record.materialId,
              type: record.type,
              quantity: record.quantity,
              operator: record.operator,
              operateTime: record.operateTime,
            })}
          />
          <BlockchainTraceTimeline
            dataType="stock_record"
            dataId={record.key}
            dataName={record.materialName}
          />
        </>
      );
    })()}
    </>
  );
};

export default StockRecordTable;
