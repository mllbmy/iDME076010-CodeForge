export const workshops = ['锻造车间', '机加工车间', '精密加工车间', '热处理车间', '齿轮加工车间', '装配车间', '质检中心', '测试中心', '成品仓库'];

export const products = ['行星减速器-中心轮', '行星减速器-行星轮', '行星减速器-行星架', '行星减速器-内齿圈', '行星减速器-输入轴', '行星减速器-输出轴', '行星减速器-整机'];

export const statusOptions = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

export const generateProcessData = () => {
  const baseProcesses = [
    { processName: '毛坯制造', processDescription: '原材料切割、锻造毛坯成型', workshop: '锻造车间', standardHours: 2.5, equipment: '数控锯床、锻压机', operator: '张三' },
    { processName: '粗加工', processDescription: '粗车外圆、端面、内孔，留精加工余量', workshop: '机加工车间', standardHours: 1.5, equipment: '数控车床', operator: '李四' },
    { processName: '精加工', processDescription: '精车、磨削至最终尺寸，保证形位公差', workshop: '精密加工车间', standardHours: 3.0, equipment: '数控磨齿机、数控车床', operator: '王五' },
    { processName: '检测', processDescription: '尺寸检测、齿轮精度检测、形位公差检测', workshop: '质检中心', standardHours: 0.5, equipment: '三坐标测量仪、齿轮检测仪', operator: '赵六' },
    { processName: '入库', processDescription: '成品检验合格后入库登记', workshop: '成品仓库', standardHours: 0.25, equipment: '仓库管理系统', operator: '钱七' },
    { processName: '热处理', processDescription: '渗碳淬火、回火处理，提高表面硬度', workshop: '热处理车间', standardHours: 8.0, equipment: '井式气体渗碳炉、回火炉', operator: '周八' },
    { processName: '滚齿加工', processDescription: '滚切齿轮齿形', workshop: '齿轮加工车间', standardHours: 1.0, equipment: '数控滚齿机', operator: '张三' },
    { processName: '磨齿加工', processDescription: '齿面精密磨削，提高齿轮精度', workshop: '精密加工车间', standardHours: 1.5, equipment: '数控磨齿机', operator: '李四' },
    { processName: '部件装配', processDescription: '行星轮组件装配', workshop: '装配车间', standardHours: 0.75, equipment: '专用装配台', operator: '孙九' },
    { processName: '性能测试', processDescription: '空载、负载、噪音、温升测试', workshop: '测试中心', standardHours: 2.0, equipment: '寿命试验机', operator: '吴十' },
    { processName: '钻孔攻丝', processDescription: '钻削螺纹孔、定位孔', workshop: '机加工车间', standardHours: 0.8, equipment: '数控钻床', operator: '郑十一' },
    { processName: '铣削加工', processDescription: '铣削键槽、平面', workshop: '机加工车间', standardHours: 1.2, equipment: '数控铣床', operator: '冯十二' },
    { processName: '珩磨加工', processDescription: '内孔珩磨，提高表面粗糙度', workshop: '精密加工车间', standardHours: 1.0, equipment: '珩磨机', operator: '陈十三' },
    { processName: '抛光处理', processDescription: '表面抛光处理', workshop: '精密加工车间', standardHours: 0.5, equipment: '抛光机', operator: '楚十四' },
    { processName: '清洗防锈', processDescription: '零件清洗、防锈处理', workshop: '装配车间', standardHours: 0.3, equipment: '清洗机', operator: '魏十五' },
  ];

  const processes = [];
  for (let i = 0; i < 45; i++) {
    const base = baseProcesses[i % baseProcesses.length];
    const idx = Math.floor(i / baseProcesses.length) + 1;
    processes.push({
      key: String(i + 1),
      processId: `PROC-${String(i + 1).padStart(3, '0')}`,
      processName: idx > 1 ? `${base.processName}-${idx}` : base.processName,
      processDescription: base.processDescription,
      workshop: base.workshop,
      standardHours: base.standardHours,
      equipment: base.equipment,
      operator: base.operator,
      status: Math.random() > 0.1 ? '启用' : '停用',
      order: i + 1,
      createDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      updateTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }
  return processes;
};

export const generateProcessRouteData = () => {
  const routeTemplates = [
    { routeName: '中心轮零件加工', product: '行星减速器-中心轮', routeDescription: '中心轮从毛坯到成品的完整加工工艺路线' },
    { routeName: '行星轮零件加工', product: '行星减速器-行星轮', routeDescription: '行星轮从毛坯到成品的完整加工工艺路线' },
    { routeName: '行星架零件加工', product: '行星减速器-行星架', routeDescription: '行星架从毛坯到成品的完整加工工艺路线' },
    { routeName: '行星减速器总装', product: '行星减速器-整机', routeDescription: '行星减速器从零件到成品的总装工艺路线' },
    { routeName: '内齿圈加工', product: '行星减速器-内齿圈', routeDescription: '内齿圈从毛坯到成品的完整加工工艺路线' },
    { routeName: '输入轴加工', product: '行星减速器-输入轴', routeDescription: '输入轴从毛坯到成品的完整加工工艺路线' },
    { routeName: '输出轴加工', product: '行星减速器-输出轴', routeDescription: '输出轴从毛坯到成品的完整加工工艺路线' },
    { routeName: '端盖加工', product: '行星减速器-端盖', routeDescription: '端盖从毛坯到成品的完整加工工艺路线' },
    { routeName: '壳体加工', product: '行星减速器-壳体', routeDescription: '壳体从毛坯到成品的完整加工工艺路线' },
    { routeName: '法兰盘加工', product: '行星减速器-法兰盘', routeDescription: '法兰盘从毛坯到成品的完整加工工艺路线' },
  ];

  const routeWorkshops = ['锻造车间', '机加工车间', '精密加工车间', '热处理车间', '齿轮加工车间', '装配车间', '质检中心', '测试中心', '成品仓库'];
  const processNames = ['毛坯制造', '粗加工', '精加工', '检测', '入库', '热处理', '滚齿加工', '磨齿加工', '部件装配', '性能测试'];
  const operators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];

  const routes = [];
  for (let i = 0; i < 25; i++) {
    const template = routeTemplates[i % routeTemplates.length];
    const idx = Math.floor(i / routeTemplates.length) + 1;
    const processCount = Math.floor(Math.random() * 4) + 5;
    const processList = [];

    for (let j = 0; j < processCount; j++) {
      processList.push({
        key: `${i}-${j}`,
        step: j + 1,
        processId: `PROC-${String(Math.floor(Math.random() * 45) + 1).padStart(3, '0')}`,
        processName: processNames[j % processNames.length],
        workshop: routeWorkshops[Math.floor(Math.random() * routeWorkshops.length)],
        standardHours: Math.round((Math.random() * 3 + 0.5) * 10) / 10,
        equipment: '数控加工设备',
      });
    }

    const historyCount = Math.floor(Math.random() * 3) + 1;
    const history = [];
    for (let h = 0; h < historyCount; h++) {
      history.push({
        key: `${i}-${h}`,
        version: `V1.${h}`,
        changeContent: h === 0 ? '初始版本' : '优化工艺参数',
        changeDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        changePerson: operators[Math.floor(Math.random() * operators.length)],
      });
    }

    routes.push({
      key: String(i + 1),
      routeId: `ROUTE-${String(i + 1).padStart(3, '0')}`,
      routeName: idx > 1 ? `${template.routeName}-${idx}` : template.routeName,
      version: `V1.${Math.floor(Math.random() * 3)}`,
      product: template.product,
      routeDescription: template.routeDescription,
      status: Math.random() > 0.15 ? '启用' : '禁用',
      createDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      updateTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      processList,
      history,
      ...(i === 0 ? {
        blockchainCertified: true,
        blockchainTxHash: '0x3a7f8b2c1d9e4f6a5b8c7d2e1f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
      } : i === 1 ? {
        blockchainCertified: true,
        blockchainTxHash: '0x8c2d1e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      } : {
        blockchainCertified: false,
      }),
    });
  }
  return routes;
};
