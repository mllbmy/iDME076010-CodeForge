import type { EquipmentLedger, MaintenanceRecord, RepairRecord } from '@/store/types';

export function generateEquipmentData(): EquipmentLedger[] {
  const equipmentTemplates = [
    { equipmentName: '数控滚齿机', manufacturerFactory: '德国霍夫勒', brand: 'GLEASON', modelSpecifications: '最大模数12mm，最大直径800mm', department: '齿轮加工部', serverLife: 15 },
    { equipmentName: '数控磨齿机', manufacturerFactory: '德国克林贝格', brand: 'KLINGELNBERG', modelSpecifications: '最大直径800mm，精度DIN3级', department: '齿轮加工部', serverLife: 15 },
    { equipmentName: '数控插齿机', manufacturerFactory: '德国卡斯夫基', brand: 'SCHARMANN', modelSpecifications: '最大模数16mm，最大直径600mm', department: '齿轮加工部', serverLife: 12 },
    { equipmentName: '五轴联动加工中心', manufacturerFactory: '德国德玛吉', brand: 'DMG-MORI', modelSpecifications: '五轴联动，工作台800x800mm', department: '箱体加工部', serverLife: 20 },
    { equipmentName: '数控车床', manufacturerFactory: '日本山崎马扎克', brand: 'MAZAK', modelSpecifications: '最大回转直径600mm，最大长度1000mm', department: '箱体加工部', serverLife: 15 },
    { equipmentName: '数控铣床', manufacturerFactory: '日本大隈', brand: 'OKUMA', modelSpecifications: '工作台1000x500mm', department: '箱体加工部', serverLife: 15 },
    { equipmentName: '井式气体渗碳炉', manufacturerFactory: '德国易普森', brand: 'IPSEN', modelSpecifications: '最大装炉量1000kg，最高温度950℃', department: '热处理部', serverLife: 20 },
    { equipmentName: '多用炉生产线', manufacturerFactory: '奥地利爱协林', brand: 'AICHELIN', modelSpecifications: '连续式，产能500kg/h', department: '热处理部', serverLife: 20 },
    { equipmentName: '三坐标测量仪', manufacturerFactory: '德国温泽', brand: 'WENZEL', modelSpecifications: '测量范围1200x1000x800mm，精度±1.5μm', department: '质量部', serverLife: 15 },
    { equipmentName: '齿轮检测仪', manufacturerFactory: '德国克林贝格', brand: 'KLINGELNBERG', modelSpecifications: '最大直径600mm，精度DIN1级', department: '质量部', serverLife: 15 },
    { equipmentName: '动平衡机', manufacturerFactory: '德国申克', brand: 'SCHENCK', modelSpecifications: '最大转速12000rpm，最大重量500kg', department: '装配部', serverLife: 15 },
    { equipmentName: '数控锯床', manufacturerFactory: '浙江锯床', brand: '锯力煌', modelSpecifications: '最大锯切直径500mm', department: '下料部', serverLife: 10 },
    { equipmentName: '锻压机', manufacturerFactory: '济南二机床', brand: 'JIER', modelSpecifications: '公称压力2000吨', department: '锻造部', serverLife: 25 },
    { equipmentName: '抛光机', manufacturerFactory: '国产', brand: '通用', modelSpecifications: '最大直径400mm', department: '精密加工部', serverLife: 10 },
    { equipmentName: '清洗机', manufacturerFactory: '国产', brand: '通用', modelSpecifications: '超声波清洗，容量500L', department: '装配部', serverLife: 10 },
  ];

  const suppliers = ['霍夫勒中国', '克林贝格中国', '卡斯夫基中国', '德玛吉中国', '马扎克中国', '大隈中国', '易普森中国', '爱协林中国', '温泽中国', '申克中国', '国产供应商'];
  const locations = ['一号车间A区', '一号车间B区', '一号车间C区', '二号车间A区', '二号车间B区', '三号车间A区', '三号车间B区', '检测中心A区', '检测中心B区', '装配车间A区', '装配车间B区', '下料车间', '锻造车间'];
  const persons = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '陈一', '林二', '黄三', '刘四', '杨五', '何六'];
  const statuses = ['运行中', '运行中', '运行中', '运行中', '待机', '维护中', '故障'];

  const equipment: EquipmentLedger[] = [];
  for (let i = 0; i < 50; i++) {
    const template = equipmentTemplates[i % equipmentTemplates.length];
    const idx = Math.floor(i / equipmentTemplates.length) + 1;
    equipment.push({
      key: String(i + 1),
      equipmentNumber: `EQ-${String(i + 1).padStart(3, '0')}`,
      equipmentName: idx > 1 ? `${template.equipmentName}-${idx}` : template.equipmentName,
      manufacturerFactory: template.manufacturerFactory,
      brand: template.brand,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      productionDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      modelSpecifications: template.modelSpecifications,
      serverLife: template.serverLife,
      depreciationMethod: '年限平均法',
      equipmentLocal: locations[Math.floor(Math.random() * locations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      department: template.department,
      responsiblePerson: persons[Math.floor(Math.random() * persons.length)],
      extAttrMap: [{ key: '电机功率', value: `${Math.floor(Math.random() * 50) + 10}kW` }],
    });
  }
  return equipment;
}

export function generateMaintenanceData(equipmentData: EquipmentLedger[]): MaintenanceRecord[] {
  const maintenanceTypes = ['定期保养', '精密保养', '日常保养', '精密校准', '预防性维护'];
  const maintainers = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'];
  const statuses = ['已完成', '已完成', '已完成', '进行中', '待处理'];
  const contents = [
    '检查齿轮箱润滑油，清洁冷却液系统，检查导轨润滑',
    '检查主轴精度，校准测量系统，更换冷却液滤芯',
    '检查主轴拉力，更换丝杠防护罩，清洁刀库',
    '检查炉门密封，更换热电偶，检查碳势控制系统',
    '校准测头，检查气浮导轨，清洁光栅尺',
    '更换液压油，检查密封件，清洁液压系统',
    '检查电气系统，更换易损件，清洁设备',
  ];

  const records: MaintenanceRecord[] = [];
  for (let i = 0; i < 80; i++) {
    const equipment = equipmentData[Math.floor(Math.random() * equipmentData.length)];
    records.push({
      key: String(i + 1),
      planId: `MP-${String(i + 1).padStart(3, '0')}`,
      equipmentId: equipment.equipmentNumber,
      equipmentName: equipment.equipmentName,
      maintenanceType: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
      maintenanceTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:00`,
      maintenanceContent: contents[Math.floor(Math.random() * contents.length)],
      maintainer: maintainers[Math.floor(Math.random() * maintainers.length)],
      partsReplaced: [{ name: '润滑油', quantity: Math.floor(Math.random() * 5) + 1, model: 'Shell Omala 220' }],
      cost: Math.floor(Math.random() * 4000) + 500,
      remark: '保养完成',
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return records;
}

export function generateRepairData(equipmentData: EquipmentLedger[]): RepairRecord[] {
  const faultPhenomena = [
    '主轴振动大，加工精度下降',
    '定位误差超差，重复定位精度下降',
    '控制系统异常，参数丢失',
    '液压系统漏油，压力不足',
    '冷却系统故障，温度过高',
    '传动系统异响，齿轮磨损',
    '电气系统故障，无法启动',
    '气动系统漏气，压力不稳',
  ];
  const repairMeasures = [
    '更换主轴轴承，重新动平衡，调整主轴预紧力',
    '更换编码器，重新标定，调整伺服参数',
    '重新加载系统参数，更换电池，校准系统',
    '更换密封件，检查管路，补充液压油',
    '更换冷却泵，清洗冷却器，补充冷却液',
    '更换齿轮，调整间隙，重新润滑',
    '更换电气元件，检查线路，重新调试',
    '更换气缸密封，检查管路，调整气压',
  ];
  const repairPersons = ['张三', '李四', '王五', '赵六', '孙七', '周八'];
  const statuses = ['已完成', '已完成', '已完成', '进行中', '待处理'];

  const records: RepairRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const equipment = equipmentData[Math.floor(Math.random() * equipmentData.length)];
    const faultIndex = Math.floor(Math.random() * faultPhenomena.length);
    records.push({
      key: String(i + 1),
      equipmentId: equipment.equipmentNumber,
      equipmentName: equipment.equipmentName,
      faultPhenomenon: faultPhenomena[faultIndex],
      reportTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      workOrderId: `WO-${String(i + 1).padStart(3, '0')}`,
      responseTime: Math.floor(Math.random() * 5) + 1,
      repairTime: Math.floor(Math.random() * 12) + 2,
      repairMeasures: repairMeasures[faultIndex],
      repairCost: Math.floor(Math.random() * 8000) + 1000,
      repairPerson: repairPersons[Math.floor(Math.random() * repairPersons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      faultImages: [],
    });
  }
  return records;
}
