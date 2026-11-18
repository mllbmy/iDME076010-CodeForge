import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Card, Input, Button, Table, Descriptions, Tag, Space, Typography, Divider, InputNumber } from 'antd';
import { RobotOutlined, ScheduleOutlined, HolderOutlined } from '@ant-design/icons';
import { AiStatusOverlay, AiStatusIndicator } from './index';
import { AiErrorBoundary } from './AiErrorBoundary';
import { AiRouteImportConfirm } from './AiRouteImportConfirm';
import { useAiStore } from '@/store/useAiStore';
import type { RouteAiParams } from '@/services/interfaces/IRouteAiService';
import type { RecommendedProcess } from '@/services/interfaces/IRouteAiService';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const { Text } = Typography;

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key'?: string;
}

const SortableRow: React.FC<SortableRowProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'] || '',
  });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, y: transform.y, x: 0 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };
  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

interface RouteAiPanelProps {
  onRouteSelected?: (route: RouteAiParams & { processes: RecommendedProcess[] }) => void;
  existingProcessCount?: number;
}

export const AiRouteRecommender: React.FC<RouteAiPanelProps> = ({ onRouteSelected, existingProcessCount = 0 }) => {
  const { routeResult, aiStatus, loading, recommendRoute } = useAiStore();
  const status = aiStatus.route;
  const isLoading = loading.route;

  const [partName, setPartName] = useState('');
  const [partType, setPartType] = useState('');
  const [editableProcesses, setEditableProcesses] = useState<RecommendedProcess[]>([]);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);

  useEffect(() => {
    if (routeResult) {
      setEditableProcesses([...routeResult.processes]);
    }
  }, [routeResult]);

  const totalEstimatedTime = useMemo(() => {
    return editableProcesses.reduce((sum, p) => sum + parseFloat(p.estimatedTime), 0);
  }, [editableProcesses]);

  const handleRecommend = useCallback(() => {
    if (!partName.trim()) return;
    recommendRoute({ partName: partName.trim(), partType: partType.trim() });
  }, [partName, partType, recommendRoute]);

  const handleEditProcess = useCallback((index: number, field: keyof RecommendedProcess, value: string) => {
    setEditableProcesses((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const handleRemoveProcess = useCallback((index: number) => {
    setEditableProcesses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEditableProcesses((prev) => {
        const oldIndex = prev.findIndex((p) => p.processCode === active.id);
        const newIndex = prev.findIndex((p) => p.processCode === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, moved);
        return next;
      });
    }
  }, []);

  const handleAdoptRoute = useCallback(() => {
    if (existingProcessCount > 0) {
      setImportConfirmOpen(true);
      return;
    }
    if (onRouteSelected) {
      onRouteSelected({ partName, partType, processes: editableProcesses });
    }
  }, [onRouteSelected, partName, partType, editableProcesses, existingProcessCount]);

  const handleImportConfirm = useCallback((_mode: 'overwrite' | 'append') => {
    setImportConfirmOpen(false);
    if (onRouteSelected) {
      onRouteSelected({ partName, partType, processes: editableProcesses });
    }
  }, [onRouteSelected, partName, partType, editableProcesses]);

  const editableColumns = [
    {
      title: '', dataIndex: 'drag', width: 40,
      render: () => <HolderOutlined style={{ cursor: 'move', color: '#999' }} />,
    },
    {
      title: '序号', dataIndex: 'step', width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    { title: '工序名称', dataIndex: 'processName', width: 120 },
    { title: '工序编码', dataIndex: 'processCode', width: 100 },
    {
      title: '预计工时(h)', dataIndex: 'estimatedTime', width: 130,
      render: (_: unknown, record: RecommendedProcess, index: number) => (
        <InputNumber
          min={0.5} step={0.5}
          value={parseFloat(record.estimatedTime)}
          onChange={(val) => handleEditProcess(index, 'estimatedTime', val != null ? `${val}h` : record.estimatedTime)}
          size="small"
        />
      ),
    },
    {
      title: '设备', dataIndex: 'equipment', width: 120,
      render: (_: unknown, record: RecommendedProcess, index: number) => (
        <Input value={record.equipment || ''} onChange={(e) => handleEditProcess(index, 'equipment', e.target.value)} size="small" />
      ),
    },
    {
      title: '描述', dataIndex: 'description',
      render: (_: unknown, record: RecommendedProcess, index: number) => (
        <Input value={record.description} onChange={(e) => handleEditProcess(index, 'description', e.target.value)} size="small" />
      ),
    },
    {
      title: '操作', width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <Button type="link" danger size="small" onClick={() => handleRemoveProcess(index)}>删除</Button>
      ),
    },
  ];

  const sortableIds = useMemo(() => editableProcesses.map((p) => p.processCode), [editableProcesses]);

  return (
    <Card
      title={<Space><RobotOutlined />AI工艺路线推荐</Space>}
      extra={<AiStatusIndicator status={status} />}
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Space>
          <Input placeholder="零件名称（如：齿轮、轴）" value={partName} onChange={(e) => setPartName(e.target.value)} style={{ width: 200 }} />
          <Input placeholder="零件类型" value={partType} onChange={(e) => setPartType(e.target.value)} style={{ width: 160 }} />
          <Button type="primary" icon={<RobotOutlined />} onClick={handleRecommend} loading={isLoading}>推荐</Button>
        </Space>

        <AiErrorBoundary>
          <AiStatusOverlay status={status} loading={isLoading} onRetry={handleRecommend}>
            {routeResult && (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="零件">{routeResult.partName}</Descriptions.Item>
                  <Descriptions.Item label="总工时">{totalEstimatedTime}h</Descriptions.Item>
                  <Descriptions.Item label="置信度">
                    <Tag color={routeResult.confidence >= 0.8 ? 'green' : 'orange'}>
                      {Math.round(routeResult.confidence * 100)}%
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <Card type="inner" title="推荐工序" size="small">
                  <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                      <Table<RecommendedProcess>
                        dataSource={editableProcesses}
                        columns={editableColumns}
                        rowKey="processCode"
                        size="small"
                        pagination={false}
                        components={{ body: { row: SortableRow } }}
                      />
                    </SortableContext>
                  </DndContext>
                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                    <Text type="secondary">总工时: {totalEstimatedTime}h</Text>
                  </div>
                </Card>

                {routeResult.alternativeRoutes.length > 0 && (
                  <>
                    <Divider orientation="left" plain style={{ margin: '8px 0' }}>备选路线</Divider>
                    {routeResult.alternativeRoutes.map((route, i) => (
                      <Card key={i} type="inner" title={`路线${i + 1}: ${route.name}`} size="small">
                        <Table<RecommendedProcess>
                          dataSource={route.processes}
                          columns={[
                            { title: '序号', width: 60, render: (_: unknown, __: unknown, idx: number) => idx + 1 },
                            { title: '工序名称', dataIndex: 'processName', width: 120 },
                            { title: '工序编码', dataIndex: 'processCode', width: 100 },
                            { title: '预计工时', dataIndex: 'estimatedTime', width: 100 },
                            { title: '设备', dataIndex: 'equipment', width: 120, render: (v: string) => v || '-' },
                            { title: '描述', dataIndex: 'description' },
                          ]}
                          rowKey="processCode"
                          size="small"
                          pagination={false}
                        />
                      </Card>
                    ))}
                  </>
                )}

                {onRouteSelected && (
                  <Button type="primary" block icon={<ScheduleOutlined />} onClick={handleAdoptRoute}>
                    采纳此路线
                  </Button>
                )}
              </Space>
            )}
          </AiStatusOverlay>
        </AiErrorBoundary>
      </Space>

      <AiRouteImportConfirm
        open={importConfirmOpen}
        existingProcessCount={existingProcessCount}
        onConfirm={handleImportConfirm}
        onCancel={() => setImportConfirmOpen(false)}
      />
    </Card>
  );
};
