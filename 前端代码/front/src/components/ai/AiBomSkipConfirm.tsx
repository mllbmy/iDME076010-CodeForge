import React from 'react';
import { Modal, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

interface AiBomSkipConfirmProps {
  open: boolean;
  warningCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AiBomSkipConfirm: React.FC<AiBomSkipConfirmProps> = ({
  open,
  warningCount,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title={<span><WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />忽略警告确认</span>}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>确认提交</Button>,
      ]}
    >
      <p>当前BOM存在 {warningCount} 条警告，确认忽略警告继续提交？</p>
    </Modal>
  );
};
