import React, { useMemo, useState } from 'react';
import { Button, Space, Input, Select, Card, Pagination, Modal, App, Row, Col } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { Process } from './types';
import ProcessTable from './ProcessTable';
import ProcessForm from './ProcessForm';
import { Form } from 'antd';

const { Option } = Select;
const { Search } = Input;

interface ProcessConfigTabProps {
  processData: Process[];
  isProcessModalOpen: boolean;
  isEditMode: boolean;
  selectedProcess?: Process | null;
  onAddProcess: (form: FormInstance) => void;
  onEditProcess: (record: Process, form: FormInstance) => void;
  onDeleteProcess: (key: string) => void;
  onProcessSubmit: (form: FormInstance) => void;
  onMoveProcess: (key: string, direction: 'up' | 'down') => void;
  setIsProcessModalOpen: (open: boolean) => void;
}

const ProcessConfigTab: React.FC<ProcessConfigTabProps> = ({
  processData,
  isProcessModalOpen,
  isEditMode,
  onAddProcess,
  onEditProcess,
  onDeleteProcess,
  onProcessSubmit,
  onMoveProcess,
  setIsProcessModalOpen,
}) => {
  const { message } = App.useApp();
  const [processForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProcessData = useMemo(() => {
    let filtered = processData;

    if (searchText) {
      filtered = filtered.filter(p =>
        (p.processId || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (p.processName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (p.processDescription || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [processData, searchText, statusFilter]);

  const getCurrentPageData = (data: Process[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{processData.length}</div>
            <div style={{ color: '#666' }}>工序总数</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{processData.filter(p => p.status === '启用').length}</div>
            <div style={{ color: '#666' }}>启用工序</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>{new Set(processData.map(p => p.workshop)).size}</div>
            <div style={{ color: '#666' }}>涉及车间</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>{processData.reduce((sum, p) => sum + p.standardHours, 0).toFixed(1)}h</div>
            <div style={{ color: '#666' }}>总标准工时</div>
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => onAddProcess(processForm)}>
            添加工序
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => message.success('刷新成功')}>
            刷新
          </Button>
        </Space>
        <Space>
          <Search
            placeholder="搜索工序ID/名称/描述"
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

      <Card title="工序列表">
        <ProcessTable
          dataSource={getCurrentPageData(filteredProcessData)}
          onEdit={(record) => onEditProcess(record, processForm)}
          onDelete={onDeleteProcess}
          onMove={onMoveProcess}
          totalData={filteredProcessData}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProcessData.length}
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
        title={isEditMode ? '编辑工序' : '添加工序'}
        open={isProcessModalOpen}
        onOk={() => onProcessSubmit(processForm)}
        onCancel={() => setIsProcessModalOpen(false)}
        width={700}
        destroyOnHidden
      >
        <ProcessForm form={processForm} />
      </Modal>
    </div>
  );
};

export default ProcessConfigTab;
