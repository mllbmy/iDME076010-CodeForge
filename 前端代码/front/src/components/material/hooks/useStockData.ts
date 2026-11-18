import { useState } from 'react';
import { message, Form } from 'antd';
import dayjs from 'dayjs';
import type { StockRecord, Material } from '../types';

const generateStockRecords = (): StockRecord[] => {
  const records: StockRecord[] = [];
  const types: ('in' | 'out')[] = ['in', 'out'];
  const operators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const remarks = {
    in: ['采购入库', '退货入库', '生产入库', '调拨入库'],
    out: ['生产领用', '设备维修领用', '调拨出库', '报废出库'],
  };

  for (let i = 0; i < 35; i++) {
    const type = types[Math.floor(Math.random() * 2)];
    const quantity = Math.floor(Math.random() * 100) + 10;
    const beforeStock = Math.floor(Math.random() * 500) + 100;
    records.push({
      key: String(i + 1),
      materialId: `MAT-${String(Math.floor(Math.random() * 60) + 1).padStart(3, '0')}`,
      materialName: `物料${Math.floor(Math.random() * 40) + 1}`,
      type,
      quantity,
      relatedOrder: type === 'in' ? `PO-2024-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}` : `WO-2024-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      operator: operators[Math.floor(Math.random() * operators.length)],
      operateTime: `2024-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      remark: remarks[type][Math.floor(Math.random() * 4)],
      beforeStock,
      afterStock: type === 'in' ? beforeStock + quantity : beforeStock - quantity,
      ...(i < 3 ? {
        blockchainCertified: true,
        blockchainTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      } : {
        blockchainCertified: false,
      }),
    });
  }
  return records;
};

const useStockData = () => {
  const [stockRecords, setStockRecords] = useState<StockRecord[]>(generateStockRecords);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockType, setStockType] = useState<'in' | 'out'>('in');
  const [stockForm] = Form.useForm();
  const [selectedStockRecord, setSelectedStockRecord] = useState<Material | null>(null);

  const openStockModal = (record: Material, type: 'in' | 'out') => {
    setSelectedStockRecord(record);
    setStockType(type);
    stockForm.resetFields();
    stockForm.setFieldsValue({
      materialId: record.partNumber,
      materialName: record.partName,
      currentStock: record.stockQuantity,
    });
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = (updateMaterialStock: (key: string, newStock: number, safetyStock: number) => void) => {
    stockForm.validateFields().then(values => {
      if (!selectedStockRecord) return;

      const quantity = stockType === 'in' ? values.quantity : -values.quantity;
      const newStock = selectedStockRecord.stockQuantity + quantity;

      if (newStock < 0) {
        message.error('库存不足');
        return;
      }

      const newStockRecord: StockRecord = {
        key: Date.now().toString(),
        materialId: selectedStockRecord.partNumber,
        materialName: selectedStockRecord.partName,
        type: stockType,
        quantity: values.quantity,
        relatedOrder: values.relatedOrder,
        operator: values.operator,
        operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        remark: values.remark,
        beforeStock: selectedStockRecord.stockQuantity,
        afterStock: newStock,
      };

      setStockRecords(prev => [newStockRecord, ...prev]);
      updateMaterialStock(selectedStockRecord.key, newStock, selectedStockRecord.safetyStock);

      message.success(`${stockType === 'in' ? '入库' : '出库'}成功`);
      setIsStockModalOpen(false);
    }).catch(() => {
      message.warning('请填写完整的库存操作信息');
    });
  };

  return {
    stockRecords,
    isStockModalOpen,
    setIsStockModalOpen,
    stockType,
    stockForm,
    selectedStockRecord,
    openStockModal,
    handleStockSubmit,
  };
};

export default useStockData;
