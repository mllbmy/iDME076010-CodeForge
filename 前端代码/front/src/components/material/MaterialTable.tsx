import React from 'react';
import { Table, Button, Space, Input, Select, Card, Pagination, Row, Col, Statistic, TreeSelect } from 'antd';
import { PlusOutlined, ReloadOutlined, WarningOutlined, DownloadOutlined } from '@ant-design/icons';
import type { Material, CategoryNode } from './types';
import { getMaterialColumns } from './constants';
import { getExcelUtils } from '@/utils/excel';

const { Option } = Select;
const { Search } = Input;

interface MaterialTableProps {
  materialData: Material[];
  filteredMaterialData: Material[];
  warningMaterials: Material[];
  currentPage: number;
  pageSize: number;
  selectedCategory: string;
  searchText: string;
  stockStatusFilter: string;
  categories: CategoryNode[];
  getCurrentPageData: (data: Material[]) => Material[];
  onAdd: () => void;
  onEdit: (record: Material) => void;
  onDelete: (key: string) => void;
  onStock: (record: Material, type: 'in' | 'out') => void;
  onRefresh: () => void;
  onCategoryChange: (value: string) => void;
  onSearchTextChange: (value: string) => void;
  onStockStatusFilterChange: (value: string) => void;
  onPageChange: (page: number, size: number) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  materialData,
  filteredMaterialData,
  warningMaterials,
  currentPage,
  pageSize,
  selectedCategory,
  stockStatusFilter,
  categories,
  getCurrentPageData,
  onAdd,
  onEdit,
  onDelete,
  onStock,
  onRefresh,
  onCategoryChange,
  onSearchTextChange,
  onStockStatusFilterChange,
  onPageChange,
}) => {
  const materialColumns = getMaterialColumns(onEdit, onStock, onDelete);

  const rowClassName = (record: Material) => {
    return record.key.startsWith('priority-') ? 'priority-row' : '';
  };

  const exportMaterialToExcel = async () => {
    const exportData = filteredMaterialData.map(item => ({
      '物料编码': item.partNumber,
      '物料名称': item.partName,
      '物料分类': item.categoryPath,
      '规格型号': item.partModel,
      '库存数量': item.stockQuantity,
      '安全库存': item.safetyStock,
      '单位': item.unit,
      '单价(元)': item.price,
      '供应商': item.supplier,
      '版本': item.version,
      '状态': item.status,
      '最后更新时间': item.lastUpdateTime,
      '描述': item.description,
    }));

    const XLSX = await getExcelUtils();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, '物料列表');
    XLSX.writeFile(wb, '物料列表.xlsx');
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="物料总数"
              value={materialData.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存预警"
              value={warningMaterials.length}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总库存价值"
              value={materialData.reduce((sum, m) => sum + m.stockQuantity * m.price, 0)}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="供应商数量"
              value={new Set(materialData.map(m => m.supplier)).size}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            添加物料
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
        <Space>
          <Search
            placeholder="搜索物料编码/名称/规格"
            allowClear
            style={{ width: 250 }}
            onChange={(e) => onSearchTextChange(e.target.value)}
            onSearch={(value) => onSearchTextChange(value)}
          />
          <TreeSelect
            style={{ width: 200 }}
            placeholder="选择物料分类"
            allowClear
            treeDefaultExpandAll
            treeData={categories}
            onChange={onCategoryChange}
            value={selectedCategory}
          />
          <Select
            style={{ width: 120 }}
            placeholder="库存状态"
            allowClear
            onChange={onStockStatusFilterChange}
            value={stockStatusFilter}
          >
            <Option value="warning">库存预警</Option>
            <Option value="正常">正常</Option>
            <Option value="缺货">缺货</Option>
            <Option value="停产">停产</Option>
          </Select>
        </Space>
      </Space>

      {warningMaterials.length > 0 && (
        <Card
          style={{ marginBottom: 16, borderColor: '#ff4d4f' }}
          styles={{ body: { padding: '12px 24px' } }}
        >
          <Space>
            <WarningOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
              库存预警提示：
            </span>
            <span>
              {warningMaterials.map(m => `${m.partName}(${m.partNumber})`).join('、')}
              共 {warningMaterials.length} 种物料库存低于安全库存，请及时补货！
            </span>
          </Space>
        </Card>
      )}

      <Card
        title="物料列表"
        extra={
          <Button icon={<DownloadOutlined />} onClick={exportMaterialToExcel}>导出Excel</Button>
        }
      >
        <Table
          columns={materialColumns}
          dataSource={getCurrentPageData(filteredMaterialData)}
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content', y: 500 }}
          bordered
          rowClassName={rowClassName}
          size="middle"
          className="material-table-responsive"
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredMaterialData.length}
          onChange={(page, size) => {
            onPageChange(page, size);
          }}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条记录`}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </Card>
    </>
  );
};

export default MaterialTable;
