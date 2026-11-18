import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CheckCircleOutlined, SwapOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import ProcessConfigTab from './ProcessConfigTab';
import ProcessRouteTab from './ProcessRouteTab';
import { useProcessData } from './hooks/useProcessData';
import { useProcessRouteData } from './hooks/useProcessRouteData';

const ProcessManagement: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [currentTabKey, setCurrentTabKey] = useState('process-configuration');

  const {
    processData,
    isProcessModalOpen,
    isEditMode: isProcessEditMode,
    selectedProcess,
    handleAddProcess,
    handleEditProcess,
    handleDeleteProcess,
    handleProcessSubmit,
    handleMoveProcess,
    setIsProcessModalOpen,
  } = useProcessData();

  const {
    processRouteData,
    isRouteModalOpen,
    isRouteDetailModalOpen,
    isEditMode: isRouteEditMode,
    selectedRoute,
    selectedProcessKeys,
    dragProcessList,
    handleAddRoute,
    handleEditRoute,
    handleDeleteRoute,
    handleRouteSubmit,
    handleViewRouteDetail,
    setIsRouteModalOpen,
    setIsRouteDetailModalOpen,
    handleProcessSelect,
    handleMoveStep,
  } = useProcessRouteData();

  useEffect(() => {
    if (activeTab.includes('process-configuration')) {
      setCurrentTabKey('process-configuration');
    } else if (activeTab.includes('process-route')) {
      setCurrentTabKey('process-route');
    }
  }, [activeTab]);

  const tabsItems: TabsProps['items'] = [
    {
      key: 'process-configuration',
      label: (
        <span>
          <CheckCircleOutlined />
          配置工序
        </span>
      ),
      children: (
        <ProcessConfigTab
          processData={processData}
          isProcessModalOpen={isProcessModalOpen}
          isEditMode={isProcessEditMode}
          selectedProcess={selectedProcess}
          onAddProcess={handleAddProcess}
          onEditProcess={handleEditProcess}
          onDeleteProcess={handleDeleteProcess}
          onProcessSubmit={handleProcessSubmit}
          onMoveProcess={handleMoveProcess}
          setIsProcessModalOpen={setIsProcessModalOpen}
        />
      ),
    },
    {
      key: 'process-route',
      label: (
        <span>
          <SwapOutlined />
          配置工艺路线
        </span>
      ),
      children: (
        <div>
          <ProcessRouteTab
          processRouteData={processRouteData}
          processData={processData}
          isRouteModalOpen={isRouteModalOpen}
          isRouteDetailModalOpen={isRouteDetailModalOpen}
          isEditMode={isRouteEditMode}
          selectedRoute={selectedRoute}
          selectedProcessKeys={selectedProcessKeys}
          dragProcessList={dragProcessList}
          onAddRoute={handleAddRoute}
          onEditRoute={handleEditRoute}
          onDeleteRoute={handleDeleteRoute}
          onRouteSubmit={handleRouteSubmit}
          onViewRouteDetail={handleViewRouteDetail}
          setIsRouteModalOpen={setIsRouteModalOpen}
          setIsRouteDetailModalOpen={setIsRouteDetailModalOpen}
          onProcessSelect={(targetKeys, direction, moveKeys) => handleProcessSelect(targetKeys, direction, moveKeys, processData)}
          onMoveStep={handleMoveStep}
        />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={currentTabKey}
        items={tabsItems}
        onChange={(key) => {
          setCurrentTabKey(key);
        }}
      />
    </div>
  );
};

export default ProcessManagement;
