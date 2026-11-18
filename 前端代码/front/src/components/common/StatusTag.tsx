import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
  type?: 'equipment' | 'maintenance' | 'repair' | 'material';
}

const STATUS_CONFIG: Record<string, Record<string, { color: string; text?: string }>> = {
  equipment: {
    '运行中': { color: 'green' },
    '待机': { color: 'blue' },
    '维护中': { color: 'orange' },
    '故障': { color: 'red' },
    '报废': { color: 'default' },
  },
  maintenance: {
    '已完成': { color: 'green' },
    '进行中': { color: 'blue' },
    '待处理': { color: 'orange' },
    '已取消': { color: 'default' },
  },
  repair: {
    '已完成': { color: 'green' },
    '进行中': { color: 'blue' },
    '待处理': { color: 'orange' },
    '已取消': { color: 'default' },
  },
  material: {
    active: { color: 'green', text: '在用' },
    inactive: { color: 'default', text: '停用' },
    inspection: { color: 'orange', text: '待检' },
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'equipment' }) => {
  const config = STATUS_CONFIG[type]?.[status];
  return (
    <Tag color={config?.color || 'default'}>
      {config?.text || status}
    </Tag>
  );
};

export default StatusTag;
