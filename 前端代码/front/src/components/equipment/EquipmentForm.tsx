import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Row, Col, Divider, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ExtAttr } from './types';
import { EQUIPMENT_TYPE_OPTIONS, STATUS_OPTIONS } from './constants';

const { Option } = Select;

interface EquipmentFormProps {
  extAttrs: ExtAttr[];
  addExtAttr: () => void;
  removeExtAttr: (index: number) => void;
  updateExtAttr: (index: number, field: 'key' | 'value', value: string) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ extAttrs, addExtAttr, removeExtAttr, updateExtAttr }) => (
  <>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="equipmentNumber" label="设备编码" rules={[{ required: true, message: '请输入设备编码' }]}>
          <Input placeholder="请输入设备编码" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="equipmentName" label="设备名称" rules={[{ required: true, message: '请输入设备名称' }]}>
          <Input placeholder="请输入设备名称" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="manufacturerFactory" label="生产厂家">
          <Input placeholder="请输入生产厂家" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="brand" label="品牌">
          <Input placeholder="请输入品牌" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="supplier" label="供应商">
          <Input placeholder="请输入供应商" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="productionDate" label="生产日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item name="modelSpecifications" label="规格型号">
          <Input placeholder="请输入规格型号" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="serverLife" label="使用年限(年)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入使用年限" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="depreciationMethod" label="折旧方式">
          <Select placeholder="请选择折旧方式">
            {EQUIPMENT_TYPE_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="equipmentLocal" label="位置">
          <Input placeholder="如：一号车间A区" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="status" label="状态" initialValue="运行中">
          <Select>
            {STATUS_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="department" label="部门">
          <Input placeholder="请输入部门" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="responsiblePerson" label="负责人">
          <Input placeholder="请输入负责人" />
        </Form.Item>
      </Col>
    </Row>
    <Divider>扩展属性</Divider>
    {extAttrs.map((attr, index) => (
      <Row gutter={16} key={index}>
        <Col span={10}>
          <Input placeholder="属性名" value={attr.key} onChange={e => updateExtAttr(index, 'key', e.target.value)} />
        </Col>
        <Col span={10}>
          <Input placeholder="属性值" value={attr.value} onChange={e => updateExtAttr(index, 'value', e.target.value)} />
        </Col>
        <Col span={4}>
          <Button danger onClick={() => removeExtAttr(index)}>删除</Button>
        </Col>
      </Row>
    ))}
    <Button type="dashed" onClick={addExtAttr} icon={<PlusOutlined />} style={{ width: '100%', marginTop: 8 }}>
      添加扩展属性
    </Button>
  </>
);

export default EquipmentForm;
