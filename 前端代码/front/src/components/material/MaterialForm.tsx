import React, { useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, Divider, Button, InputNumber, TreeSelect, Space } from 'antd';
import type { FormInstance } from 'antd';
import { PlusOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons';
import type { ExtAttr, CategoryNode } from './types';
import { UNIT_OPTIONS } from './constants';
import { AiCodeGenerator } from '@/components/ai';

const { Option } = Select;

interface MaterialFormProps {
  visible: boolean;
  isEditMode: boolean;
  form: FormInstance;
  categories: CategoryNode[];
  extAttrs: ExtAttr[];
  onAddExtAttr: () => void;
  onRemoveExtAttr: (index: number) => void;
  onExtAttrChange: (index: number, field: 'key' | 'value', value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  visible,
  isEditMode,
  form,
  categories,
  extAttrs,
  onAddExtAttr,
  onRemoveExtAttr,
  onExtAttrChange,
  onSubmit,
  onCancel,
}) => {
  const [aiPanelVisible, setAiPanelVisible] = useState(false);

  return (
    <Modal
      title={isEditMode ? '编辑物料' : '添加物料'}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="partNumber"
              label="物料编码"
              rules={[{ required: true, message: '请输入物料编码' }]}
            >
              <Space.Compact>
                <Input style={{ width: 'calc(100% - 32px)' }} placeholder="请输入物料编码" />
                <Button type="text" size="small" icon={<RobotOutlined />} onClick={() => setAiPanelVisible(!aiPanelVisible)} />
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="partName"
              label="物料名称"
              rules={[{ required: true, message: '请输入物料名称' }]}
            >
              <Input placeholder="请输入物料名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="物料分类"
              rules={[{ required: true, message: '请选择物料分类' }]}
            >
              <TreeSelect
                style={{ width: '100%' }}
                placeholder="选择物料分类"
                allowClear
                treeDefaultExpandAll
                treeData={categories}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="partModel" label="规格型号">
              <Input placeholder="请输入规格型号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="unit" label="单位">
              <Select placeholder="请选择单位">
                {UNIT_OPTIONS.map(u => (
                  <Option key={u} value={u}>{u}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="price" label="单价">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder="请输入单价"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="supplier" label="供应商">
              <Input placeholder="请输入供应商" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="stockQuantity" label="库存数量">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="请输入库存数量"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="safetyStock" label="安全库存">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="请输入安全库存"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="version" label="版本">
              <Input placeholder="如 V1.0" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入物料描述" />
        </Form.Item>

        <Divider>扩展属性</Divider>
        <div>
          {extAttrs.map((attr, index) => (
            <Row key={index} gutter={16} style={{ marginBottom: 8 }}>
              <Col span={10}>
                <Input
                  placeholder="属性名"
                  value={attr.key}
                  onChange={(e) => onExtAttrChange(index, 'key', e.target.value)}
                />
              </Col>
              <Col span={10}>
                <Input
                  placeholder="属性值"
                  value={attr.value}
                  onChange={(e) => onExtAttrChange(index, 'value', e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveExtAttr(index)}
                />
              </Col>
            </Row>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={onAddExtAttr} block>
            添加扩展属性
          </Button>
        </div>
      </Form>
      {aiPanelVisible && <AiCodeGenerator defaultType="material" />}
    </Modal>
  );
};

export default MaterialForm;
