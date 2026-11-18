import React from 'react';
import { Descriptions, Tag } from 'antd';
import { EquipmentLedger, MaintenanceRecord, RepairRecord } from './types';
import { getStatusTag } from './constants';
import { AiMaintenancePanel } from '@/components/ai';
import type { EquipmentAiParams } from '@/services/interfaces/IEquipmentAiService';

interface EquipmentDetailProps {
  record: EquipmentLedger | MaintenanceRecord | RepairRecord | null;
  tabKey: string;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ record, tabKey }) => {
  if (!record) return null;

  if (tabKey === 'equipment-ledger') {
    const r = record as EquipmentLedger;
    return (
      <>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="设备编码">{r.equipmentNumber}</Descriptions.Item>
          <Descriptions.Item label="设备名称">{r.equipmentName}</Descriptions.Item>
          <Descriptions.Item label="生产厂家">{r.manufacturerFactory}</Descriptions.Item>
          <Descriptions.Item label="品牌">{r.brand}</Descriptions.Item>
          <Descriptions.Item label="供应商">{r.supplier}</Descriptions.Item>
          <Descriptions.Item label="生产日期">{r.productionDate}</Descriptions.Item>
          <Descriptions.Item label="规格型号" span={2}>{r.modelSpecifications}</Descriptions.Item>
          <Descriptions.Item label="使用年限">{r.serverLife}年</Descriptions.Item>
          <Descriptions.Item label="折旧方式">{r.depreciationMethod}</Descriptions.Item>
          <Descriptions.Item label="位置">{r.equipmentLocal}</Descriptions.Item>
          <Descriptions.Item label="状态">{getStatusTag(r.status)}</Descriptions.Item>
          <Descriptions.Item label="部门">{r.department}</Descriptions.Item>
          <Descriptions.Item label="负责人">{r.responsiblePerson}</Descriptions.Item>
          {r.extAttrMap && r.extAttrMap.length > 0 && (
            <Descriptions.Item label="扩展属性" span={2}>
              {r.extAttrMap.map((attr, i) => (
                <Tag key={i}>{attr.key}: {attr.value}</Tag>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
        <AiMaintenancePanel
          equipment={{
            equipmentId: r.key || '',
            equipmentName: r.equipmentName,
            productionDate: r.productionDate || '',
            serverLife: r.serverLife || 0,
            status: r.status,
          } as EquipmentAiParams}
        />
      </>
    );
  }

  if (tabKey === 'equipment-maintenance') {
    const r = record as MaintenanceRecord;
    return (
      <Descriptions bordered column={2}>
        <Descriptions.Item label="计划ID">{r.planId}</Descriptions.Item>
        <Descriptions.Item label="设备名称">{r.equipmentName}</Descriptions.Item>
        <Descriptions.Item label="保养类型">{r.maintenanceType}</Descriptions.Item>
        <Descriptions.Item label="保养时间">{r.maintenanceTime}</Descriptions.Item>
        <Descriptions.Item label="维护人员">{r.maintainer}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusTag(r.status)}</Descriptions.Item>
        <Descriptions.Item label="保养内容" span={2}>{r.maintenanceContent}</Descriptions.Item>
        {r.partsReplaced && r.partsReplaced.length > 0 && (
          <Descriptions.Item label="更换零部件" span={2}>
            {r.partsReplaced.map((part, i) => (
              <Tag key={i}>{part.name} x{part.quantity} ({part.model})</Tag>
            ))}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="成本费用">¥{r.cost?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="备注">{r.remark}</Descriptions.Item>
      </Descriptions>
    );
  }

  const r = record as RepairRecord;
  return (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="工单ID">{r.workOrderId}</Descriptions.Item>
      <Descriptions.Item label="设备名称">{r.equipmentName}</Descriptions.Item>
      <Descriptions.Item label="报修时间">{r.reportTime}</Descriptions.Item>
      <Descriptions.Item label="状态">{getStatusTag(r.status)}</Descriptions.Item>
      <Descriptions.Item label="故障现象" span={2}>{r.faultPhenomenon}</Descriptions.Item>
      <Descriptions.Item label="响应时间">{r.responseTime}小时</Descriptions.Item>
      <Descriptions.Item label="维修时长">{r.repairTime}小时</Descriptions.Item>
      <Descriptions.Item label="维修人员">{r.repairPerson}</Descriptions.Item>
      <Descriptions.Item label="维修费用">¥{r.repairCost?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="维修措施" span={2}>{r.repairMeasures}</Descriptions.Item>
    </Descriptions>
  );
};

export default EquipmentDetail;
