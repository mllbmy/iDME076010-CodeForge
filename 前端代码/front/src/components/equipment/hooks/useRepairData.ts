import { useState, useEffect } from 'react';
import { message } from 'antd';
import { dataStore } from '@/store/dataStore';
import { RepairRecord } from '../types';

export const useRepairData = () => {
  const [repairData, setRepairData] = useState<RepairRecord[]>([]);

  useEffect(() => {
    if (repairData.length === 0) {
      setRepairData(dataStore.getRepairData());
    }
  }, []);

  useEffect(() => {
    dataStore.setRepairData(repairData);
  }, [repairData]);

  const addRepair = (record: RepairRecord) => {
    setRepairData(prev => [...prev, record]);
    message.success('添加成功');
  };

  const updateRepair = (key: string, record: Partial<RepairRecord>) => {
    setRepairData(prev => prev.map(item => item.key === key ? { ...item, ...record } : item));
    message.success('编辑成功');
  };

  const deleteRepair = (key: string) => {
    setRepairData(prev => prev.filter(item => item.key !== key));
    message.success('删除成功');
  };

  return {
    repairData,
    setRepairData,
    addRepair,
    updateRepair,
    deleteRepair,
  };
};
