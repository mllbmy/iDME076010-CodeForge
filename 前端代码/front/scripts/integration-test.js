import axios from 'axios';

const BASE = 'http://localhost:8080/api';
const TIMEOUT = 10000;

const results = [];

function log(module, endpoint, method, status, code, message, dataPreview, latency) {
  const entry = { module, endpoint, method, status, code, message, dataPreview, latency };
  results.push(entry);
  const icon = code === 200 ? '✅' : '⚠️';
  console.log(`${icon} [${module}] ${method} ${endpoint} → HTTP ${status}, code=${code}, latency=${latency}ms`);
  if (message && code !== 200) console.log(`   message: ${message}`);
  if (dataPreview) console.log(`   data: ${dataPreview}`);
}

async function testEndpoint(module, endpoint, method, payload) {
  const url = `${BASE}${endpoint}`;
  const start = Date.now();
  try {
    const config = {
      timeout: TIMEOUT,
      validateStatus: () => true,
      headers: { 'Content-Type': 'application/json' },
    };
    const res = method === 'POST'
      ? await axios.post(url, payload, config)
      : await axios.get(url, config);
    const latency = Date.now() - start;
    const code = res.data?.code ?? res.status;
    const message = res.data?.message ?? '';
    let dataPreview = '';
    if (res.data?.data) {
      const d = res.data.data;
      if (Array.isArray(d)) {
        dataPreview = `array[${d.length}]`;
      } else if (d && typeof d === 'object') {
        const keys = Object.keys(d).slice(0, 8);
        dataPreview = `object{${keys.join(',')}}`;
      } else {
        dataPreview = String(d).substring(0, 100);
      }
    }
    log(module, endpoint, method, res.status, code, message, dataPreview, latency);
    return res.data;
  } catch (err) {
    const latency = Date.now() - start;
    log(module, endpoint, method, 0, 0, err.message, '', latency);
    return null;
  }
}

async function main() {
  console.log('=== TreaFour 前后端联调测试（修正API路径） ===');
  console.log(`后端地址: ${BASE}`);
  console.log(`测试时间: ${new Date().toISOString()}\n`);

  // ========== 1. Equipment 设备模块 ==========
  console.log('--- 1. Equipment 设备模块 ---');
  const eqListRes = await testEndpoint('Equipment', '/Equipment/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });
  await testEndpoint('Equipment', '/Equipment/get', 'POST', { id: '1' });
  await testEndpoint('Equipment', '/Equipment/add', 'POST', {
    devicename: '联调测试设备',
    devicecode: 'TEST-API-001',
    device_Type: 'A002',
    status: 'D001',
    supplier: '测试供应商',
    description: '联调测试创建',
  });
  await testEndpoint('Equipment', '/Equipment/update', 'POST', {
    id: '1',
    devicename: '联调更新测试',
  });
  await testEndpoint('Equipment', '/Equipment/delete', 'POST', { id: '99999', modifier: 'admin' });
  await testEndpoint('Equipment', '/Equipment/count', 'POST', {});
  await testEndpoint('Equipment', '/Equipment/statics', 'POST', {
    queryRequest: { filter: { condition: [] } },
    pageVO: { pageNo: 1, pageSize: 10 },
  });

  // ========== 2. Part 零件模块 ==========
  console.log('\n--- 2. Part 零件模块 ---');
  await testEndpoint('Part', '/Part/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });
  await testEndpoint('Part', '/Part/get', 'POST', { id: '1' });
  await testEndpoint('Part', '/Part/add', 'POST', {
    partName: '联调测试零件',
    partCode: 'P-TEST-001',
    category: 'C001',
  });

  // ========== 3. WorkingProcedure 工序模块 ==========
  console.log('\n--- 3. WorkingProcedure 工序模块 ---');
  await testEndpoint('WorkingProcedure', '/WorkingProcedure/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });
  await testEndpoint('WorkingProcedure', '/WorkingProcedure/get', 'POST', { id: '1' });

  // ========== 4. WorkingPlan 工作计划模块 ==========
  console.log('\n--- 4. WorkingPlan 工作计划模块 ---');
  await testEndpoint('WorkingPlan', '/WorkingPlan/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });
  await testEndpoint('WorkingPlan', '/WorkingPlan/get', 'POST', { id: '1' });

  // ========== 5. 保养/维修模块 ==========
  console.log('\n--- 5. 保养/维修模块 ---');
  await testEndpoint('Maintenance', '/EquipmentMaintenance/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });
  await testEndpoint('Repair', '/EquipmentRepair/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });

  // ========== 6. Bom_relation 模块 ==========
  console.log('\n--- 6. Bom_relation 模块 ---');
  await testEndpoint('Bom_relation', '/Bom_relation/list', 'POST', {
    queryRequest: {
      filter: { condition: [] },
      sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      select: [],
    },
    pageVO: { pageNo: 1, pageSize: 10 },
  });

  // ========== 7. 错误处理和边界条件 ==========
  console.log('\n--- 7. 错误处理和边界条件 ---');
  await testEndpoint('Boundary', '/Equipment/get', 'POST', { id: 'nonexistent-id-99999' });
  await testEndpoint('Boundary', '/Equipment/list', 'POST', {});
  await testEndpoint('Boundary', '/Equipment/add', 'POST', {});
  await testEndpoint('Boundary', '/NonExistModule/list', 'POST', {});

  // ========== 8. 前端API路径对照 ==========
  console.log('\n--- 8. 前端API路径对照测试 ---');
  await testEndpoint('PathCheck', '/Equipment/create', 'POST', {});
  await testEndpoint('PathCheck', '/Equipment/add', 'POST', {});

  // ========== 汇总 ==========
  console.log('\n\n========================================');
  console.log('=== 测试结果汇总 ===');
  console.log('========================================');
  const total = results.length;
  const success = results.filter(r => r.code === 200).length;
  const licenseErr = results.filter(r => r.message && r.message.includes('license')).length;
  const methodNotAllowed = results.filter(r => r.status === 405).length;
  const httpErr = results.filter(r => r.status >= 400 && r.status !== 405).length;
  const networkErr = results.filter(r => r.status === 0).length;
  const avgLatency = Math.round(results.reduce((s, r) => s + r.latency, 0) / total);

  console.log(`总测试数: ${total}`);
  console.log(`成功(code=200): ${success}`);
  console.log(`许可证错误(license): ${licenseErr}`);
  console.log(`路径不存在(405): ${methodNotAllowed}`);
  console.log(`其他HTTP错误(4xx/5xx): ${httpErr}`);
  console.log(`网络错误: ${networkErr}`);
  console.log(`平均延迟: ${avgLatency}ms`);

  console.log('\n--- 按模块统计 ---');
  const modules = [...new Set(results.map(r => r.module))];
  for (const mod of modules) {
    const modResults = results.filter(r => r.module === mod);
    const modSuccess = modResults.filter(r => r.code === 200).length;
    console.log(`  ${mod}: ${modSuccess}/${modResults.length} 通过`);
  }

  console.log('\n--- 详细结果 ---');
  for (const r of results) {
    const icon = r.code === 200 ? '✅' : '❌';
    console.log(`${icon} ${r.module} | ${r.method} ${r.endpoint} | HTTP${r.status} code=${r.code} | ${r.latency}ms`);
  }
}

main().catch(console.error);
