import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Row, Col } from 'antd';
import { EquipmentLedger } from './types';
import { MAINTENANCE_STATUS_OPTIONS } from './constants';

const { Option } = Select;
const { TextArea } = Input;

interface RepairFormProps {
  equipmentList: EquipmentLedger[];
}

const RepairForm: React.FC<RepairFormProps> = ({ equipmentList }) => (
  <>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="workOrderId" label="工单ID" rules={[{ required: true, message: '请输入工单ID' }]}>
          <Input placeholder="请输入工单ID，如：WO-001" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="equipmentId" label="设备" rules={[{ required: true, message: '请选择设备' }]}>
          <Select placeholder="请选择设备">
            {equipmentList.map(eq => (
              <Option key={eq.equipmentNumber} value={eq.equipmentNumber}>{eq.equipmentName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="faultPhenomenon" label="故障现象" rules={[{ required: true, message: '请输入故障现象' }]}>
      <TextArea rows={3} placeholder="请输入故障现象" />
    </Form.Item>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="reportTime" label="报修时间" rules={[{ required: true, message: '请选择报修时间' }]}>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="repairPerson" label="维修人员" rules={[{ required: true, message: '请输入维修人员' }]}>
          <Input placeholder="请输入维修人员" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="responseTime" label="响应时间(小时)">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="响应时间" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="repairTime" label="维修时长(小时)">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="维修时长" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="repairCost" label="维修费用">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入维修费用" />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="repairMeasures" label="维修措施">
      <TextArea rows={3} placeholder="请输入维修措施" />
    </Form.Item>
    <Form.Item name="status" label="状态" initialValue="待处理">
      <Select>
        {MAINTENANCE_STATUS_OPTIONS.map(opt => (
          <Option key={opt.value} value={opt.value}>{opt.label}</Option>
        ))}
      </Select>
    </Form.Item>
  </>
);

export default RepairForm;
