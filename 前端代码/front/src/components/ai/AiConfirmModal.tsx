import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, RobotOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface AiConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  aiSuggestion?: string;
  confidence?: number;
  loading?: boolean;
}

export const AiConfirmModal: React.FC<AiConfirmModalProps> = ({
  open,
  onConfirm,
  onCancel,
  title = 'AI建议确认',
  description = 'AI已生成智能建议，是否采纳？',
  aiSuggestion,
  confidence,
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>
            采纳建议
          </Button>
        </Space>
      }
      width={480}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Space>
          <ExclamationCircleOutlined style={{ fontSize: 20, color: '#faad14' }} />
          <Text strong style={{ fontSize: 16 }}>{title}</Text>
        </Space>
        <Text type="secondary">{description}</Text>
        {aiSuggestion && (
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: '12px 16px' }}>
            <Space size={4} style={{ marginBottom: 4 }}>
              <RobotOutlined style={{ color: '#52c41a' }} />
              <Text strong style={{ color: '#52c41a' }}>AI建议</Text>
              {confidence !== undefined && (
                <Text type="secondary" style={{ fontSize: 12 }}>(置信度: {Math.round(confidence * 100)}%)</Text>
              )}
            </Space>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{aiSuggestion}</Paragraph>
          </div>
        )}
      </Space>
    </Modal>
  );
};

interface AiConfirmLightProps {
  suggestion: string;
  confidence?: number;
  onAccept: () => void;
  onReject: () => void;
}

export const AiConfirmLight: React.FC<AiConfirmLightProps> = ({
  suggestion,
  confidence,
  onAccept,
  onReject,
}) => {
  return (
    <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: '8px 12px', margin: '8px 0' }}>
      <Space size={4} style={{ marginBottom: 4 }}>
        <RobotOutlined style={{ color: '#52c41a' }} />
        <Text strong style={{ color: '#52c41a', fontSize: 13 }}>AI建议</Text>
        {confidence !== undefined && (
          <Text type="secondary" style={{ fontSize: 11 }}>({Math.round(confidence * 100)}%)</Text>
        )}
      </Space>
      <Paragraph style={{ margin: '4px 0 8px', fontSize: 13 }}>{suggestion}</Paragraph>
      <Space size={8}>
        <Button type="primary" size="small" onClick={onAccept}>采纳</Button>
        <Button size="small" onClick={onReject}>忽略</Button>
      </Space>
    </div>
  );
};
