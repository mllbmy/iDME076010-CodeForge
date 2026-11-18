import { Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { EquipmentLedger, MaintenanceRecord, RepairRecord } from './types';

export const STATUS_OPTIONS = [
  { label: '运行中', value: '运行中' },
  { label: '待机', value: '待机' },
  { label: '维护中', value: '维护中' },
  { label: '故障', value: '故障' },
];

export const MAINTENANCE_STATUS_OPTIONS = [
  { label: '已完成', value: '已完成' },
  { label: '进行中', value: '进行中' },
  { label: '待处理', value: '待处理' },
];

export const EQUIPMENT_TYPE_OPTIONS = [
  { label: '年限平均法', value: '年限平均法' },
  { label: '工作量法', value: '工作量法' },
  { label: '双倍余额递减法', value: '双倍余额递减法' },
  { label: '年数总和法', value: '年数总和法' },
];

export const MAINTENANCE_TYPE_OPTIONS = [
  { label: '日常保养', value: '日常保养' },
  { label: '定期保养', value: '定期保养' },
  { label: '精密保养', value: '精密保养' },
  { label: '运行时长保养', value: '运行时长保养' },
];

export const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string }> = {
    '运行中': { color: 'green' },
    '待机': { color: 'blue' },
    '维护中': { color: 'orange' },
    '故障': { color: 'red' },
    '已完成': { color: 'green' },
    '进行中': { color: 'blue' },
    '待处理': { color: 'orange' },
  };
  return <Tag color={statusMap[status]?.color || 'default'}>{status}</Tag>;
};

export const getEquipmentLedgerColumns = (
  onViewDetail: (record: EquipmentLedger) => void,
  onEdit: (record: EquipmentLedger) => void,
  onDelete: (key: string) => void,
): ColumnsType<EquipmentLedger> => [
  {
    title: '设备编码',
    dataIndex: 'equipmentNumber',
    key: 'equipmentNumber',
    width: 120,
    fixed: 'left',
    render: (text: string, record: EquipmentLedger) => (
      <span>
        {text}
        {record.key.startsWith('priority-') && <span className="priority-badge">⭐ 优先</span>}
      </span>
    ),
  },
  { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName', width: 120, fixed: 'left' },
  { title: '品牌', dataIndex: 'brand', key: 'brand', width: 100 },
  { title: '生产厂家', dataIndex: 'manufacturerFactory', key: 'manufacturerFactory', width: 120 },
  { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 100 },
  { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', width: 100 },
  { title: '规格型号', dataIndex: 'modelSpecifications', key: 'modelSpecifications', width: 180, ellipsis: true },
  { title: '使用年限', dataIndex: 'serverLife', key: 'serverLife', width: 80, render: (v: number) => `${v}年` },
  { title: '折旧方式', dataIndex: 'depreciationMethod', key: 'depreciationMethod', width: 100 },
  { title: '位置', dataIndex: 'equipmentLocal', key: 'equipmentLocal', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: getStatusTag },
  { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
  { title: '负责人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 80 },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_: unknown, record: EquipmentLedger) => (
      <Space size="small">
        <Button icon={<EyeOutlined />} size="small" onClick={() => onViewDetail(record)} title="查看详情" />
        <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} title="编辑" />
        <Popconfirm title="确定删除此设备吗？" onConfirm={() => onDelete(record.key)}>
          <Button danger icon={<DeleteOutlined />} size="small" title="删除" />
        </Popconfirm>
      </Space>
    ),
  },
];

export const getMaintenanceColumns = (
  onViewDetail: (record: MaintenanceRecord) => void,
  onEdit: (record: MaintenanceRecord) => void,
  onDelete: (key: string) => void,
): ColumnsType<MaintenanceRecord> => [
  { title: '计划ID', dataIndex: 'planId', key: 'planId', width: 100 },
  { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName', width: 120 },
  { title: '保养类型', dataIndex: 'maintenanceType', key: 'maintenanceType', width: 100 },
  { title: '保养时间', dataIndex: 'maintenanceTime', key: 'maintenanceTime', width: 140 },
  { title: '保养内容', dataIndex: 'maintenanceContent', key: 'maintenanceContent', width: 200, ellipsis: true },
  { title: '维护人员', dataIndex: 'maintainer', key: 'maintainer', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: getStatusTag },
  { title: '费用', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => `¥${(v || 0).toLocaleString()}` },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (_: unknown, record: MaintenanceRecord) => (
      <Space size="small">
        <Button icon={<EyeOutlined />} size="small" onClick={() => onViewDetail(record)} title="查看详情" />
        <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} title="编辑" />
        <Popconfirm title="确定删除此记录吗？" onConfirm={() => onDelete(record.key)}>
          <Button danger icon={<DeleteOutlined />} size="small" title="删除" />
        </Popconfirm>
      </Space>
    ),
  },
];

export const getRepairColumns = (
  onViewDetail: (record: RepairRecord) => void,
  onEdit: (record: RepairRecord) => void,
  onDelete: (key: string) => void,
): ColumnsType<RepairRecord> => [
  { title: '工单ID', dataIndex: 'workOrderId', key: 'workOrderId', width: 100 },
  { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName', width: 120 },
  { title: '故障现象', dataIndex: 'faultPhenomenon', key: 'faultPhenomenon', width: 180, ellipsis: true },
  { title: '报修时间', dataIndex: 'reportTime', key: 'reportTime', width: 140 },
  { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime', width: 80, render: (v: number) => `${v || 0}小时` },
  { title: '维修时长', dataIndex: 'repairTime', key: 'repairTime', width: 80, render: (v: number) => `${v || 0}小时` },
  { title: '维修人员', dataIndex: 'repairPerson', key: 'repairPerson', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: getStatusTag },
  { title: '费用', dataIndex: 'repairCost', key: 'repairCost', width: 100, render: (v: number) => `¥${(v || 0).toLocaleString()}` },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (_: unknown, record: RepairRecord) => (
      <Space size="small">
        <Button icon={<EyeOutlined />} size="small" onClick={() => onViewDetail(record)} title="查看详情" />
        <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} title="编辑" />
        <Popconfirm title="确定删除此记录吗？" onConfirm={() => onDelete(record.key)}>
          <Button danger icon={<DeleteOutlined />} size="small" title="删除" />
        </Popconfirm>
      </Space>
    ),
  },
];
