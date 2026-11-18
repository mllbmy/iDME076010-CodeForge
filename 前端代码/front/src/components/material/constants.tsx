import { Tag, Tooltip, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, ImportOutlined, ExportOutlined, WarningOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Material, StockRecord, CategoryNode, VersionRecord } from './types';
import { BlockchainBadge } from '@/components/blockchain';

export const STATUS_OPTIONS = [
  { label: '库存预警', value: 'warning' },
  { label: '正常', value: '正常' },
  { label: '缺货', value: '缺货' },
  { label: '停产', value: '停产' },
];

export const UNIT_OPTIONS = ['件', '套', '个', '根', '千克', '桶', '罐'];

export const categoryTreeData: CategoryNode[] = [
  {
    title: '核心传动部件',
    value: 'coreTransmission',
    key: 'coreTransmission',
    icon: <FolderOutlined />,
    children: [
      {
        title: '齿轮类',
        value: 'gear',
        key: 'gear',
        icon: <FolderOutlined />,
        children: [
          { title: '太阳轮', value: 'sunGear', key: 'sunGear', icon: <FileOutlined /> },
          { title: '行星轮', value: 'planetGear', key: 'planetGear', icon: <FileOutlined /> },
          { title: '内齿圈', value: 'ringGear', key: 'ringGear', icon: <FileOutlined /> },
        ],
      },
      { title: '行星架', value: 'planetCarrier', key: 'planetCarrier', icon: <FileOutlined /> },
    ],
  },
  {
    title: '轴系部件',
    value: 'shaftSystem',
    key: 'shaftSystem',
    icon: <FolderOutlined />,
    children: [
      { title: '输入轴', value: 'inputShaft', key: 'inputShaft', icon: <FileOutlined /> },
      { title: '输出轴', value: 'outputShaft', key: 'outputShaft', icon: <FileOutlined /> },
      { title: '行星轮轴', value: 'planetShaft', key: 'planetShaft', icon: <FileOutlined /> },
    ],
  },
  {
    title: '支承部件',
    value: 'support',
    key: 'support',
    icon: <FolderOutlined />,
    children: [
      {
        title: '轴承',
        value: 'bearing',
        key: 'bearing',
        icon: <FolderOutlined />,
        children: [
          { title: '滚针轴承', value: 'needleBearing', key: 'needleBearing', icon: <FileOutlined /> },
          { title: '圆柱滚子轴承', value: 'cylindricalBearing', key: 'cylindricalBearing', icon: <FileOutlined /> },
          { title: '深沟球轴承', value: 'deepGrooveBearing', key: 'deepGrooveBearing', icon: <FileOutlined /> },
          { title: '圆锥滚子轴承', value: 'taperedBearing', key: 'taperedBearing', icon: <FileOutlined /> },
        ],
      },
      { title: '轴承端盖', value: 'bearingCover', key: 'bearingCover', icon: <FileOutlined /> },
    ],
  },
  {
    title: '壳体与箱体部件',
    value: 'housing',
    key: 'housing',
    icon: <FolderOutlined />,
    children: [
      { title: '输入壳体', value: 'inputHousing', key: 'inputHousing', icon: <FileOutlined /> },
      { title: '输出壳体', value: 'outputHousing', key: 'outputHousing', icon: <FileOutlined /> },
      { title: '内齿圈壳体', value: 'ringGearHousing', key: 'ringGearHousing', icon: <FileOutlined /> },
      { title: '法兰盘', value: 'flange', key: 'flange', icon: <FileOutlined /> },
    ],
  },
  {
    title: '辅助部件',
    value: 'auxiliary',
    key: 'auxiliary',
    icon: <FolderOutlined />,
    children: [
      {
        title: '密封件',
        value: 'seal',
        key: 'seal',
        icon: <FolderOutlined />,
        children: [
          { title: '油封', value: 'oilSeal', key: 'oilSeal', icon: <FileOutlined /> },
          { title: 'O型圈', value: 'oRing', key: 'oRing', icon: <FileOutlined /> },
        ],
      },
      {
        title: '紧固件',
        value: 'fastener',
        key: 'fastener',
        icon: <FolderOutlined />,
        children: [
          { title: '12.9级螺栓', value: 'bolt129', key: 'bolt129', icon: <FileOutlined /> },
          { title: '螺母', value: 'nut', key: 'nut', icon: <FileOutlined /> },
          { title: '卡簧', value: 'retainerRing', key: 'retainerRing', icon: <FileOutlined /> },
          { title: '定位销', value: 'dowelPin', key: 'dowelPin', icon: <FileOutlined /> },
        ],
      },
      {
        title: '调整件',
        value: 'adjustment',
        key: 'adjustment',
        icon: <FolderOutlined />,
        children: [
          { title: '锁紧环', value: 'lockingRing', key: 'lockingRing', icon: <FileOutlined /> },
          { title: '调整套', value: 'adjustingSleeve', key: 'adjustingSleeve', icon: <FileOutlined /> },
          { title: '垫片', value: 'shim', key: 'shim', icon: <FileOutlined /> },
        ],
      },
      {
        title: '润滑系统',
        value: 'lubrication',
        key: 'lubrication',
        icon: <FolderOutlined />,
        children: [
          { title: '油杯', value: 'oilCup', key: 'oilCup', icon: <FileOutlined /> },
          { title: '油嘴', value: 'oilNozzle', key: 'oilNozzle', icon: <FileOutlined /> },
        ],
      },
    ],
  },
  {
    title: '原材料',
    value: 'rawMaterial',
    key: 'rawMaterial',
    icon: <FolderOutlined />,
    children: [
      {
        title: '合金钢',
        value: 'alloySteel',
        key: 'alloySteel',
        icon: <FolderOutlined />,
        children: [
          { title: '20CrMnTi', value: 'steel20CrMnTi', key: 'steel20CrMnTi', icon: <FileOutlined /> },
          { title: '18CrNiMo7-6', value: 'steel18CrNiMo', key: 'steel18CrNiMo', icon: <FileOutlined /> },
          { title: '40CrNiMo', value: 'steel40CrNiMo', key: 'steel40CrNiMo', icon: <FileOutlined /> },
          { title: '42CrMo', value: 'steel42CrMo', key: 'steel42CrMo', icon: <FileOutlined /> },
        ],
      },
      {
        title: '球墨铸铁',
        value: 'ductileIron',
        key: 'ductileIron',
        icon: <FileOutlined />,
        children: [
          { title: 'QT400-18', value: 'qt400', key: 'qt400', icon: <FileOutlined /> },
          { title: 'QT700-2', value: 'qt700', key: 'qt700', icon: <FileOutlined /> },
        ],
      },
      {
        title: '轴承钢',
        value: 'bearingSteel',
        key: 'bearingSteel',
        icon: <FileOutlined />,
        children: [
          { title: 'GCr15', value: 'gcr15', key: 'gcr15', icon: <FileOutlined /> },
        ],
      },
    ],
  },
  {
    title: '标准件（外购）',
    value: 'standardParts',
    key: 'standardParts',
    icon: <FolderOutlined />,
    children: [
      { title: '轴承', value: 'standardBearing', key: 'standardBearing', icon: <FileOutlined /> },
      { title: '密封件', value: 'standardSeal', key: 'standardSeal', icon: <FileOutlined /> },
      {
        title: '润滑材料',
        value: 'lubricant',
        key: 'lubricant',
        icon: <FolderOutlined />,
        children: [
          { title: '合成齿轮油', value: 'gearOil', key: 'gearOil', icon: <FileOutlined /> },
          { title: '锂基润滑脂', value: 'grease', key: 'grease', icon: <FileOutlined /> },
        ],
      },
    ],
  },
];

