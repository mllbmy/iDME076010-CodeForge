import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Space, App } from 'antd';
import { ClockCircleOutlined, ToolOutlined, AlertOutlined, CheckCircleOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import echarts from '@/utils/echarts';
import { exportMultiSheetExcel, getExcelUtils } from '@/utils/excel';
import { dataStore } from '../store/dataStore';
import { EquipmentLedger, MaintenanceRecord, RepairRecord } from '../store/types';
import { InsightAiPanel } from '@/components/ai';

const { Text } = Typography;

interface Stats {
  total: number;
  running: number;
  standby: number;
  maintenance: number;
  fault: number;
  completedMaintenance: number;
  inProgressMaintenance: number;
  pendingMaintenance: number;
  completedRepair: number;
  inProgressRepair: number;
  pendingRepair: number;
  totalMaintenanceCost: number;
  totalRepairCost: number;
}

const ReportsAnalysis: React.FC = () => {
  const { message } = App.useApp();
  const equipmentChartRef = useRef<HTMLDivElement>(null);
  const maintenanceChartRef = useRef<HTMLDivElement>(null);
  const costChartRef = useRef<HTMLDivElement>(null);
  const locationChartRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState<Stats>({
    total: 0,
    running: 0,
    standby: 0,
    maintenance: 0,
    fault: 0,
    completedMaintenance: 0,
    inProgressMaintenance: 0,
    pendingMaintenance: 0,
    completedRepair: 0,
    inProgressRepair: 0,
    pendingRepair: 0,
    totalMaintenanceCost: 0,
    totalRepairCost: 0,
  });
  
  const [equipmentData, setEquipmentData] = useState<EquipmentLedger[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>([]);
  const [repairData, setRepairData] = useState<RepairRecord[]>([]);
  const [monthlyData, setMonthlyData] = useState<Record<string, { planned: number; fault: number }>>({});
  const [locationData, setLocationData] = useState<Record<string, { total: number; running: number; fault: number }>>({});

  const refreshData = () => {
    const newStats = dataStore.getStats();
    setStats(newStats);
    setEquipmentData(dataStore.getEquipmentData());
    setMaintenanceData(dataStore.getMaintenanceData());
    setRepairData(dataStore.getRepairData());
    setMonthlyData(dataStore.getMonthlyMaintenanceData());
    setLocationData(dataStore.getStatusByLocation());
  };

  useEffect(() => {
    refreshData();
    
    const unsubscribe = dataStore.subscribe(() => {
      refreshData();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let equipmentChart: echarts.ECharts | null = null;
    
    const initChart = () => {
      if (equipmentChartRef.current && equipmentData.length > 0) {
        try {
          equipmentChart = echarts.init(equipmentChartRef.current);
          equipmentChart.setOption({
            title: {
              text: '设备状态分布图',
              left: 'center',
              textStyle: {
                fontSize: 14,
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top: 'center',
              data: ['运行中', '待机', '维护中', '故障'],
              itemWidth: 14,
              itemHeight: 14,
              textStyle: {
                fontSize: 13,
              },
            },
            grid: {
              top: 30,
              left: 120,
              bottom: 30,
            },
            series: [
              {
                name: '设备状态',
                type: 'pie',
                radius: '55%',
                center: ['58%', '50%'],
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                data: [
                  { value: stats.running, name: '运行中' },
                  { value: stats.standby, name: '待机' },
                  { value: stats.maintenance, name: '维护中' },
                  { value: stats.fault, name: '故障' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
                itemStyle: {
                  borderRadius: 4,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
              },
            ],
          });

          const handleResize = () => equipmentChart?.resize();
          window.addEventListener('resize', handleResize);
          
          return () => {
            if (equipmentChart) {
              equipmentChart.dispose();
              window.removeEventListener('resize', handleResize);
            }
          };
        } catch (error) {
          console.error('Error rendering equipment chart:', error);
        }
      }
      return () => {};
    };
    
    const timer = setTimeout(initChart, 100);
    
    return () => {
      clearTimeout(timer);
      if (equipmentChart) {
        equipmentChart.dispose();
      }
    };
  }, [stats, equipmentData]);

  useEffect(() => {
    let maintenanceChart: echarts.ECharts | null = null;
    
    const initChart = () => {
      if (maintenanceChartRef.current) {
        try {
          maintenanceChart = echarts.init(maintenanceChartRef.current);
          
          const months = Object.keys(monthlyData).sort();
          const plannedData = months.map(m => monthlyData[m]?.planned || 0);
          const faultData = months.map(m => monthlyData[m]?.fault || 0);
          const monthLabels = months.map(m => m.substring(5) + '月');
          
          maintenanceChart.setOption({
            backgroundColor: 'transparent',
            title: {
              text: '维修工单趋势图',
              left: 'center',
              textStyle: {
                fontSize: 16,
                color: '#000000',
                fontWeight: 600,
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
              },
              backgroundColor: 'rgba(20, 24, 36, 0.95)',
              borderColor: 'rgba(0, 212, 255, 0.3)',
              textStyle: {
                color: '#e6e8ed',
              },
            },
            legend: {
              data: ['计划维修', '故障维修'],
              bottom: 0,
              textStyle: {
                color: '#000000',
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '15%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: monthLabels.length > 0 ? monthLabels : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              axisLine: {
                lineStyle: {
                  color: '#000000',
                },
              },
              axisLabel: {
                color: '#000000',
              },
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#000000',
                },
              },
              axisLabel: {
                color: '#000000',
              },
              splitLine: {
                lineStyle: {
                  color: '#cccccc',
                },
              },
            },
            series: [
              {
                name: '计划维修',
                type: 'line',
                smooth: true,
                data: plannedData.length > 0 ? plannedData : [12, 15, 18, 16, 20, 22, 19, 24, 21, 17, 23, 25],
                itemStyle: {
                  color: '#00d4ff',
                },
                lineStyle: {
                  color: '#00d4ff',
                  width: 3,
                },
                areaStyle: {
                  color: 'rgba(0, 212, 255, 0.2)',
                },
              },
              {
                name: '故障维修',
                type: 'line',
                smooth: true,
                data: faultData.length > 0 ? faultData : [5, 8, 6, 10, 7, 9, 11, 8, 6, 9, 7, 10],
                itemStyle: {
                  color: '#ff6b6b',
                },
                lineStyle: {
                  color: '#ff6b6b',
                  width: 3,
                },
                areaStyle: {
                  color: 'rgba(255, 107, 107, 0.2)',
                },
              },
            ],
          });

          const handleResize = () => maintenanceChart?.resize();
          window.addEventListener('resize', handleResize);
        } catch (error) {
          console.error('Error rendering maintenance chart:', error);
        }
      }
    };
    
    const timer = setTimeout(initChart, 100);
    
    return () => {
      clearTimeout(timer);
      if (maintenanceChart) {
        maintenanceChart.dispose();
      }
    };
  }, [monthlyData]);

  useEffect(() => {
    let costChart: echarts.ECharts | null = null;
    
    const initChart = () => {
      if (costChartRef.current) {
        try {
          costChart = echarts.init(costChartRef.current);
          
          costChart.setOption({
            title: {
              text: '维修费用统计',
              left: 'center',
              textStyle: {
                fontSize: 14,
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: ['保养费用', '维修费用'],
            },
            yAxis: {
              type: 'value',
              name: '金额(元)',
            },
            series: [
              {
                name: '费用',
                type: 'bar',
                data: [
                  {
                    value: stats.totalMaintenanceCost,
                    itemStyle: { color: '#1890ff' },
                  },
                  {
                    value: stats.totalRepairCost,
                    itemStyle: { color: '#ff4d4f' },
                  },
                ],
                barWidth: '40%',
                label: {
                  show: true,
                  position: 'top',
                  formatter: '¥{c}',
                },
              },
            ],
          });

          const handleResize = () => costChart?.resize();
          window.addEventListener('resize', handleResize);
        } catch (error) {
          console.error('Error rendering cost chart:', error);
        }
      }
    };
    
    const timer = setTimeout(initChart, 100);
    
    return () => {
      clearTimeout(timer);
      if (costChart) {
        costChart.dispose();
      }
    };
  }, [stats]);

  useEffect(() => {
    let locationChart: echarts.ECharts | null = null;
    
    const initChart = () => {
      if (locationChartRef.current && Object.keys(locationData).length > 0) {
        try {
          locationChart = echarts.init(locationChartRef.current);
          
          const locations = Object.keys(locationData);
          const runningData = locations.map(l => locationData[l].running);
          const faultData = locations.map(l => locationData[l].fault);
          
          locationChart.setOption({
            title: {
              text: '各车间设备状态',
              left: 'center',
              textStyle: {
                fontSize: 14,
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            legend: {
              data: ['运行中', '故障'],
              bottom: 0,
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '15%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: locations,
              axisLabel: {
                rotate: 30,
              },
            },
            yAxis: {
              type: 'value',
              name: '数量',
            },
            series: [
              {
                name: '运行中',
                type: 'bar',
                data: runningData,
                itemStyle: { color: '#52c41a' },
              },
              {
                name: '故障',
                type: 'bar',
                data: faultData,
                itemStyle: { color: '#ff4d4f' },
              },
            ],
          });

          const handleResize = () => locationChart?.resize();
          window.addEventListener('resize', handleResize);
        } catch (error) {
          console.error('Error rendering location chart:', error);
        }
      }
    };
    
    const timer = setTimeout(initChart, 100);
    
    return () => {
      clearTimeout(timer);
      if (locationChart) {
        locationChart.dispose();
      }
    };
  }, [locationData]);

  const exportToExcel = async (dataType: 'equipment' | 'maintenance' | 'repair' | 'all') => {
    const XLSX = await getExcelUtils();
    let wb = XLSX.utils.book_new();
    
    if (dataType === 'equipment' || dataType === 'all') {
      const equipmentExportData = equipmentData.map(item => ({
        '设备编码': item.equipmentNumber,
        '设备名称': item.equipmentName,
        '品牌': item.brand,
        '生产厂家': item.manufacturerFactory,
        '供应商': item.supplier,
        '生产日期': item.productionDate,
        '规格型号': item.modelSpecifications,
        '使用年限': item.serverLife,
        '折旧方式': item.depreciationMethod,
        '位置': item.equipmentLocal,
        '状态': item.status,
        '部门': item.department,
        '负责人': item.responsiblePerson,
      }));
      const ws = XLSX.utils.json_to_sheet(equipmentExportData);
      XLSX.utils.book_append_sheet(wb, ws, '设备台账');
    }
    
    if (dataType === 'maintenance' || dataType === 'all') {
      const maintenanceExportData = maintenanceData.map(item => ({
        '计划ID': item.planId,
        '设备名称': item.equipmentName,
        '保养类型': item.maintenanceType,
        '保养时间': item.maintenanceTime,
        '保养内容': item.maintenanceContent,
        '维护人员': item.maintainer,
        '状态': item.status,
        '费用': item.cost,
        '备注': item.remark,
      }));
      const ws = XLSX.utils.json_to_sheet(maintenanceExportData);
      XLSX.utils.book_append_sheet(wb, ws, '保养记录');
    }
    
    if (dataType === 'repair' || dataType === 'all') {
      const repairExportData = repairData.map(item => ({
        '工单ID': item.workOrderId,
        '设备名称': item.equipmentName,
        '故障现象': item.faultPhenomenon,
        '报修时间': item.reportTime,
        '响应时间(小时)': item.responseTime,
        '维修时长(小时)': item.repairTime,
        '维修措施': item.repairMeasures,
        '维修费用': item.repairCost,
        '维修人员': item.repairPerson,
        '状态': item.status,
      }));
      const ws = XLSX.utils.json_to_sheet(repairExportData);
      XLSX.utils.book_append_sheet(wb, ws, '维修记录');
    }
    
    const fileName = dataType === 'all' ? '工业管理系统数据报表.xlsx' : 
                     dataType === 'equipment' ? '设备台账.xlsx' :
                     dataType === 'maintenance' ? '保养记录.xlsx' : '维修记录.xlsx';
    
    XLSX.writeFile(wb, fileName);
    message.success(`${fileName} 导出成功`);
  };

  const exportStatsToExcel = async () => {
    const statsData = [
      { '指标': '设备总数', '数值': stats.total, '单位': '台' },
      { '指标': '运行中设备', '数值': stats.running, '单位': '台' },
      { '指标': '待机设备', '数值': stats.standby, '单位': '台' },
      { '指标': '维护中设备', '数值': stats.maintenance, '单位': '台' },
      { '指标': '故障设备', '数值': stats.fault, '单位': '台' },
      { '指标': '已完成保养', '数值': stats.completedMaintenance, '单位': '条' },
      { '指标': '进行中保养', '数值': stats.inProgressMaintenance, '单位': '条' },
      { '指标': '待处理保养', '数值': stats.pendingMaintenance, '单位': '条' },
      { '指标': '已完成维修', '数值': stats.completedRepair, '单位': '条' },
      { '指标': '进行中维修', '数值': stats.inProgressRepair, '单位': '条' },
      { '指标': '待处理维修', '数值': stats.pendingRepair, '单位': '条' },
      { '指标': '保养总费用', '数值': stats.totalMaintenanceCost, '单位': '元' },
      { '指标': '维修总费用', '数值': stats.totalRepairCost, '单位': '元' },
    ];
    
    await exportMultiSheetExcel({
      sheets: [{ data: statsData, sheetName: '统计数据' }],
      filename: '统计数据报表.xlsx',
    });
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string }> = {
      '运行中': { color: 'green' },
      '待机': { color: 'blue' },
      '维护中': { color: 'orange' },
      '故障': { color: 'red' },
      '已完成': { color: 'green' },
      '进行中': { color: 'blue' },
      '待处理': { color: 'orange' },
    };
    return <Tag color={statusMap[status]?.color || 'default'}>{status}</Tag>;
  };

  return (
    <div className="dashboard-container">
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refreshData}>刷新数据</Button>
        </Space>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={exportStatsToExcel}>导出统计报表</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportToExcel('all')}>导出全部数据</Button>
        </Space>
      </Space>

      <InsightAiPanel module="equipment" />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="设备总数"
              value={stats.total}
              precision={0}
              valueStyle={{ background: 'linear-gradient(90deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              prefix={<ToolOutlined />}
              suffix={<Text style={{ color: '#9aa4b2' }}>台</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="运行中设备"
              value={stats.running}
              precision={0}
              valueStyle={{ background: 'linear-gradient(90deg, #00ff88, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              prefix={<CheckCircleOutlined />}
              suffix={<Text style={{ color: '#9aa4b2' }}>台</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="待维护设备"
              value={stats.maintenance}
              precision={0}
              valueStyle={{ background: 'linear-gradient(90deg, #ffc54d, #ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              prefix={<ClockCircleOutlined />}
              suffix={<Text style={{ color: '#9aa4b2' }}>台</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="故障设备"
              value={stats.fault}
              precision={0}
              valueStyle={{ background: 'linear-gradient(90deg, #ff6b6b, #ff4d4f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              prefix={<AlertOutlined />}
              suffix={<Text style={{ color: '#9aa4b2' }}>台</Text>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="保养总费用"
              value={stats.totalMaintenanceCost}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="维修总费用"
              value={stats.totalRepairCost}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="待处理保养"
              value={stats.pendingMaintenance}
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="待处理维修"
              value={stats.pendingRepair}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="设备状态分布图" className="card" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportToExcel('equipment')}>导出</Button>}>
            <div ref={equipmentChartRef} style={{ width: '100%', height: 300 }}></div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="维修工单趋势图" className="card" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportToExcel('repair')}>导出</Button>}>
            <div ref={maintenanceChartRef} style={{ width: '100%', height: 300 }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="维修费用统计" className="card">
            <div ref={costChartRef} style={{ width: '100%', height: 300 }}></div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="各车间设备状态" className="card">
            <div ref={locationChartRef} style={{ width: '100%', height: 300 }}></div>
          </Card>
        </Col>
      </Row>

      <Card title="设备状态列表" className="card" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportToExcel('equipment')}>导出Excel</Button>}>
        <Table
          dataSource={equipmentData.slice(0, 10)}
          columns={[
            {
              title: '设备编码',
              dataIndex: 'equipmentNumber',
              key: 'equipmentNumber',
              width: 120,
            },
            {
              title: '设备名称',
              dataIndex: 'equipmentName',
              key: 'equipmentName',
              width: 150,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: getStatusTag,
            },
            {
              title: '位置',
              dataIndex: 'equipmentLocal',
              key: 'equipmentLocal',
              width: 120,
            },
            {
              title: '部门',
              dataIndex: 'department',
              key: 'department',
              width: 120,
            },
            {
              title: '负责人',
              dataIndex: 'responsiblePerson',
              key: 'responsiblePerson',
              width: 100,
            },
          ]}
          scroll={{ x: 'max-content', y: 300 }}
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};

export default ReportsAnalysis;
