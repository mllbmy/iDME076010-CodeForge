import { useState } from 'react';
import { Modal, App } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { Process } from '../types';
import { generateProcessData } from '../constants';

const defaultProcesses: Process[] = generateProcessData();

export const useProcessData = () => {
  const { message } = App.useApp();
  const [processData, setProcessData] = useState<Process[]>(defaultProcesses);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const handleAddProcess = (processForm: FormInstance) => {
    setIsEditMode(false);
    setSelectedProcess(null);
    processForm.resetFields();
    processForm.setFieldsValue({ status: '启用' });
    setIsProcessModalOpen(true);
  };

  const handleEditProcess = (record: Process, processForm: FormInstance) => {
    setIsEditMode(true);
    setSelectedProcess(record);
    processForm.setFieldsValue(record);
    setIsProcessModalOpen(true);
  };

  const handleDeleteProcess = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工序吗？',
      onOk: () => {
        setProcessData(prev => prev.filter(item => item.key !== key));
        message.success('删除成功');
      }
    });
  };

  const handleProcessSubmit = (processForm: FormInstance) => {
    processForm.validateFields().then((values: Omit<Process, 'key' | 'order' | 'createDate' | 'updateTime'>) => {
      if (isEditMode && selectedProcess) {
        setProcessData(prev => prev.map(item =>
          item.key === selectedProcess.key
            ? { ...item, ...values, updateTime: dayjs().format('YYYY-MM-DD') }
            : item
        ));
        message.success('编辑成功');
      } else {
        const maxOrder = Math.max(...processData.map(p => p.order), 0);
        const newProcess: Process = {
          key: Date.now().toString(),
          ...values,
          processId: values.processId || `PROC-${String(processData.length + 1).padStart(3, '0')}`,
          order: maxOrder + 1,
          createDate: dayjs().format('YYYY-MM-DD'),
          updateTime: dayjs().format('YYYY-MM-DD'),
        };
        setProcessData(prev => [...prev, newProcess]);
        message.success('添加成功');
      }
      setIsProcessModalOpen(false);
    });
  };

  const handleMoveProcess = (key: string, direction: 'up' | 'down') => {
    const currentIndex = processData.findIndex(p => p.key === key);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= processData.length) return;

    const newData = [...processData];
    const currentOrder = newData[currentIndex].order;
    const targetOrder = newData[newIndex].order;

    newData[currentIndex].order = targetOrder;
    newData[newIndex].order = currentOrder;

    setProcessData(newData);
    message.success(`工序已${direction === 'up' ? '上移' : '下移'}`);
  };

  return {
    processData,
    setProcessData,
    isProcessModalOpen,
    setIsProcessModalOpen,
    isEditMode,
    setIsEditMode,
    selectedProcess,
    setSelectedProcess,
    handleAddProcess,
    handleEditProcess,
    handleDeleteProcess,
    handleProcessSubmit,
    handleMoveProcess,
  };
};
