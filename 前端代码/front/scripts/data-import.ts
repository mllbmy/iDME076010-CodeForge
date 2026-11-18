import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000, headers: { 'Content-Type': 'application/json' } });

const STATUS_MAP: Record<string, string> = {
  '运行中': 'D001',
  '待机': 'D001',
  '维护中': 'D002',
  '故障': 'D002',
};

const DEPRECIATION_MAP: Record<string, string> = {
  '年限平均法': 'B002',
  '双倍余额递减法': 'B001',
  '年数总和法': 'B003',
  '工作量法': 'B004',
};

const DEVICE_TYPE_MAP: Record<string, string> = {
  '齿轮加工部': 'A002',
  '箱体加工部': 'A002',
  '热处理部': 'A008',
  '质量部': 'A004',
  '装配部': 'A002',
  '下料部': 'A003',
  '锻造部': 'A006',
  '精密加工部': 'A009',
};

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

function generateMockEquipmentData() {
  const equipment: any[] = [];
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
    });
  }
  return equipment;
}

const partTemplates = [
  { name: '齿轮轴', part_Code: 'GS', part_Category: 'C009', material: '20CrMnTi合金钢', specification: 'Φ50×200mm', weight: 2.85, unit: '个' },
  { name: '输出轴', part_Code: 'OS', part_Category: 'C008', material: '40CrNiMoA合金钢', specification: 'Φ80×300mm', weight: 5.6, unit: '个' },
  { name: '太阳轮', part_Code: 'SR', part_Category: 'C005', material: '20CrMnTi合金钢', specification: 'M3Z28', weight: 1.2, unit: '个' },
  { name: '内齿圈', part_Code: 'IR', part_Category: 'C007', material: '42CrMo合金钢', specification: 'M3Z72', weight: 8.5, unit: '个' },
  { name: '行星轮', part_Code: 'PR', part_Category: 'C002', material: '20CrMnTi合金钢', specification: 'M3Z26', weight: 0.9, unit: '个' },
  { name: '深沟球轴承', part_Code: 'BB', part_Category: 'C003', material: 'GCr15轴承钢', specification: '6208-2RS', weight: 0.35, unit: '个' },
  { name: '圆锥滚子轴承', part_Code: 'TB', part_Category: 'C003', material: 'GCr15轴承钢', specification: '30206', weight: 0.28, unit: '个' },
  { name: '油封', part_Code: 'SL', part_Category: 'C010', material: 'NBR丁腈橡胶', specification: 'TC35×52×7', weight: 0.02, unit: '个' },
  { name: 'O型圈', part_Code: 'OR', part_Category: 'C010', material: 'NBR丁腈橡胶', specification: 'Φ30×3.5', weight: 0.005, unit: '个' },
  { name: '弹性联轴器', part_Code: 'CP', part_Category: 'C011', material: '45钢+铝合金', specification: 'LM-D40', weight: 0.8, unit: '个' },
  { name: '减速器壳体', part_Code: 'HS', part_Category: 'C012', material: 'HT250灰铸铁', specification: '350×280×200mm', weight: 28, unit: '个' },
  { name: '端盖', part_Code: 'EC', part_Category: 'C012', material: 'HT250灰铸铁', specification: 'Φ120×15mm', weight: 1.5, unit: '个' },
];

function generateMockPartData() {
  const parts: any[] = [];
  for (let i = 0; i < partTemplates.length; i++) {
    const t = partTemplates[i];
    parts.push({
      name: t.name,
      part_Code: `${t.part_Code}-001`,
      part_Category: t.part_Category,
      material: t.material,
      specification: t.specification,
      weight: t.weight,
      unit: t.unit,
      drawing_No: `DWG-${t.part_Code}-V1.0`,
      status: 'D001',
    });
  }
  return parts;
}

const procedureTemplates = [
  { procedure_Name: '粗车外圆', procedure_Code: 'PROC-ROUGH-TURN', standard_Time: 30, department: '机加车间一班' },
  { procedure_Name: '精车外圆', procedure_Code: 'PROC-FINE-TURN', standard_Time: 45, department: '机加车间一班' },
  { procedure_Name: '粗车端面', procedure_Code: 'PROC-ROUGH-FACE', standard_Time: 20, department: '机加车间一班' },
  { procedure_Name: '精车端面', procedure_Code: 'PROC-FINE-FACE', standard_Time: 35, department: '机加车间一班' },
  { procedure_Name: '滚齿', procedure_Code: 'PROC-HOBBING', standard_Time: 60, department: '齿轮加工部' },
  { procedure_Name: '磨齿', procedure_Code: 'PROC-GRINDING', standard_Time: 90, department: '齿轮加工部' },
  { procedure_Name: '插齿', procedure_Code: 'PROC-SLOTTING', standard_Time: 50, department: '齿轮加工部' },
  { procedure_Name: '热处理-渗碳淬火', procedure_Code: 'PROC-CARBURIZE', standard_Time: 480, department: '热处理部' },
  { procedure_Name: '三坐标检测', procedure_Code: 'PROC-CMM', standard_Time: 40, department: '质量部' },
  { procedure_Name: '动平衡', procedure_Code: 'PROC-BALANCE', standard_Time: 25, department: '装配部' },
  { procedure_Name: '清洗', procedure_Code: 'PROC-CLEAN', standard_Time: 15, department: '装配部' },
  { procedure_Name: '装配', procedure_Code: 'PROC-ASSEMBLE', standard_Time: 120, department: '装配部' },
];

