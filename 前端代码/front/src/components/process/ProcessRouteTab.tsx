import React, { useMemo, useState } from 'react';
import { Button, Space, Input, Select, Card, Pagination, Modal, App, Row, Col, Tag, Table, Timeline, Divider } from 'antd';
import { PlusOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { Key } from 'react';
import { Form } from 'antd';
import type { Process, ProcessRoute, ProcessStep } from './types';
import ProcessRouteTable from './ProcessRouteTable';
import ProcessRouteForm from './ProcessRouteForm';
import { AiRouteRecommender } from '@/components/ai';
import { BlockchainCertifyPanel, BlockchainVerifyPanel, BlockchainTraceTimeline } from '@/components/blockchain';
import { generateDataHash } from '@/store/useBlockchainStore';

const { Option } = Select;
const { Search } = Input;

interface ProcessRouteTabProps {
  processRouteData: ProcessRoute[];
  processData: Process[];
  isRouteModalOpen: boolean;
  isRouteDetailModalOpen: boolean;
  isEditMode: boolean;
  selectedRoute: ProcessRoute | null;
  selectedProcessKeys: Key[];
  dragProcessList: ProcessStep[];
  onAddRoute: (form: FormInstance) => void;
  onEditRoute: (record: ProcessRoute, form: FormInstance) => void;
  onDeleteRoute: (key: string) => void;
  onRouteSubmit: (form: FormInstance) => void;
  onViewRouteDetail: (record: ProcessRoute) => void;
  setIsRouteModalOpen: (open: boolean) => void;
  setIsRouteDetailModalOpen: (open: boolean) => void;
  onProcessSelect: (targetKeys: Key[], direction: TransferDirection, moveKeys: Key[]) => void;
  onMoveStep: (index: number, direction: 'up' | 'down') => void;
}

const ProcessRouteTab: React.FC<ProcessRouteTabProps> = ({
  processRouteData,
  processData,
  isRouteModalOpen,
  isRouteDetailModalOpen,
  isEditMode,
  selectedRoute,
  selectedProcessKeys,
  dragProcessList,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
  onRouteSubmit,
  onViewRouteDetail,
  setIsRouteModalOpen,
  setIsRouteDetailModalOpen,
  onProcessSelect,
  onMoveStep,
}) => {
  const { message } = App.useApp();
  const [routeForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredRouteData = useMemo(() => {
    let filtered = processRouteData;

    if (searchText) {
      filtered = filtered.filter(r =>
        (r.routeId || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (r.routeName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (r.product || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    return filtered;
  }, [processRouteData, searchText, statusFilter]);

  const getCurrentPageData = (data: ProcessRoute[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div>
      <AiRouteRecommender />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{processRouteData.length}</div>
            <div style={{ color: '#666' }}>工艺路线总数</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{processRouteData.filter(r => r.status === '启用').length}</div>
            <div style={{ color: '#666' }}>启用路线</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>{new Set(processRouteData.map(r => r.product)).size}</div>
            <div style={{ color: '#666' }}>关联产品数</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>{processRouteData.reduce((sum, r) => sum + r.processList.reduce((s, p) => s + p.standardHours, 0), 0).toFixed(1)}h</div>
            <div style={{ color: '#666' }}>总工艺工时</div>
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => onAddRoute(routeForm)}>
            添加工艺路线
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => message.success('刷新成功')}>
            刷新
          </Button>
        </Space>
        <Space>
          <Search
            placeholder="搜索路线ID/名称/产品"
            allowClear
            style={{ width: 250 }}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
          />
          <Select
            style={{ width: 120 }}
            placeholder="状态筛选"
            allowClear
            onChange={setStatusFilter}
            value={statusFilter}
          >
            <Option value="启用">启用</Option>
            <Option value="禁用">禁用</Option>
          </Select>
        </Space>
      </Space>

      <Card title="工艺路线列表">
        <ProcessRouteTable
          dataSource={getCurrentPageData(filteredRouteData)}
          onEdit={(record) => onEditRoute(record, routeForm)}
          onDelete={onDeleteRoute}
          onViewDetail={onViewRouteDetail}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredRouteData.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条记录`}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </Card>

      <Modal
        title={isEditMode ? '编辑工艺路线' : '添加工艺路线'}
        open={isRouteModalOpen}
        onOk={() => onRouteSubmit(routeForm)}
        onCancel={() => setIsRouteModalOpen(false)}
        width={900}
        destroyOnHidden
      >
        <ProcessRouteForm
          form={routeForm}
          processData={processData}
          selectedProcessKeys={selectedProcessKeys}
          dragProcessList={dragProcessList}
          onProcessSelect={onProcessSelect}
          onMoveStep={onMoveStep}
        />
      </Modal>

      <Modal
        title={`工艺路线详情 - ${selectedRoute?.routeName}`}
        open={isRouteDetailModalOpen}
        onCancel={() => setIsRouteDetailModalOpen(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setIsRouteDetailModalOpen(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRoute && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ color: '#666' }}>工艺路线ID</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{selectedRoute.routeId}</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ color: '#666' }}>版本</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}><Tag color="purple">{selectedRoute.version}</Tag></div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ color: '#666' }}>所属产品</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{selectedRoute.product}</div>
                </Card>
              </Col>
            </Row>

            <Card title="工序流程" style={{ marginBottom: 16 }}>
              <Timeline
                items={selectedRoute.processList.map(step => ({
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        步骤{step.step}: {step.processName}
                      </div>
                      <div style={{ color: '#666', marginTop: 4 }}>
                        <Space split={<Divider type="vertical" />}>
                          <span>车间: {step.workshop}</span>
                          <span>设备: {step.equipment}</span>
                          <span>标准工时: {step.standardHours}小时</span>
                        </Space>
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>

            <Card
              title="版本历史"
              extra={<HistoryOutlined />}
            >
              <Table
                size="small"
                columns={[
                  { title: '版本', dataIndex: 'version', key: 'version', width: 80, render: (v: string) => <Tag color="purple">{v}</Tag> },
                  { title: '变更内容', dataIndex: 'changeContent', key: 'changeContent' },
                  { title: '变更日期', dataIndex: 'changeDate', key: 'changeDate', width: 120 },
                  { title: '变更人', dataIndex: 'changePerson', key: 'changePerson', width: 100 },
                ]}
                dataSource={selectedRoute.history}
                pagination={false}
                rowKey="key"
              />
            </Card>

            <Divider>区块链存证</Divider>
            <BlockchainCertifyPanel
              dataType="process_route"
              dataId={selectedRoute?.routeId || ''}
              dataName={selectedRoute?.routeName || ''}
              payload={selectedRoute ? {
                routeId: selectedRoute.routeId,
                routeName: selectedRoute.routeName,
                version: selectedRoute.version,
                processList: selectedRoute.processList.map(p => ({ processId: p.processId, processName: p.processName })),
              } : {}}
            />
            <BlockchainVerifyPanel
              dataType="process_route"
              dataId={selectedRoute?.routeId || ''}
              dataName={selectedRoute?.routeName || ''}
              dataHash={selectedRoute ? generateDataHash({
                routeId: selectedRoute.routeId,
                version: selectedRoute.version,
                processCount: selectedRoute.processList.length,
              }) : ''}
            />
            <BlockchainTraceTimeline
              dataType="process_route"
              dataId={selectedRoute?.routeId || ''}
              dataName={selectedRoute?.routeName || ''}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProcessRouteTab;
