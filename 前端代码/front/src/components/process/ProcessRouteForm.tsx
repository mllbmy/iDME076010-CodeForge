import React from 'react';
import { Form, Input, Select, Row, Col, Divider, Card, Transfer, Button, Space, Tag } from 'antd';
import type { FormInstance } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { Key } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { products } from './constants';
import type { Process, ProcessStep } from './types';

const { Option } = Select;

interface ProcessRouteFormProps {
  form: FormInstance;
  processData: Process[];
  selectedProcessKeys: Key[];
  dragProcessList: ProcessStep[];
  onProcessSelect: (targetKeys: Key[], direction: TransferDirection, moveKeys: Key[]) => void;
  onMoveStep: (index: number, direction: 'up' | 'down') => void;
}

const ProcessRouteForm: React.FC<ProcessRouteFormProps> = ({
  form,
  processData,
  selectedProcessKeys,
  dragProcessList,
  onProcessSelect,
  onMoveStep,
}) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="routeId"
            label="工艺路线ID"
            rules={[{ required: true, message: '请输入工艺路线ID' }]}
          >
            <Input placeholder="如 ROUTE-001" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="routeName"
            label="工艺路线名称"
            rules={[{ required: true, message: '请输入工艺路线名称' }]}
          >
            <Input placeholder="如 中心轮零件加工" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="version"
            label="版本"
            rules={[{ required: true, message: '请输入版本' }]}
          >
            <Input placeholder="如 V1.0" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="product"
            label="所属产品"
            rules={[{ required: true, message: '请选择所属产品' }]}
          >
            <Select placeholder="请选择产品">
              {products.map(p => <Option key={p} value={p}>{p}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="routeDescription"
        label="工艺描述"
      >
        <Input.TextArea rows={2} placeholder="请输入工艺描述" />
      </Form.Item>

      <Divider>选择工序并排序</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="可选工序" size="small" style={{ height: 300, overflow: 'auto' }}>
            <Transfer
              dataSource={processData.filter(p => p.status === '启用').map(p => ({
                key: p.processId,
                title: `${p.processId} - ${p.processName}`,
                description: p.processDescription,
              }))}
              titles={['可选', '已选']}
              targetKeys={selectedProcessKeys}
              onChange={onProcessSelect}
              render={item => item.title}
              listStyle={{ width: 200, height: 220 }}
              showSearch
              filterOption={(input, item) =>
                item.title.toLowerCase().includes(input.toLowerCase()) ||
                item.description.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="工序排序"
            size="small"
            style={{ height: 300, overflow: 'auto' }}
            extra={<Tag color="blue">{dragProcessList.length} 道工序</Tag>}
          >
            {dragProcessList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                请从左侧选择工序
              </div>
            ) : (
              <div>
                {dragProcessList.map((step, index) => (
                  <Card
                    key={step.key}
                    size="small"
                    style={{ marginBottom: 8 }}
                    extra={
                      <Space size="small">
                        <Button
                          type="text"
                          size="small"
                          icon={<HolderOutlined rotate={90} />}
                          onClick={() => onMoveStep(index, 'up')}
                          disabled={index === 0}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<HolderOutlined rotate={270} />}
                          onClick={() => onMoveStep(index, 'down')}
                          disabled={index === dragProcessList.length - 1}
                        />
                      </Space>
                    }
                  >
                    <Space>
                      <Tag color="blue">步骤{step.step}</Tag>
                      <span>{step.processName}</span>
                      <Tag>{step.standardHours}h</Tag>
                    </Space>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default ProcessRouteForm;