export const getMaterialColumns = (
  handleEdit: (record: Material) => void,
  handleStock: (record: Material, type: 'in' | 'out') => void,
  handleDelete: (key: string) => void,
): ColumnsType<Material> => [
  {
    title: '物料编码',
    dataIndex: 'partNumber',
    key: 'partNumber',
    width: 140,
    fixed: 'left',
    render: (text: string, record: Material) => (
      <span>
        {text}
        {record.key.startsWith('priority-') && <span className="priority-badge">⭐ 优先</span>}
      </span>
    ),
  },
  {
    title: '物料名称',
    dataIndex: 'partName',
    key: 'partName',
    width: 120,
  },
  {
    title: '物料分类',
    dataIndex: 'categoryPath',
    key: 'categoryPath',
    width: 200,
    render: (categoryPath: string) => (
      <Tag color="blue">{(categoryPath || '').split('→').pop() || ''}</Tag>
    )
  },
  {
    title: '规格型号',
    dataIndex: 'partModel',
    key: 'partModel',
    width: 150,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 60,
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (price: number) => `¥${(price || 0).toFixed(2)}`
  },
  {
    title: '库存数量',
    dataIndex: 'stockQuantity',
    key: 'stockQuantity',
    width: 100,
    render: (stock: number, record: Material) => {
      const stockValue = stock || 0;
      const safetyStockValue = record.safetyStock || 0;
      const isWarning = stockValue <= safetyStockValue;
      return (
        <Tooltip title={isWarning ? `低于安全库存(${safetyStockValue})` : `安全库存: ${safetyStockValue}`}>
          <span style={{ color: isWarning ? '#ff4d4f' : '#52c41a', fontWeight: isWarning ? 'bold' : 'normal' }}>
            {stockValue} {isWarning && <WarningOutlined />}
          </span>
        </Tooltip>
      );
    }
  },
  {
    title: '安全库存',
    dataIndex: 'safetyStock',
    key: 'safetyStock',
    width: 100,
  },
  {
    title: '供应商',
    dataIndex: 'supplier',
    key: 'supplier',
    width: 120,
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status: string, record: Material) => {
      let color = '';
      let text = status;

      if (record.stockQuantity <= record.safetyStock) {
        color = 'red';
        text = '库存预警';
      } else {
        switch (status) {
          case '正常':
            color = 'green';
            break;
          case '缺货':
            color = 'red';
            break;
          case '停产':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
      }
      return <Tag color={color}>{text}</Tag>;
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    render: (_: unknown, record: Material) => (
      <Space size="small">
        <Tooltip title="编辑">
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
        </Tooltip>
        <Tooltip title="入库">
          <Button type="primary" ghost icon={<ImportOutlined />} size="small" onClick={() => handleStock(record, 'in')} />
        </Tooltip>
        <Tooltip title="出库">
          <Button danger ghost icon={<ExportOutlined />} size="small" onClick={() => handleStock(record, 'out')} />
        </Tooltip>
        <Tooltip title="删除">
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.key)} />
        </Tooltip>
      </Space>
    ),
  },
];

