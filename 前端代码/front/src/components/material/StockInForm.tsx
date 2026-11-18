import React from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import type { FormInstance } from 'antd';

interface StockInFormProps {
  visible: boolean;
  form: FormInstance;
  stockType: 'in' | 'out';
  onSubmit: () => void;
  onCancel: () => void;
}

const StockInForm: React.FC<StockInFormProps> = ({
  visible,
  form,
  stockType,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={stockType === 'in' ? '物料入库' : '物料出库'}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="materialId" label="物料编码">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="materialName" label="物料名称">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="currentStock" label="当前库存">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label={stockType === 'in' ? '入库数量' : '出库数量'}
              rules={[{ required: true, message: '请输入数量' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="请输入数量"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="relatedOrder"
              label="关联单号"
              rules={[{ required: true, message: '请输入关联单号' }]}
            >
              <Input placeholder="如 PO-2024-001 或 WO-2024-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="operator"
              label="操作人"
              rules={[{ required: true, message: '请输入操作人' }]}
            >
              <Input placeholder="请输入操作人姓名" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StockInForm;
