import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, Pagination, Modal, Form, App, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, ReloadOutlined, BarChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EquipmentLedger, ExtAttr, EquipmentStats } from './types';
import EquipmentTable from './EquipmentTable';
import EquipmentForm from './EquipmentForm';
import EquipmentDetail from './EquipmentDetail';

const { Option } = Select;
const { Search } = Input;

interface EquipmentLedgerTabProps {
  equipmentLedgerData: EquipmentLedger[];
  addEquipment: (record: EquipmentLedger) => void;
  updateEquipment: (key: string, record: Partial<EquipmentLedger>) => void;
  deleteEquipment: (key: string) => void;
  extAttrs: ExtAttr[];
  addExtAttr: () => void;
  removeExtAttr: (index: number) => void;
  updateExtAttr: (index: number, field: 'key' | 'value', value: string) => void;
  resetExtAttrs: (attrs?: ExtAttr[]) => void;
  getEquipmentStats: () => EquipmentStats;
}

const EquipmentLedgerTab: React.FC<EquipmentLedgerTabProps> = ({
  equipmentLedgerData,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  extAttrs,
  addExtAttr,
  removeExtAttr,
  updateExtAttr,
  resetExtAttrs,
  getEquipmentStats,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const { message } = App.useApp();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EquipmentLedger | null>(null);
  const [form] = Form.useForm();

  const getFilteredData = () => {
    let filtered = [...equipmentLedgerData];
    if (searchText) {
      filtered = filtered.filter(item =>
        item.equipmentName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.equipmentNumber.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    if (filterLocation) {
      filtered = filtered.filter(item => item.equipmentLocal.includes(filterLocation));
    }
    return filtered;
  };

  const getCurrentPageData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  };

  const getTotalCount = () => getFilteredData().length;

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedRecord(null);
    resetExtAttrs();
    setIsModalOpen(true);
  };

  const handleEdit = (record: EquipmentLedger) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    resetExtAttrs(record.extAttrMap || []);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && selectedRecord) {
        form.setFieldsValue({
          ...selectedRecord,
          productionDate: selectedRecord.productionDate ? dayjs(selectedRecord.productionDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, selectedRecord, form]);

  const handleViewDetail = (record: EquipmentLedger) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (key: string) => {
    deleteEquipment(key);
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilterStatus('');
    setFilterLocation('');
    setCurrentPage(1);
    message.success('刷新成功');
  };

  const handleShowStats = () => {
    setIsStatModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = {
        ...values,
        productionDate: values.productionDate?.format('YYYY-MM-DD'),
        extAttrMap: extAttrs,
        key: isEditMode ? selectedRecord?.key : Date.now().toString(),
      };

      if (isEditMode && selectedRecord?.key) {
        updateEquipment(selectedRecord.key, formData);
      } else {
        addEquipment(formData as EquipmentLedger);
      }
      setIsModalOpen(false);
    });
  };

  const renderStatModal = () => {
    const stats = getEquipmentStats();
    return (
      <div>
        <Card title="按厂家统计" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {Object.entries(stats.byManufacturer).map(([key, value]) => (
              <Col span={8} key={key}>
                <Statistic title={key} value={value as number} suffix="台" />
              </Col>
            ))}
          </Row>
        </Card>
        <Card title="按品牌统计" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {Object.entries(stats.byBrand).map(([key, value]) => (
              <Col span={8} key={key}>
                <Statistic title={key} value={value as number} suffix="台" />
              </Col>
            ))}
          </Row>
        </Card>
        <Card title="按位置统计" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {Object.entries(stats.byLocation).map(([key, value]) => (
              <Col span={8} key={key}>
                <Statistic title={key} value={value as number} suffix="台" />
              </Col>
            ))}
          </Row>
        </Card>
        <Card title="按状态统计">
          <Row gutter={16}>
            {Object.entries(stats.byStatus).map(([key, value]) => (
              <Col span={6} key={key}>
                <Statistic title={key} value={value as number} suffix="台" />
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加设备</Button>
          <Button icon={<BarChartOutlined />} onClick={handleShowStats}>统计分析</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
        </Space>
        <Space>
          <Search placeholder="搜索设备编码/名称" allowClear style={{ width: 200 }} onSearch={setSearchText} />
          <Select placeholder="状态筛选" allowClear style={{ width: 120 }} onChange={setFilterStatus}>
            <Option value="运行中">运行中</Option>
            <Option value="待机">待机</Option>
            <Option value="维护中">维护中</Option>
            <Option value="故障">故障</Option>
          </Select>
          <Input placeholder="位置筛选" allowClear style={{ width: 120 }} onChange={e => setFilterLocation(e.target.value)} />
        </Space>
      </Space>
      <EquipmentTable
        dataSource={getCurrentPageData()}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={getTotalCount()}
        onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
        style={{ marginTop: 16, textAlign: 'right' }}
        showSizeChanger
        showQuickJumper
        showTotal={total => `共 ${total} 条`}
      />

      <Modal title={isEditMode ? '编辑' : '新增'} open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)} width={800} destroyOnHidden>
        <Form form={form} layout="vertical">
          <EquipmentForm
            extAttrs={extAttrs}
            addExtAttr={addExtAttr}
            removeExtAttr={removeExtAttr}
            updateExtAttr={updateExtAttr}
          />
        </Form>
      </Modal>

      <Modal title="详情" open={isDetailModalOpen} onCancel={() => setIsDetailModalOpen(false)} footer={null} width={700}>
        <EquipmentDetail record={selectedRecord} tabKey="equipment-ledger" />
      </Modal>

      <Modal title="设备统计分析" open={isStatModalOpen} onCancel={() => setIsStatModalOpen(false)} footer={null} width={800}>
        {renderStatModal()}
      </Modal>
    </div>
  );
};

export default EquipmentLedgerTab;
