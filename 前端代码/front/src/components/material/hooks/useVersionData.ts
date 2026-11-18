import { useState } from 'react';
import { message, Form } from 'antd';
import dayjs from 'dayjs';
import type { VersionRecord, Material } from '../types';

const useVersionData = (initialVersionRecords?: VersionRecord[]) => {
  const [versionRecords, setVersionRecords] = useState<VersionRecord[]>(initialVersionRecords || [
    { key: '1', version: 'V1.1', materialId: 'MAT-001', name: '太阳轮', change: '优化齿形修缘参数，提高传动平稳性', date: '2024-01-15', person: '张三' },
    { key: '2', version: 'V1.1', materialId: 'MAT-004', name: '行星架', change: '调整壁厚，减轻重量5%，优化散热结构', date: '2024-01-10', person: '李四' },
    { key: '3', version: 'V1.0', materialId: 'MAT-003', name: '内齿圈', change: '初始版本，完成工艺验证', date: '2023-12-01', person: '王五' },
    { key: '4', version: 'V1.0', materialId: 'MAT-002', name: '行星轮', change: '初始版本，通过疲劳测试', date: '2023-11-15', person: '赵六' },
    { key: '5', version: 'V1.0', materialId: 'MAT-005', name: '输入轴', change: '初始版本，花键参数优化', date: '2023-10-20', person: '张三' },
  ]);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionForm] = Form.useForm();

  const handleAddVersion = () => {
    versionForm.resetFields();
    setIsVersionModalOpen(true);
  };

  const handleVersionSubmit = (materialData: Material[], updateMaterialVersion: (partNumber: string, newVersion: string) => void) => {
    versionForm.validateFields().then(values => {
      const material = materialData.find(m => m.partNumber === values.materialId);
      if (!material) {
        message.error('未找到该物料');
        return;
      }

      const currentVersion = material.version || 'V1.0';
      const versionParts = currentVersion.replace('V', '').split('.').map(Number);
      const newVersion = `V${versionParts[0]}.${versionParts[1] + 1}`;

      const newVersionRecord: VersionRecord = {
        key: Date.now().toString(),
        version: newVersion,
        materialId: values.materialId,
        name: material.partName,
        change: values.change,
        date: dayjs().format('YYYY-MM-DD'),
        person: values.person,
      };

      setVersionRecords(prev => [newVersionRecord, ...prev]);
      updateMaterialVersion(values.materialId, newVersion);

      message.success(`版本更新成功，新版本：${newVersion}`);
      setIsVersionModalOpen(false);
    }).catch(() => {
      message.warning('请填写完整的版本信息');
    });
  };

  return {
    versionRecords,
    isVersionModalOpen,
    setIsVersionModalOpen,
    versionForm,
    handleAddVersion,
    handleVersionSubmit,
  };
};

export default useVersionData;