function generateMockProcedureData(partIds: string[]) {
  const procedures: any[] = [];
  for (let i = 0; i < procedureTemplates.length; i++) {
    const t = procedureTemplates[i];
    const partIdx = i % partIds.length;
    procedures.push({
      procedure_Name: t.procedure_Name,
      procedure_Code: `${t.procedure_Code}-${String(i + 1).padStart(3, '0')}`,
      standard_Time: t.standard_Time,
      related_Part: { id: partIds[partIdx] },
      department: t.department,
      status: 'D001',
    });
  }
  return procedures;
}

const planTemplates = [
  { plan_Name: '2024年5月减速器生产计划', plan_Code: 'PLAN-202405-REDUCER', plan_Type: '月度计划', priority: '高', status: 'DRAFT' },
  { plan_Name: '2024年6月齿轮轴生产计划', plan_Code: 'PLAN-202406-GS', plan_Type: '月度计划', priority: '中', status: 'DRAFT' },
  { plan_Name: '2024年Q2热处理计划', plan_Code: 'PLAN-Q2-HEAT', plan_Type: '季度计划', priority: '高', status: 'REVIEWED' },
  { plan_Name: '2024年5月质量检测计划', plan_Code: 'PLAN-202405-QC', plan_Type: '月度计划', priority: '中', status: 'DRAFT' },
  { plan_Name: '2024年6月装配计划', plan_Code: 'PLAN-202406-ASSY', plan_Type: '月度计划', priority: '低', status: 'DRAFT' },
];

function generateMockPlanData() {
  const plans: any[] = [];
  for (let i = 0; i < planTemplates.length; i++) {
    const t = planTemplates[i];
    plans.push({
      plan_Name: t.plan_Name,
      plan_Code: t.plan_Code,
      plan_Type: t.plan_Type,
      start_Time: '2024-05-01T08:00:00',
      end_Time: '2024-05-31T18:00:00',
      priority: t.priority,
      status: t.status,
      description: `${t.plan_Name}执行中`,
    });
  }
  return plans;
}

async function importEquipment(): Promise<string[]> {
  console.log('\n=== 开始导入设备数据 ===');
  const mockData = generateMockEquipmentData();
  const ids: string[] = [];

  for (let i = 0; i < mockData.length; i++) {
    const item = mockData[i];
    const dto = {
      devicename: item.equipmentName,
      devicecode: item.equipmentNumber,
      device_Type: DEVICE_TYPE_MAP[item.department] || 'A002',
      status: STATUS_MAP[item.status] || 'D001',
      supplier: item.supplier,
      specification: item.modelSpecifications,
      purchase_Date: item.productionDate,
      location: item.equipmentLocal,
      useful_Life_Years: item.serverLife,
      depreciation_Method: DEPRECIATION_MAP[item.depreciationMethod] || 'B002',
      description: `${item.equipmentName} | ${item.manufacturerFactory} | ${item.brand} | 负责人:${item.responsiblePerson} | 部门:${item.department}`,
    };

    try {
      const res = await api.post('/Equipment/add', dto);
      const id = res.data?.data?.id;
      if (id) ids.push(id);
      console.log(`  [${i + 1}/${mockData.length}] 设备 ${item.equipmentNumber} 导入成功, id=${id}`);
    } catch (err: any) {
      console.error(`  [${i + 1}/${mockData.length}] 设备 ${item.equipmentNumber} 导入失败: ${err.message}`);
    }
  }

  console.log(`=== 设备导入完成: 成功${ids.length}/${mockData.length} ===\n`);
  return ids;
}

async function importPart(): Promise<string[]> {
  console.log('\n=== 开始导入零件数据 ===');
  const mockData = generateMockPartData();
  const ids: string[] = [];

  for (let i = 0; i < mockData.length; i++) {
    const item = mockData[i];
    const dto = {
      name: item.name,
      part_Code: item.part_Code,
      part_Category: item.part_Category,
      material: item.material,
      specification: item.specification,
      weight: item.weight,
      unit: item.unit,
      drawing_No: item.drawing_No,
      status: item.status,
      master: {},
      branch: {},
    };

    try {
      const res = await api.post('/Part/add', dto);
      const id = res.data?.data?.id;
      if (id) ids.push(id);
      console.log(`  [${i + 1}/${mockData.length}] 零件 ${item.part_Code} 导入成功, id=${id}`);
    } catch (err: any) {
      console.error(`  [${i + 1}/${mockData.length}] 零件 ${item.part_Code} 导入失败: ${err.message}`);
    }
  }

  console.log(`=== 零件导入完成: 成功${ids.length}/${mockData.length} ===\n`);
  return ids;
}

