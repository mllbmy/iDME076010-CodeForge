import React, { useState, useCallback } from 'react';
import { FloatButton, Drawer, Input, Button, Space, Typography, Divider, List, Tag, Badge } from 'antd';
import { RobotOutlined, SendOutlined, ThunderboltOutlined, ToolOutlined, ScheduleOutlined, CheckCircleOutlined, BarChartOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAiStore } from '@/store/useAiStore';

const { Text, Paragraph } = Typography;

interface QuickAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'equipment', label: '设备健康诊断', icon: <ToolOutlined />, route: '/equipment', description: 'AI分析设备状态，预测故障风险' },
  { key: 'code', label: '智能编码生成', icon: <ThunderboltOutlined />, route: '/material', description: '输入名称，AI自动生成合规编码' },
  { key: 'route', label: '工艺路线推荐', icon: <ScheduleOutlined />, route: '/process', description: '选择零件，AI推荐标准工序' },
  { key: 'bom', label: 'BOM结构校验', icon: <CheckCircleOutlined />, route: '/material', description: 'AI检查BOM父子关系与数量' },
  { key: 'insight', label: '数据洞察分析', icon: <BarChartOutlined />, route: '/reports', description: 'AI解读报表，发现异常趋势' },
  { key: 'inventory', label: '库存智能预警', icon: <WarningOutlined />, route: '/material', description: 'AI预测断货风险，建议补货' },
];

export const AiAssistantFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { aiStatus } = useAiStore();

  const availableCount = Object.values(aiStatus as Record<string, { available: boolean }>).filter((s) => s.available).length;

  const handleQuickAction = useCallback((action: QuickAction) => {
    setOpen(false);
    navigate(action.route);
  }, [navigate]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    const lower = inputValue.toLowerCase();
    const matched = QUICK_ACTIONS.find(
      (a) => a.label.includes(lower) || a.key.includes(lower) || a.description.includes(lower),
    );
    if (matched) {
      setOpen(false);
      navigate(matched.route);
    }
    setInputValue('');
  }, [inputValue, navigate]);

  return (
    <>
      <Badge count={availableCount} offset={[-4, 4]}>
        <FloatButton
          icon={<RobotOutlined />}
          type="primary"
          onClick={() => setOpen(true)}
          tooltip="AI工业助手"
          style={{ width: 52, height: 52 }}
        />
      </Badge>

      <Drawer
        title={<Space><RobotOutlined style={{ color: '#1677ff' }} />AI工业助手</Space>}
        placement="right"
        width={380}
        open={open}
        onClose={() => setOpen(false)}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Paragraph type="secondary">
            你好！我是工业智造AI助手，可以帮你分析设备、生成编码、推荐工艺、校验BOM等。
          </Paragraph>

          <Divider orientation="left" plain style={{ margin: 0 }}>快捷功能</Divider>

          <List
            grid={{ column: 2 }}
            dataSource={QUICK_ACTIONS}
            renderItem={(action) => (
              <List.Item style={{ border: 'none', padding: '4px 8px' }}>
                <Button
                  block
                  onClick={() => handleQuickAction(action)}
                  style={{ height: 'auto', padding: '8px 4px', textAlign: 'left' }}
                >
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <Space size={4}>
                      {action.icon}
                      <Text strong style={{ fontSize: 12 }}>{action.label}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 11 }}>{action.description}</Text>
                  </Space>
                </Button>
              </List.Item>
            )}
          />

          <Divider orientation="left" plain style={{ margin: 0 }}>AI状态</Divider>

          <Space wrap>
            {Object.entries(aiStatus as Record<string, { available: boolean }>).map(([key, status]) => (
              <Tag key={key} color={status.available ? 'green' : 'red'}>
                {key === 'equipment' ? '设备' : key === 'code' ? '编码' : key === 'route' ? '路线' : key === 'bom' ? 'BOM' : key}
                {status.available ? '✓' : '✗'}
              </Tag>
            ))}
          </Space>

          <Divider style={{ margin: 0 }} />

          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="输入问题或功能关键词..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
          </Space.Compact>
        </Space>
      </Drawer>
    </>
  );
};
