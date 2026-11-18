import React, { useState } from 'react';
import { Tabs, Modal, Form, Input, TreeSelect, Table, Button, Space, Card, Tag, Badge, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, DownloadOutlined, ImportOutlined, FileOutlined } from '@ant-design/icons';
import { getExcelUtils } from '@/utils/excel';
import type { Material, CategoryNode } from './types';
import { getMaterialColumns } from './constants';
import useMaterialData from './hooks/useMaterialData';
import useStockData from './hooks/useStockData';
import useVersionData from './hooks/useVersionData';
import MaterialTable from './MaterialTable';
import MaterialForm from './MaterialForm';
import StockInForm from './StockInForm';
import StockRecordTable from './StockRecordTable';
import VersionTable from './VersionTable';

const { Option } = Select;

const MaterialManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materialList');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategoryNode, setSelectedCategoryNode] = useState<CategoryNode | null>(null);
  const [categoryForm] = Form.useForm();

  const materialHook = useMaterialData();
  const stockHook = useStockData();
  const versionHook = useVersionData();

  const handleStock = (record: Material, type: 'in' | 'out') => {
    stockHook.openStockModal(record, type);
  };

  const handleStockSubmit = () => {
    stockHook.handleStockSubmit(materialHook.updateMaterialStock);
  };

  const handleVersionSubmit = () => {
    versionHook.handleVersionSubmit(materialHook.materialData, materialHook.updateMaterialVersion);
  };

  const handleAddCategory = () => {
    setSelectedCategoryNode(null);
    categoryForm.resetFields();
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (node: CategoryNode) => {
    setSelectedCategoryNode(node);
    categoryForm.setFieldsValue({
      categoryName: node.title,
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (node: CategoryNode) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类"${node.title}"吗？`,
      onOk: () => {
        const deleteNode = (nodes: CategoryNode[]): CategoryNode[] => {
          return nodes.filter(n => n.value !== node.value).map(n => ({
            ...n,
            children: n.children ? deleteNode(n.children) : undefined
          }));
        };
        materialHook.setCategories(deleteNode(materialHook.categories));
      }
    });
  };

  const handleCategorySubmit = () => {
    categoryForm.validateFields().then(values => {
      if (selectedCategoryNode) {
        const updateNode = (nodes: CategoryNode[]): CategoryNode[] => {
          return nodes.map(n => {
            if (n.value === selectedCategoryNode.value) {
              return { ...n, title: values.categoryName };
            }
            if (n.children) {
              return { ...n, children: updateNode(n.children) };
            }
            return n;
          });
        };
        materialHook.setCategories(updateNode(materialHook.categories));
      } else {
        const newNode: CategoryNode = {
          key: Date.now().toString(),
          title: values.categoryName,
          value: Date.now().toString(),
          icon: <FileOutlined />,
        };

        if (values.parentCategory) {
          const addToParent = (nodes: CategoryNode[]): CategoryNode[] => {
            return nodes.map(n => {
              if (n.value === values.parentCategory) {
                return { ...n, children: [...(n.children || []), newNode] };
              }
              if (n.children) {
                return { ...n, children: addToParent(n.children) };
              }
              return n;
            });
          };
          materialHook.setCategories(addToParent(materialHook.categories));
        } else {
          materialHook.setCategories([...materialHook.categories, newNode]);
        }
      }
      setIsCategoryModalOpen(false);
    }).catch(() => {});
  };

  const flattenCategories = (nodes: CategoryNode[], level: number = 1, parentPath: string = ''): { key: string; title: string; value: string; level: number; path: string; childCount: number }[] => {
    let result: { key: string; title: string; value: string; level: number; path: string; childCount: number }[] = [];
    nodes.forEach(node => {
      const path = parentPath ? `${parentPath} → ${node.title}` : node.title;
      result.push({
        key: node.key,
        title: node.title,
        value: node.value,
        level,
        path,
        childCount: node.children?.length || 0,
      });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenCategories(node.children, level + 1, path));
      }
    });
    return result;
  };

  const exportCategoryToExcel = async () => {
    const categoryData = flattenCategories(materialHook.categories);
    const exportData = categoryData.map(item => ({
      '分类编码': item.key,
      '分类名称': item.title,
      '分类路径': item.path,
      '层级': `第${item.level}级`,
      '子分类数': item.childCount,
    }));

    const XLSX = await getExcelUtils();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, '物料分类');
    XLSX.writeFile(wb, '物料分类.xlsx');
  };

  const warningMaterialColumns = getMaterialColumns(materialHook.handleEdit, handleStock, materialHook.handleDelete)
    .filter(col => col.key !== 'action')
    .concat([{
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Material) => (
        <Space size="small">
          <Button type="primary" ghost icon={<ImportOutlined />} size="small" onClick={() => handleStock(record, 'in')}>
            入库
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => materialHook.handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    }]);

  const tabsItems = [
    {
      key: 'materialList',
      label: '物料列表',
      children: (
        <div>
          <MaterialTable
          materialData={materialHook.materialData}
          filteredMaterialData={materialHook.filteredMaterialData}
          warningMaterials={materialHook.warningMaterials}
          currentPage={materialHook.currentPage}
          pageSize={materialHook.pageSize}
          selectedCategory={materialHook.selectedCategory}
          searchText={materialHook.searchText}
          stockStatusFilter={materialHook.stockStatusFilter}
          categories={materialHook.categories}
          getCurrentPageData={materialHook.getCurrentPageData}
          onAdd={materialHook.handleAdd}
          onEdit={materialHook.handleEdit}
          onDelete={materialHook.handleDelete}
          onStock={handleStock}
          onRefresh={materialHook.handleRefresh}
          onCategoryChange={materialHook.handleCategoryChange}
          onSearchTextChange={materialHook.setSearchText}
          onStockStatusFilterChange={materialHook.setStockStatusFilter}
          onPageChange={(page, size) => {
            materialHook.setCurrentPage(page);
            materialHook.setPageSize(size);
          }}
        />
        </div>
      ),
    },
    {
      key: 'category',
      label: '物料分类',
      children: (
        <Card
          title="物料分类管理"
          extra={
            <Space>
              <Button icon={<DownloadOutlined />} onClick={exportCategoryToExcel}>导出Excel</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
                添加分类
              </Button>
            </Space>
          }
        >
          <Table
            columns={[
              {
                title: '分类编码',
                dataIndex: 'key',
                key: 'key',
                width: 150,
              },
              {
                title: '分类名称',
                dataIndex: 'title',
                key: 'title',
                width: 200,
              },
              {
                title: '分类路径',
                dataIndex: 'path',
                key: 'path',
                ellipsis: true,
              },
              {
                title: '层级',
                dataIndex: 'level',
                key: 'level',
                width: 80,
                render: (level: number) => <Tag color={level === 1 ? 'blue' : level === 2 ? 'green' : 'orange'}>{`第${level}级`}</Tag>,
              },
              {
                title: '子分类数',
                dataIndex: 'childCount',
                key: 'childCount',
                width: 100,
                render: (count: number) => count || 0,
              },
              {
                title: '操作',
                key: 'action',
                width: 150,
                render: (_: unknown, record: CategoryNode) => (
                  <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditCategory(record)}>编辑</Button>
                    <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(record)}>删除</Button>
                  </Space>
                ),
              },
            ]}
            dataSource={flattenCategories(materialHook.categories)}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content', y: 500 }}
            bordered
          />
        </Card>
      ),
    },
    {
      key: 'warning',
      label: (
        <Badge count={materialHook.warningMaterials.length} offset={[10, 0]}>
          库存预警
        </Badge>
      ),
      children: (
        <Card title="库存预警列表">
          <Table
            columns={warningMaterialColumns}
            dataSource={materialHook.warningMaterials}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content', y: 500 }}
            bordered
          />
        </Card>
      ),
    },
    {
      key: 'stockRecords',
      label: (
        <span>
          <HistoryOutlined /> 出入库记录
        </span>
      ),
      children: (
        <StockRecordTable stockRecords={stockHook.stockRecords} />
      ),
    },
    {
      key: 'version',
      label: '版本管理',
      children: (
        <VersionTable
          versionRecords={versionHook.versionRecords}
          onAddVersion={versionHook.handleAddVersion}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabsItems} />

      <MaterialForm
        visible={materialHook.isModalOpen}
        isEditMode={materialHook.isEditMode}
        form={materialHook.form}
        categories={materialHook.categories}
        extAttrs={materialHook.extAttrs}
        onAddExtAttr={materialHook.handleAddExtAttr}
        onRemoveExtAttr={materialHook.handleRemoveExtAttr}
        onExtAttrChange={materialHook.handleExtAttrChange}
        onSubmit={materialHook.handleSubmit}
        onCancel={() => materialHook.setIsModalOpen(false)}
      />

      <StockInForm
        visible={stockHook.isStockModalOpen}
        form={stockHook.stockForm}
        stockType={stockHook.stockType}
        onSubmit={handleStockSubmit}
        onCancel={() => stockHook.setIsStockModalOpen(false)}
      />

      <Modal
        title={selectedCategoryNode ? '编辑分类' : '添加分类'}
        open={isCategoryModalOpen}
        onOk={handleCategorySubmit}
        onCancel={() => setIsCategoryModalOpen(false)}
        width={500}
        destroyOnHidden
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          {!selectedCategoryNode && (
            <Form.Item name="parentCategory" label="父级分类">
              <TreeSelect
                style={{ width: '100%' }}
                placeholder="选择父级分类（可选）"
                allowClear
                treeDefaultExpandAll
                treeData={materialHook.categories}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="新增版本更新"
        open={versionHook.isVersionModalOpen}
        onOk={handleVersionSubmit}
        onCancel={() => versionHook.setIsVersionModalOpen(false)}
        width={600}
        destroyOnHidden
      >
        <Form form={versionHook.versionForm} layout="vertical">
          <Form.Item
            name="materialId"
            label="选择物料"
            rules={[{ required: true, message: '请选择物料' }]}
          >
            <Select
              placeholder="请选择要更新版本的物料"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {materialHook.materialData.map(m => (
                <Option key={m.partNumber} value={m.partNumber}>
                  {m.partNumber} - {m.partName} ({m.version})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="change"
            label="变更内容"
            rules={[{ required: true, message: '请输入变更内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入版本变更内容" />
          </Form.Item>
          <Form.Item
            name="person"
            label="变更人"
            rules={[{ required: true, message: '请输入变更人' }]}
          >
            <Input placeholder="请输入变更人姓名" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialManagement;