export const stockRecordColumns: ColumnsType<StockRecord> = [
  { title: '物料编码', dataIndex: 'materialId', key: 'materialId', width: 120 },
  { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 80,
    render: (type: string) => (
      <Tag color={type === 'in' ? 'green' : 'red'}>
        {type === 'in' ? '入库' : '出库'}
      </Tag>
    )
  },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '关联单号', dataIndex: 'relatedOrder', key: 'relatedOrder', width: 140 },
  { title: '操作前库存', dataIndex: 'beforeStock', key: 'beforeStock', width: 100 },
  { title: '操作后库存', dataIndex: 'afterStock', key: 'afterStock', width: 100 },
  { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
  { title: '操作时间', dataIndex: 'operateTime', key: 'operateTime', width: 160 },
  {
    title: '存证状态',
    dataIndex: 'blockchainCertified',
    width: 120,
    render: (certified: boolean, record: StockRecord) => (
      <BlockchainBadge certified={certified} txHash={record.blockchainTxHash} />
    ),
  },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 200, ellipsis: true },
];

export const versionColumns: ColumnsType<VersionRecord> = [
  { title: '版本号', dataIndex: 'version', key: 'version', width: 100, render: (v: string) => <Tag color="blue">{v}</Tag> },
  { title: '物料编码', dataIndex: 'materialId', key: 'materialId', width: 120 },
  { title: '物料名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '变更内容', dataIndex: 'change', key: 'change', ellipsis: true },
  { title: '变更日期', dataIndex: 'date', key: 'date', width: 120 },
  { title: '变更人', dataIndex: 'person', key: 'person', width: 100 },
];
