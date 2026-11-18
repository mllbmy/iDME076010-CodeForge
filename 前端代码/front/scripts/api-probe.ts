import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

async function probeEndpoint(url: string, label: string) {
  try {
    const res = await axios.post(url, {}, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      validateStatus: () => true,
    });
    if (res.status === 200 && res.data?.code === 200) {
      console.log(`[OK] ${label} (${url}) — API存在`);
      return true;
    }
    if (res.status === 404) {
      console.log(`[FAIL] ${label} (${url}) — 404 API不存在`);
      return false;
    }
    console.log(`[UNKNOWN] ${label} (${url}) — status=${res.status}, code=${res.data?.code}`);
    return false;
  } catch (err: any) {
    console.log(`[ERROR] ${label} (${url}) — ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('=== 后端API可用性探测 ===\n');

  const maintenanceList = await probeEndpoint(`${BASE_URL}/EquipmentMaintenance/list`, '保养列表');
  const maintenanceAdd = await probeEndpoint(`${BASE_URL}/EquipmentMaintenance/add`, '保养新增');
  const repairList = await probeEndpoint(`${BASE_URL}/EquipmentRepair/list`, '维修列表');
  const repairAdd = await probeEndpoint(`${BASE_URL}/EquipmentRepair/add`, '维修新增');

  console.log('\n=== 探测结果汇总 ===');
  console.log(`保养API: ${maintenanceList && maintenanceAdd ? '可用' : '不可用'}`);
  console.log(`维修API: ${repairList && repairAdd ? '可用' : '不可用'}`);

  if (!maintenanceList || !repairList) {
    console.log('\n建议：采用策略B降级方案，保养/维修在Real模式下使用Mock实例');
  }
}

main();
