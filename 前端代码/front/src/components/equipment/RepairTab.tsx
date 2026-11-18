import React, { useState } from 'react';
import { Button, Space, Input, Select, Pagination, Modal, Form, App } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EquipmentLedger, RepairRecord } from './types';
import RepairTable from './RepairTable';
import RepairForm from './RepairForm';
import EquipmentDetail from './EquipmentDetail';

const { Option } = Select;
const { Search } = Input;

interface RepairTabProps {
  repairData: RepairRecord[];
  equipmentLedgerData: EquipmentLedger[];
  addRepair: (record: RepairRecord) => void;
  updateRepair: (key: string, record: Partial<RepairRecord>) => void;
  deleteRepair: (key: string) => void;
}

const RepairTab: React.FC<RepairTabProps> = ({
  repairData,
  equipmentLedgerData,
  addRepair,
  updateRepair,
  deleteRepair,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const { message } = App.useApp();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const getFilteredData = () => {
    let filtered = [...repairData];
    if (searchText) {
      filtered = filtered.filter(item =>
        item.equipmentName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.workOrderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
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
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: RepairRecord) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      reportTime: record.reportTime ? dayjs(record.reportTime) : null,
    });
    setIsModalOpen(true);
  };

  const handleViewDetail = (record: RepairRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (key: string) => {
    deleteRepair(key);
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilterStatus('');
    setCurrentPage(1);
    message.success('刷新成功');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = {
        ...values,
        reportTime: values.reportTime?.format('YYYY-MM-DD HH:mm'),
        key: isEditMode ? selectedRecord?.key : Date.now().toString(),
      };

      if (isEditMode) {
        updateRepair(selectedRecord?.key, formData);
      } else {
        const equipment = equipmentLedgerData.find(eq => eq.equipmentNumber === formData.equipmentId);
        const newRecord = {
          ...formData,
          equipmentName: equipment?.equipmentName || '',
        };
        addRepair(newRecord as RepairRecord);
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加维修记录</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
        </Space>
        <Space>
          <Search placeholder="搜索设备名称" allowClear style={{ width: 200 }} onSearch={setSearchText} />
          <Select placeholder="状态筛选" allowClear style={{ width: 120 }} onChange={setFilterStatus}>
            <Option value="已完成">已完成</Option>
            <Option value="进行中">进行中</Option>
            <Option value="待处理">待处理</Option>
          </Select>
        </Space>
      </Space>
      <RepairTable
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
          <RepairForm equipmentList={equipmentLedgerData} />
        </Form>
      </Modal>

      <Modal title="详情" open={isDetailModalOpen} onCancel={() => setIsDetailModalOpen(false)} footer={null} width={700}>
        <EquipmentDetail record={selectedRecord} tabKey="equipment-repair" />
      </Modal>
    </div>
  );
};

export default RepairTab;