async function importProcedure(partIds: string[]): Promise<string[]> {
  console.log('\n=== 开始导入工序数据 ===');
  if (partIds.length === 0) {
    console.error('  零件ID为空，无法创建工序（工序需要关联零件）');
    console.log('  尝试查询已有零件...');
    try {
      const res = await api.post('/Part/query', {
        queryRequest: { filter: {} },
        pageVO: { pageNo: 1, pageSize: 50 },
      });
      const items = res.data?.data || [];
      items.forEach((item: any) => { if (item.id) partIds.push(item.id); });
      console.log(`  查询到${partIds.length}个零件`);
    } catch (err: any) {
      console.error(`  查询零件失败: ${err.message}`);
      return [];
    }
  }

  const mockData = generateMockProcedureData(partIds);
  const ids: string[] = [];

  for (let i = 0; i < mockData.length; i++) {
    const item = mockData[i];
    try {
      const res = await api.post('/WorkingProcedure/add', item);
      const id = res.data?.data?.id;
      if (id) ids.push(id);
      console.log(`  [${i + 1}/${mockData.length}] 工序 ${item.procedure_Code} 导入成功, id=${id}`);
    } catch (err: any) {
      console.error(`  [${i + 1}/${mockData.length}] 工序 ${item.procedure_Code} 导入失败: ${err.message}`);
    }
  }

  console.log(`=== 工序导入完成: 成功${ids.length}/${mockData.length} ===\n`);
  return ids;
}

async function importPlan(): Promise<string[]> {
  console.log('\n=== 开始导入工作计划数据 ===');
  const mockData = generateMockPlanData();
  const ids: string[] = [];

  for (let i = 0; i < mockData.length; i++) {
    const item = mockData[i];
    try {
      const res = await api.post('/WorkingPlan/add', item);
      const id = res.data?.data?.id;
      if (id) ids.push(id);
      console.log(`  [${i + 1}/${mockData.length}] 工作计划 ${item.plan_Code} 导入成功, id=${id}`);
    } catch (err: any) {
      console.error(`  [${i + 1}/${mockData.length}] 工作计划 ${item.plan_Code} 导入失败: ${err.message}`);
    }
  }

  console.log(`=== 工作计划导入完成: 成功${ids.length}/${mockData.length} ===\n`);
  return ids;
}

async function cleanModule(moduleName: string, endpoint: string) {
  console.log(`\n=== 清空${moduleName}数据 ===`);
  try {
    let pageNo = 1;
    let totalDeleted = 0;
    while (true) {
      const res = await api.post(endpoint, {
        queryRequest: { filter: {} },
        pageVO: { pageNo, pageSize: 50 },
      });
      const items = res.data?.data || [];
      if (items.length === 0) break;

      const ids = items.map((item: any) => item.id).filter(Boolean);
      if (ids.length === 0) break;

      if (moduleName === 'Part') {
        const masterIds = items.map((item: any) => item.masterId || item.id).filter(Boolean);
        await api.post(`/${moduleName}/batchLogicalDelete`, { masterIds, modifier: 'system' });
      } else {
        await api.post(`/${moduleName}/batchLogicalDelete`, { ids, modifier: 'system' });
      }
      totalDeleted += ids.length;
      pageNo++;
    }
    console.log(`  已逻辑删除${totalDeleted}条${moduleName}数据`);
  } catch (err: any) {
    console.error(`  清空${moduleName}失败: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const moduleArg = args.find(a => a.startsWith('--module='));
  const module = moduleArg ? moduleArg.split('=')[1] : 'all';
  const shouldClean = args.includes('--clean');

  console.log(`API地址: ${API_BASE}`);
  console.log(`导入模块: ${module}`);
  console.log(`清空模式: ${shouldClean}`);

  if (shouldClean) {
    const modulesToClean = module === 'all'
      ? ['Equipment', 'WorkingPlan', 'WorkingProcedure', 'Part']
      : [module.charAt(0).toUpperCase() + module.slice(1)];

    const endpoints: Record<string, string> = {
      Equipment: '/Equipment/query',
      Part: '/Part/query',
      WorkingProcedure: '/WorkingProcedure/query',
      WorkingPlan: '/WorkingPlan/query',
    };

    for (const m of modulesToClean) {
      await cleanModule(m, endpoints[m] || `/${m}/query`);
    }
  }

  let partIds: string[] = [];

  if (module === 'all' || module === 'equipment') {
    await importEquipment();
  }

  if (module === 'all' || module === 'part') {
    partIds = await importPart();
  }

  if (module === 'all' || module === 'procedure') {
    if (module === 'procedure' && partIds.length === 0) {
      partIds = [];
    }
    await importProcedure(partIds);
  }

  if (module === 'all' || module === 'plan') {
    await importPlan();
  }

  console.log('\n=== 数据导入全部完成 ===');
}

main().catch(err => {
  console.error('导入脚本执行失败:', err);
  process.exit(1);
});
