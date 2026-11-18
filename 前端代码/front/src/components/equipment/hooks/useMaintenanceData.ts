import { useState, useEffect } from 'react';
import { message } from 'antd';
import { dataStore } from '@/store/dataStore';
import { MaintenanceRecord } from '../types';

export const useMaintenanceData = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>([]);
  const [partsReplaced, setPartsReplaced] = useState<{ name: string; quantity: number; model: string }[]>([]);

  useEffect(() => {
    if (maintenanceData.length === 0) {
      setMaintenanceData(dataStore.getMaintenanceData());
    }
  }, []);

  useEffect(() => {
    dataStore.setMaintenanceData(maintenanceData);
  }, [maintenanceData]);

  const addMaintenance = (record: MaintenanceRecord) => {
    setMaintenanceData(prev => [...prev, record]);
    message.success('添加成功');
  };

  const updateMaintenance = (key: string, record: Partial<MaintenanceRecord>) => {
    setMaintenanceData(prev => prev.map(item => item.key === key ? { ...item, ...record } : item));
    message.success('编辑成功');
  };

  const deleteMaintenance = (key: string) => {
    setMaintenanceData(prev => prev.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const addPart = () => {
    setPartsReplaced([...partsReplaced, { name: '', quantity: 1, model: '' }]);
  };

  const removePart = (index: number) => {
    setPartsReplaced(partsReplaced.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, field: string, value: string | number) => {
    const newParts = [...partsReplaced];
    (newParts as any)[index][field] = value;
    setPartsReplaced(newParts);
  };

  const resetPartsReplaced = (parts?: { name: string; quantity: number; model: string }[]) => {
    setPartsReplaced(parts || []);
  };

  return {
    maintenanceData,
    setMaintenanceData,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    partsReplaced,
    addPart,
    removePart,
    updatePart,
    resetPartsReplaced,
  };
};
