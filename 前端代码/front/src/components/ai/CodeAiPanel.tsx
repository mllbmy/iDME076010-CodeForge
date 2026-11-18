import React, { useCallback, useState } from 'react';
import { Card, Input, Select, Button, Descriptions, Tag, Space, Typography, Divider } from 'antd';
import { RobotOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { useAiStore } from '@/store/useAiStore';
import type { CodeType } from '@/services/interfaces/ICodeAiService';

const { Text } = Typography;

const codeTypeOptions: { value: CodeType; label: string }[] = [
  { value: 'equipment', label: '设备编码' },
  { value: 'material', label: '物料编码' },
  { value: 'process', label: '工序编码' },
];

interface CodeAiPanelProps {
  defaultType?: CodeType;
  onCodeGenerated?: (code: string) => void;
}

export const AiCodeGenerator: React.FC<CodeAiPanelProps> = ({
  defaultType = 'equipment',
  onCodeGenerated,
}) => {
  const { codeResult, aiStatus, loading, generateCode, codeConflictError, codeFormatError } = useAiStore();
  const status = aiStatus.code;
  const isLoading = loading.code;

  const [name, setName] = useState('');
  const [type, setType] = useState<CodeType>(defaultType);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!name.trim()) return;
    generateCode({ name: name.trim(), type });
  }, [name, type, generateCode]);

  const handleCopy = useCallback(() => {
    if (!codeResult) return;
    navigator.clipboard.writeText(codeResult.primaryCode.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [codeResult]);

  const handleAccept = useCallback(() => {
    if (codeResult && onCodeGenerated) {
      onCodeGenerated(codeResult.primaryCode.code);
    }
  }, [codeResult, onCodeGenerated]);

  return (
    <Card
      title={<Space><RobotOutlined />AI编码生成</Space>}
      extra={<AiStatusIndicator status={status} />}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Space.Compact style={{ width: '100%' }}>
          <Select value={type} onChange={setType} options={codeTypeOptions} style={{ width: 120 }} />
          <Input
            placeholder="输入名称（如：滚齿机、齿轮）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleGenerate}
            style={{ flex: 1 }}
          />
          <Button type="primary" icon={<RobotOutlined />} onClick={handleGenerate} loading={isLoading}>
            生成
          </Button>
        </Space.Compact>

        <AiErrorBoundary>
          <AiStatusOverlay status={status} loading={isLoading} onRetry={handleGenerate}>
            {codeResult && (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <div style={{
                  background: codeConflictError ? '#fff2f0' : codeFormatError ? '#fff2f0' : '#f6ffed',
                  border: `1px solid ${codeConflictError ? '#ffccc7' : codeFormatError ? '#ffccc7' : '#b7eb8f'}`,
                  borderRadius: 6, padding: 12,
                }}>
                  <Space size={8} style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 20, fontFamily: 'monospace' }}>{codeResult.primaryCode.code}</Text>
                    <Button type="text" size="small" icon={copied ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />} onClick={handleCopy} />
                  </Space>
                  {codeConflictError && <div style={{ color: '#ff4d4f', marginBottom: 8 }}>{codeConflictError}</div>}
                  {codeFormatError && <div style={{ color: '#ff4d4f', marginBottom: 8 }}>{codeFormatError}</div>}
                  <div>
                    {codeResult.primaryCode.segments.map((seg, i) => (
                      <Tag key={i} style={{ margin: '0 4px 4px 0' }}>{seg.label}: {seg.value}</Tag>
                    ))}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>规则: {codeResult.ruleDescription}</Text>
                </div>

                <Descriptions column={2} size="small">
                  <Descriptions.Item label="合规评分">
                    <Tag color={codeResult.complianceScore >= 0.9 ? 'green' : 'orange'}>
                      {Math.round(codeResult.complianceScore * 100)}%
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="编码规则">{codeResult.primaryCode.rule}</Descriptions.Item>
                </Descriptions>

                {codeResult.alternatives.length > 0 && (
                  <>
                    <Divider orientation="left" plain style={{ margin: '8px 0' }}>备选编码</Divider>
                    <Space wrap>
                      {codeResult.alternatives.map((alt, i) => (
                        <Tag key={i} style={{ fontSize: 13, fontFamily: 'monospace' }}>{alt.code}</Tag>
                      ))}
                    </Space>
                  </>
                )}

                {onCodeGenerated && (
                  <Button type="primary" block onClick={handleAccept}>采纳此编码</Button>
                )}
              </Space>
            )}
          </AiStatusOverlay>
        </AiErrorBoundary>
      </Space>
    </Card>
  );
};
