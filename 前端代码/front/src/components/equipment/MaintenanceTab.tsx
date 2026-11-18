import React, { useState } from 'react';
import { Button, Space, Input, Select, Pagination, Modal, Form, App } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EquipmentLedger, MaintenanceRecord } from './types';
import MaintenanceTable from './MaintenanceTable';
import MaintenanceForm from './MaintenanceForm';
import EquipmentDetail from './EquipmentDetail';

const { Option } = Select;
const { Search } = Input;

interface MaintenanceTabProps {
  maintenanceData: MaintenanceRecord[];
  equipmentLedgerData: EquipmentLedger[];
  addMaintenance: (record: MaintenanceRecord) => void;
  updateMaintenance: (key: string, record: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (key: string) => void;
  partsReplaced: { name: string; quantity: number; model: string }[];
  addPart: () => void;
  removePart: (index: number) => void;
  updatePart: (index: number, field: string, value: string | number) => void;
  resetPartsReplaced: (parts?: { name: string; quantity: number; model: string }[]) => void;
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenanceData,
  equipmentLedgerData,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  partsReplaced,
  addPart,
  removePart,
  updatePart,
  resetPartsReplaced,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { message } = App.useApp();
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [form] = Form.useForm();

  const getFilteredData = () => {
    let filtered = [...maintenanceData];
    if (searchText) {
      filtered = filtered.filter(item =>
        item.equipmentName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.planId.toLowerCase().includes(searchText.toLowerCase())
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
    resetPartsReplaced();
    setIsModalOpen(true);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      maintenanceTime: record.maintenanceTime ? dayjs(record.maintenanceTime) : null,
    });
    resetPartsReplaced(record.partsReplaced || []);
    setIsModalOpen(true);
  };

  const handleViewDetail = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (key: string) => {
    deleteMaintenance(key);
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
        maintenanceTime: values.maintenanceTime?.format('YYYY-MM-DD HH:mm'),
        partsReplaced: partsReplaced,
        key: isEditMode ? selectedRecord?.key : Date.now().toString(),
      };

      if (isEditMode && selectedRecord?.key) {
        updateMaintenance(selectedRecord.key, formData);
      } else {
        const equipment = equipmentLedgerData.find(eq => eq.equipmentNumber === formData.equipmentId);
        const newRecord = {
          ...formData,
          planId: `MP-${String(maintenanceData.length + 1).padStart(3, '0')}`,
          equipmentName: equipment?.equipmentName || '',
        };
        addMaintenance(newRecord as MaintenanceRecord);
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加保养记录</Button>
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
      <MaintenanceTable
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
          <MaintenanceForm
            equipmentList={equipmentLedgerData}
            partsReplaced={partsReplaced}
            addPart={addPart}
            removePart={removePart}
            updatePart={updatePart}
          />
        </Form>
      </Modal>

      <Modal title="详情" open={isDetailModalOpen} onCancel={() => setIsDetailModalOpen(false)} footer={null} width={700}>
        <EquipmentDetail record={selectedRecord} tabKey="equipment-maintenance" />
      </Modal>
    </div>
  );
};

export default MaintenanceTab;
