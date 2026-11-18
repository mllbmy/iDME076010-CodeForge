import React from 'react';
import { Modal, Space, Button } from 'antd';

interface AiRouteImportConfirmProps {
  open: boolean;
  existingProcessCount: number;
  onConfirm: (mode: 'overwrite' | 'append') => void;
  onCancel: () => void;
}

export const AiRouteImportConfirm: React.FC<AiRouteImportConfirmProps> = ({
  open,
  existingProcessCount,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title="导入工艺路线确认"
      onCancel={onCancel}
      footer={null}
    >
      <p>目标物料已有 {existingProcessCount} 道工序</p>
      <Space>
        <Button type="primary" danger onClick={() => onConfirm('overwrite')}>覆盖</Button>
        <Button type="primary" onClick={() => onConfirm('append')}>追加</Button>
        <Button onClick={onCancel}>取消</Button>
      </Space>
    </Modal>
  );
};
