import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import { workshops } from './constants';

const { Option } = Select;

interface ProcessFormProps {
  form: FormInstance;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="processId"
            label="工序ID"
            rules={[{ required: true, message: '请输入工序ID' }]}
          >
            <Input placeholder="如 PROC-001" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="processName"
            label="工序名称"
            rules={[{ required: true, message: '请输入工序名称' }]}
          >
            <Input placeholder="如 毛坯制造" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="processDescription"
        label="工序描述"
        rules={[{ required: true, message: '请输入工序描述' }]}
      >
        <Input.TextArea rows={2} placeholder="请输入工序描述" />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="workshop"
            label="所属车间"
            rules={[{ required: true, message: '请选择所属车间' }]}
          >
            <Select placeholder="请选择车间">
              {workshops.map(w => <Option key={w} value={w}>{w}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="standardHours"
            label="标准工时"
            rules={[{ required: true, message: '请输入标准工时' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.5}
              precision={2}
              placeholder="如 2.5"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="equipment" label="使用设备">
            <Input placeholder="如 数控车床" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="operator" label="操作员">
            <Input placeholder="如 张三" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="status" label="状态" rules={[{ required: true }]}>
        <Select>
          <Option value="启用">启用</Option>
          <Option value="禁用">禁用</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ProcessForm;
