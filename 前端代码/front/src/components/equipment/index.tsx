import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import EquipmentLedgerTab from './EquipmentLedgerTab';
import MaintenanceTab from './MaintenanceTab';
import RepairTab from './RepairTab';
import { useEquipmentData } from './hooks/useEquipmentData';
import { useMaintenanceData } from './hooks/useMaintenanceData';
import { useRepairData } from './hooks/useRepairData';

const EquipmentManagement: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const {
    equipmentLedgerData,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    extAttrs,
    addExtAttr,
    removeExtAttr,
    updateExtAttr,
    resetExtAttrs,
    getEquipmentStats,
  } = useEquipmentData();

  const {
    maintenanceData,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    partsReplaced,
    addPart,
    removePart,
    updatePart,
    resetPartsReplaced,
  } = useMaintenanceData();

  const {
    repairData,
    addRepair,
    updateRepair,
    deleteRepair,
  } = useRepairData();

  const [currentTabKey, setCurrentTabKey] = useState('equipment-ledger');

  const getActiveKey = () => {
    if (activeTab === 'equipment' || activeTab.includes('equipment-ledger')) return 'equipment-ledger';
    if (activeTab.includes('equipment-maintenance')) return 'equipment-maintenance';
    return 'equipment-repair';
  };

  useEffect(() => {
    setCurrentTabKey(getActiveKey());
  }, [activeTab]);

  const tabsItems: TabsProps['items'] = [
    {
      key: 'equipment-ledger',
      label: '设备台账',
      children: (
        <EquipmentLedgerTab
          equipmentLedgerData={equipmentLedgerData}
          addEquipment={addEquipment}
          updateEquipment={updateEquipment}
          deleteEquipment={deleteEquipment}
          extAttrs={extAttrs}
          addExtAttr={addExtAttr}
          removeExtAttr={removeExtAttr}
          updateExtAttr={updateExtAttr}
          resetExtAttrs={resetExtAttrs}
          getEquipmentStats={getEquipmentStats}
        />
      ),
    },
    {
      key: 'equipment-maintenance',
      label: '设备保养',
      children: (
        <MaintenanceTab
          maintenanceData={maintenanceData}
          equipmentLedgerData={equipmentLedgerData}
          addMaintenance={addMaintenance}
          updateMaintenance={updateMaintenance}
          deleteMaintenance={deleteMaintenance}
          partsReplaced={partsReplaced}
          addPart={addPart}
          removePart={removePart}
          updatePart={updatePart}
          resetPartsReplaced={resetPartsReplaced}
        />
      ),
    },
    {
      key: 'equipment-repair',
      label: '设备维修',
      children: (
        <RepairTab
          repairData={repairData}
          equipmentLedgerData={equipmentLedgerData}
          addRepair={addRepair}
          updateRepair={updateRepair}
          deleteRepair={deleteRepair}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs activeKey={currentTabKey} items={tabsItems} onChange={setCurrentTabKey} />
    </div>
  );
};

export default EquipmentManagement;
