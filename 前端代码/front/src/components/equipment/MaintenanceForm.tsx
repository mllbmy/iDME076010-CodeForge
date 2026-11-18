import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Row, Col, Divider, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EquipmentLedger } from './types';
import { MAINTENANCE_TYPE_OPTIONS, MAINTENANCE_STATUS_OPTIONS } from './constants';

const { Option } = Select;
const { TextArea } = Input;

interface MaintenanceFormProps {
  equipmentList: EquipmentLedger[];
  partsReplaced: { name: string; quantity: number; model: string }[];
  addPart: () => void;
  removePart: (index: number) => void;
  updatePart: (index: number, field: string, value: string | number) => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ equipmentList, partsReplaced, addPart, removePart, updatePart }) => (
  <>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="equipmentId" label="设备" rules={[{ required: true, message: '请选择设备' }]}>
          <Select placeholder="请选择设备">
            {equipmentList.map(eq => (
              <Option key={eq.equipmentNumber} value={eq.equipmentNumber}>{eq.equipmentName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="maintenanceType" label="保养类型" rules={[{ required: true, message: '请选择保养类型' }]}>
          <Select placeholder="请选择保养类型">
            {MAINTENANCE_TYPE_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="maintenanceTime" label="保养时间" rules={[{ required: true, message: '请选择保养时间' }]}>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="maintainer" label="维护人员" rules={[{ required: true, message: '请输入维护人员' }]}>
          <Input placeholder="请输入维护人员" />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="maintenanceContent" label="保养内容" rules={[{ required: true, message: '请输入保养内容' }]}>
      <TextArea rows={3} placeholder="请输入保养内容" />
    </Form.Item>
    <Divider>更换零部件</Divider>
    {partsReplaced.map((part, index) => (
      <Row gutter={16} key={index} style={{ marginBottom: 8 }}>
        <Col span={8}>
          <Input placeholder="名称" value={part.name} onChange={e => updatePart(index, 'name', e.target.value)} />
        </Col>
        <Col span={6}>
          <InputNumber min={1} placeholder="数量" value={part.quantity} onChange={v => updatePart(index, 'quantity', v ?? 0)} style={{ width: '100%' }} />
        </Col>
        <Col span={6}>
          <Input placeholder="型号" value={part.model} onChange={e => updatePart(index, 'model', e.target.value)} />
        </Col>
        <Col span={4}>
          <Button danger onClick={() => removePart(index)}>删除</Button>
        </Col>
      </Row>
    ))}
    <Button type="dashed" onClick={addPart} icon={<PlusOutlined />} style={{ width: '100%', marginTop: 8 }}>
      添加零部件
    </Button>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={12}>
        <Form.Item name="cost" label="成本费用">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入成本费用" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="status" label="状态" initialValue="进行中">
          <Select>
            {MAINTENANCE_STATUS_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="remark" label="备注">
      <TextArea rows={2} placeholder="请输入备注" />
    </Form.Item>
  </>
);

export default MaintenanceForm;
