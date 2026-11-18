import { useState } from 'react';
import { Modal, App } from 'antd';
import type { FormInstance } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { Key } from 'react';
import dayjs from 'dayjs';
import type { ProcessRoute, ProcessStep, RouteHistory, Process } from '../types';
import { generateProcessRouteData } from '../constants';

const defaultProcessRoutes: ProcessRoute[] = generateProcessRouteData();

export const useProcessRouteData = () => {
  const { message } = App.useApp();
  const [processRouteData, setProcessRouteData] = useState<ProcessRoute[]>(defaultProcessRoutes);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isRouteDetailModalOpen, setIsRouteDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<ProcessRoute | null>(null);
  const [selectedProcessKeys, setSelectedProcessKeys] = useState<Key[]>([]);
  const [dragProcessList, setDragProcessList] = useState<ProcessStep[]>([]);

  const handleAddRoute = (routeForm: FormInstance) => {
    setIsEditMode(false);
    setSelectedRoute(null);
    routeForm.resetFields();
    routeForm.setFieldsValue({ status: '启用', version: 'V1.0' });
    setSelectedProcessKeys([]);
    setDragProcessList([]);
    setIsRouteModalOpen(true);
  };

  const handleEditRoute = (record: ProcessRoute, routeForm: FormInstance) => {
    setIsEditMode(true);
    setSelectedRoute(record);
    routeForm.setFieldsValue({
      routeId: record.routeId,
      routeName: record.routeName,
      version: record.version,
      product: record.product,
      routeDescription: record.routeDescription,
      status: record.status,
    });
    setSelectedProcessKeys(record.processList.map(p => p.processId));
    setDragProcessList(record.processList);
    setIsRouteModalOpen(true);
  };

  const handleViewRouteDetail = (record: ProcessRoute) => {
    setSelectedRoute(record);
    setIsRouteDetailModalOpen(true);
  };

  const handleDeleteRoute = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工艺路线吗？',
      onOk: () => {
        setProcessRouteData(prev => prev.filter(item => item.key !== key));
        message.success('删除成功');
      }
    });
  };

  const handleRouteSubmit = (routeForm: FormInstance) => {
    routeForm.validateFields().then((values: Omit<ProcessRoute, 'key' | 'processList' | 'createDate' | 'updateTime' | 'history'>) => {
      const processList: ProcessStep[] = dragProcessList.map((p, index) => ({
        key: `${Date.now()}-${index}`,
        step: index + 1,
        processId: p.processId,
        processName: p.processName,
        workshop: p.workshop,
        standardHours: p.standardHours,
        equipment: p.equipment,
      }));

      if (isEditMode && selectedRoute) {
        const newHistory: RouteHistory = {
          key: Date.now().toString(),
          version: values.version,
          changeContent: '工艺路线更新',
          changeDate: dayjs().format('YYYY-MM-DD'),
          changePerson: '管理员',
        };

        setProcessRouteData(prev => prev.map(item =>
          item.key === selectedRoute.key
            ? {
                ...item,
                ...values,
                processList,
                updateTime: dayjs().format('YYYY-MM-DD'),
                history: [newHistory, ...item.history]
              }
            : item
        ));
        message.success('编辑成功');
      } else {
        const newRoute: ProcessRoute = {
          key: Date.now().toString(),
          ...values,
          routeId: values.routeId || `ROUTE-${String(processRouteData.length + 1).padStart(3, '0')}`,
          processList,
          createDate: dayjs().format('YYYY-MM-DD'),
          updateTime: dayjs().format('YYYY-MM-DD'),
          history: [{
            key: '1',
            version: values.version,
            changeContent: '初始版本',
            changeDate: dayjs().format('YYYY-MM-DD'),
            changePerson: '管理员',
          }],
        };
        setProcessRouteData(prev => [...prev, newRoute]);
        message.success('添加成功');
      }
      setIsRouteModalOpen(false);
    });
  };

  const handleProcessSelect = (targetKeys: Key[], _direction: TransferDirection, _moveKeys: Key[], processData: Process[]) => {
    const stringKeys = targetKeys.map(key => String(key));
    setSelectedProcessKeys(stringKeys);

    const selectedProcesses = stringKeys
      .map(key => processData.find((p: Process) => p.processId === key))
      .filter((p: Process | undefined): p is Process => p !== undefined)
      .map((p: Process, index: number) => ({
        key: `${Date.now()}-${index}`,
        step: index + 1,
        processId: p.processId,
        processName: p.processName,
        workshop: p.workshop,
        standardHours: p.standardHours,
        equipment: p.equipment,
      }));

    setDragProcessList(selectedProcesses);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dragProcessList.length) return;

    const newList = [...dragProcessList];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];

    const reorderedList = newList.map((item, idx) => ({ ...item, step: idx + 1 }));
    setDragProcessList(reorderedList);
  };

  return {
    processRouteData,
    setProcessRouteData,
    isRouteModalOpen,
    setIsRouteModalOpen,
    isRouteDetailModalOpen,
    setIsRouteDetailModalOpen,
    isEditMode,
    setIsEditMode,
    selectedRoute,
    setSelectedRoute,
    selectedProcessKeys,
    setSelectedProcessKeys,
    dragProcessList,
    setDragProcessList,
    handleAddRoute,
    handleEditRoute,
    handleViewRouteDetail,
    handleDeleteRoute,
    handleRouteSubmit,
    handleProcessSelect,
    handleMoveStep,
  };
};
