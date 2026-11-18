import { useState, useEffect } from 'react';
import { message } from 'antd';
import { dataStore } from '@/store/dataStore';
import { EquipmentLedger, ExtAttr } from '../types';

export const useEquipmentData = () => {
  const [equipmentLedgerData, setEquipmentLedgerData] = useState<EquipmentLedger[]>([]);
  const [extAttrs, setExtAttrs] = useState<ExtAttr[]>([]);

  useEffect(() => {
    if (equipmentLedgerData.length === 0) {
      dataStore.initializeAllData();
      setEquipmentLedgerData(dataStore.getEquipmentData());
    }
  }, []);

  useEffect(() => {
    dataStore.setEquipmentData(equipmentLedgerData);
  }, [equipmentLedgerData]);

  const addEquipment = (record: EquipmentLedger) => {
    setEquipmentLedgerData(prev => [...prev, record]);
    message.success('添加成功');
  };

  const updateEquipment = (key: string, record: Partial<EquipmentLedger>) => {
    setEquipmentLedgerData(prev => prev.map(item => item.key === key ? { ...item, ...record } : item));
    message.success('编辑成功');
  };

  const deleteEquipment = (key: string) => {
    setEquipmentLedgerData(prev => prev.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const addExtAttr = () => {
    setExtAttrs([...extAttrs, { key: '', value: '' }]);
  };

  const removeExtAttr = (index: number) => {
    setExtAttrs(extAttrs.filter((_, i) => i !== index));
  };

  const updateExtAttr = (index: number, field: 'key' | 'value', value: string) => {
    const newAttrs = [...extAttrs];
    newAttrs[index][field] = value;
    setExtAttrs(newAttrs);
  };

  const resetExtAttrs = (attrs?: ExtAttr[]) => {
    setExtAttrs(attrs || []);
  };

  const getEquipmentStats = () => {
    const stats = {
      byManufacturer: {} as Record<string, number>,
      byBrand: {} as Record<string, number>,
      byLocation: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };
    equipmentLedgerData.forEach(item => {
      stats.byManufacturer[item.manufacturerFactory] = (stats.byManufacturer[item.manufacturerFactory] || 0) + 1;
      stats.byBrand[item.brand] = (stats.byBrand[item.brand] || 0) + 1;
      stats.byLocation[item.equipmentLocal] = (stats.byLocation[item.equipmentLocal] || 0) + 1;
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
    });
    return stats;
  };

  return {
    equipmentLedgerData,
    setEquipmentLedgerData,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    extAttrs,
    addExtAttr,
    removeExtAttr,
    updateExtAttr,
    resetExtAttrs,
    getEquipmentStats,
  };
};
