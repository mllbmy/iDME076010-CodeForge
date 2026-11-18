import React, { useEffect, useRef, useState } from 'react';
import echarts from '@/utils/echarts';
import {
  RiseOutlined,
  DashboardOutlined,
  SafetyCertificateOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import { dataStore } from '../store/dataStore';
import { useAiStore } from '@/store/useAiStore';

interface SciFiDashboardProps {
  onEnterSystem?: () => void;
}

interface TrendData {
  time: string;
  value: number;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning';
  time: string;
}

const SciFiDashboard: React.FC<SciFiDashboardProps> = ({ onEnterSystem }) => {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartInstance = useRef<echarts.ECharts | null>(null);
  const barChartInstance = useRef<echarts.ECharts | null>(null);
  const pieChartInstance = useRef<echarts.ECharts | null>(null);

  const getOrCreateChart = (dom: HTMLDivElement, instanceRef: React.MutableRefObject<echarts.ECharts | null>): echarts.ECharts => {
    if (instanceRef.current && !(instanceRef.current as any)._disposed) {
      return instanceRef.current;
    }
    const chart = echarts.init(dom);
    instanceRef.current = chart;
    return chart;
  };
  const [currentNotice, setCurrentNotice] = useState(0);
  const [stats, setStats] = useState(dataStore.getStats());
  const [aiStats, setAiStats] = useState(dataStore.getAIMonitoringStats());
  const [statusByLocation, setStatusByLocation] = useState(dataStore.getStatusByLocation());
  const { aiStatus, equipmentResult } = useAiStore();

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setStats(dataStore.getStats());
      setAiStats(dataStore.getAIMonitoringStats());
      setStatusByLocation(dataStore.getStatusByLocation());
    });
    
    setStats(dataStore.getStats());
    setAiStats(dataStore.getAIMonitoringStats());
    setStatusByLocation(dataStore.getStatusByLocation());
    
    return () => {
      unsubscribe();
    };
  }, []);

  const notices: Notice[] = [
    {
      id: 1,
      title: '系统升级公告',
      content: '工业智造管理系统v3.0版本正式发布，带来全新的AI智能分析功能',
      type: 'success',
      time: '2026-03-13'
    },
    {
      id: 2,
      title: '产能突破',
      content: '本月生产效率提升23%，创历史新高',
      type: 'success',
      time: '2026-03-12'
    },
    {
      id: 3,
      title: '设备维护提醒',
      content: '3号生产线设备预防性维护将于明日进行',
      type: 'warning',
      time: '2026-03-11'
    },
    {
      id: 4,
      title: '新功能上线',
      content: 'AI预警模块新增趋势分析功能，支持多维度数据对比',
      type: 'info',
      time: '2026-03-10'
    }
  ];

  const productionTrendData: TrendData[] = [
    { time: '00:00', value: 85 },
    { time: '04:00', value: 78 },
    { time: '08:00', value: 92 },
    { time: '12:00', value: 88 },
    { time: '16:00', value: 95 },
    { time: '20:00', value: 89 },
    { time: '24:00', value: 91 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [notices.length]);

  useEffect(() => {
    if (lineChartRef.current) {
      const chart = getOrCreateChart(lineChartRef.current, lineChartInstance);
      const option: echarts.EChartsCoreOption = {
        backgroundColor: 'transparent',
        grid: {
          top: 40,
          right: 20,
          bottom: 30,
          left: 50
        },
        xAxis: {
          type: 'category',
          data: productionTrendData.map(item => item.time),
          axisLine: { lineStyle: { color: '#0ff' } },
          axisLabel: { color: '#0ff', fontSize: 10 },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          min: 60,
          max: 100,
          axisLine: { show: false },
          axisLabel: { color: '#0ff', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(0, 255, 255, 0.1)' } }
        },
        series: [{
          data: productionTrendData.map(item => item.value),
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#00f260' },
              { offset: 1, color: '#0575e6' }
            ]),
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 242, 96, 0.3)' },
              { offset: 1, color: 'rgba(5, 117, 230, 0.05)' }
            ])
          },
          itemStyle: {
            color: '#0ff',
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      };
      chart.setOption(option);
    }
  }, []);

  useEffect(() => {
    if (barChartRef.current) {
      const chart = getOrCreateChart(barChartRef.current, barChartInstance);
      const locations = Object.keys(statusByLocation);
      const runningRates = locations.map(loc => {
        const data = statusByLocation[loc];
        return data.total > 0 ? Math.round((data.running / data.total) * 100) : 0;
      });
      const option: echarts.EChartsCoreOption = {
        backgroundColor: 'transparent',
        grid: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 50
        },
        xAxis: {
          type: 'category',
          data: locations.length > 0 ? locations : ['暂无车间数据'],
          axisLine: { lineStyle: { color: '#f0f' } },
          axisLabel: { color: '#f0f', fontSize: 10 },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLine: { show: false },
          axisLabel: { color: '#f0f', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(255, 0, 255, 0.1)' } }
        },
        series: [{
          data: runningRates.length > 0 ? runningRates.map(value => ({
            value,
            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#f0f' }, { offset: 1, color: '#7b4397' }]) }
          })) : [0],
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0]
          }
        }]
      };
      chart.setOption(option);
    }
  }, [statusByLocation]);

  useEffect(() => {
    if (pieChartRef.current) {
      const chart = getOrCreateChart(pieChartRef.current, pieChartInstance);
      const equipmentStatusData = [
        { name: '运行中', value: stats.running },
        { name: '待机', value: stats.standby },
        { name: '维护中', value: stats.maintenance },
        { name: '故障', value: stats.fault }
      ];
      const option: echarts.EChartsCoreOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#0ff',
          textStyle: { color: '#fff' }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: { color: '#0ff', fontSize: 11 },
          itemWidth: 12,
          itemHeight: 12
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          data: equipmentStatusData.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: ['#00f260', '#0575e6', '#f0f', '#ff6b6b'][index]
            }
          }))
        }]
      };
      chart.setOption(option);
    }
  }, [stats]);

  useEffect(() => {
    return () => {
      lineChartInstance.current?.dispose();
      lineChartInstance.current = null;
      barChartInstance.current?.dispose();
      barChartInstance.current = null;
      pieChartInstance.current?.dispose();
      pieChartInstance.current = null;
    };
  }, []);

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#00f260';
      case 'warning': return '#ffa502';
      case 'info': return '#0575e6';
      default: return '#0ff';
    }
  };

  return (
    <div className="scifi-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon">
            <defs>
              <linearGradient id="chrome1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5f5f5" />
                <stop offset="15%" stopColor="#c0c0c0" />
                <stop offset="30%" stopColor="#e8e8e8" />
                <stop offset="45%" stopColor="#a0a0a0" />
                <stop offset="60%" stopColor="#d5d5d5" />
                <stop offset="75%" stopColor="#909090" />
                <stop offset="90%" stopColor="#e0e0e0" />
                <stop offset="100%" stopColor="#b0b0b0" />
              </linearGradient>
              <linearGradient id="chrome2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#d0d0d0" />
                <stop offset="40%" stopColor="#f0f0f0" />
                <stop offset="60%" stopColor="#b8b8b8" />
                <stop offset="80%" stopColor="#e5e5e5" />
                <stop offset="100%" stopColor="#a8a8a8" />
              </linearGradient>
              <linearGradient id="innerRing" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#78909c" />
                <stop offset="25%" stopColor="#546e7a" />
                <stop offset="50%" stopColor="#607d8b" />
                <stop offset="75%" stopColor="#455a64" />
                <stop offset="100%" stopColor="#37474f" />
              </linearGradient>
              <radialGradient id="coreBlue" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4fc3f7" />
                <stop offset="30%" stopColor="#29b6f6" />
                <stop offset="60%" stopColor="#039be5" />
                <stop offset="85%" stopColor="#0277bd" />
                <stop offset="100%" stopColor="#01579b" />
              </radialGradient>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#81d4fa" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#4fc3f7" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#0288d1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#01579b" stopOpacity="0.3" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="60" r="58" fill="url(#chrome1)" stroke="#909090" strokeWidth="1" />
            <circle cx="60" cy="60" r="55" fill="none" stroke="url(#chrome2)" strokeWidth="2" />
            <circle cx="60" cy="60" r="50" fill="url(#innerRing)" stroke="#455a64" strokeWidth="1" />
            <g fill="#37474f">
              <circle cx="60" cy="14" r="5" />
              <circle cx="60" cy="106" r="5" />
              <circle cx="14" cy="60" r="5" />
              <circle cx="106" cy="60" r="5" />
            </g>
            <circle cx="60" cy="60" r="32" fill="url(#chrome1)" stroke="#78909c" strokeWidth="1" />
            <circle cx="60" cy="60" r="28" fill="url(#innerRing)" stroke="#455a64" strokeWidth="1" />
            <circle cx="60" cy="60" r="22" fill="url(#coreBlue)" />
            <circle cx="60" cy="60" r="18" fill="url(#coreGlow)" />
            <circle cx="60" cy="60" r="12" fill="#01579b" stroke="#0277bd" strokeWidth="1" />
            <circle cx="60" cy="60" r="6" fill="#0288d1" />
            <circle cx="60" cy="60" r="3" fill="#81d4fa" />
          </svg>
          <span>工业智造管理系统 · 智能大屏</span>
        </div>
        <div className="header-right">
          <div className="header-time">{new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
          <button className="header-enter-btn" onClick={onEnterSystem}>
            进入管理系统
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00f260, #0575e6)' }}>
            <DashboardOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-label">设备总数</div>
            <div className="stat-value">{stats.total} <span className="stat-unit">台</span></div>
          </div>
          <div className="stat-trend up">
            <ArrowUpOutlined /> 12%
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f0f, #7b4397)' }}>
            <SafetyCertificateOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-label">运行效率</div>
            <div className="stat-value">{stats.total > 0 ? ((stats.running / stats.total) * 100).toFixed(1) : 0} <span className="stat-unit">%</span></div>
          </div>
          <div className="stat-trend up">
            <ArrowUpOutlined /> 5.2%
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ffa502)' }}>
            <AlertOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-label">AI预警数</div>
            <div className="stat-value">{aiStats.warning + aiStats.alert} <span className="stat-unit">条</span></div>
          </div>
          <div className="stat-trend down">
            <ArrowDownOutlined /> 8%
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ff, #0099cc)' }}>
            <RiseOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-label">今日产量</div>
            <div className="stat-value">{(stats.running * 67).toLocaleString()} <span className="stat-unit">件</span></div>
          </div>
          <div className="stat-trend up">
            <ArrowUpOutlined /> 15%
          </div>
        </div>
      </div>

      <Row gutter={16} style={{ marginTop: 12 }}>
        <Col span={6}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 255, 0.1))',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            textAlign: 'center'
          }}>
            <RobotOutlined style={{ fontSize: 24, color: '#00ff88' }} />
            <div style={{ color: '#00ff88', fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>
              {equipmentResult ? equipmentResult.healthScore : '--'}
            </div>
            <div style={{ color: 'rgba(0, 255, 136, 0.7)', fontSize: 12 }}>AI健康评分</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.1), rgba(100, 100, 255, 0.1))',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            textAlign: 'center'
          }}>
            <DashboardOutlined style={{ fontSize: 24, color: '#00c8ff' }} />
            <div style={{ color: '#00c8ff', fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>
              {equipmentResult && equipmentResult.healthScore >= 80 ? '88%' : equipmentResult ? '82%' : '--'}
            </div>
            <div style={{ color: 'rgba(0, 200, 255, 0.7)', fontSize: 12 }}>AI效率预测</div>
          </div>
        </Col>
      </Row>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">
            <span className="title-line"></span>
            生产效率趋势
          </div>
          <div ref={lineChartRef} className="chart-container"></div>
        </div>
        <div className="chart-card">
          <div className="chart-title">
            <span className="title-line"></span>
            车间产能对比
          </div>
          <div ref={barChartRef} className="chart-container"></div>
        </div>
        <div className="chart-card">
          <div className="chart-title">
            <span className="title-line"></span>
            设备状态分布
          </div>
          <div ref={pieChartRef} className="chart-container"></div>
        </div>
      </div>

      <div className="carousel-section">
        <div className="carousel-header">
          <span className="carousel-icon">◈</span>
          重要公告
        </div>
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${currentNotice * 100}%)` }}>
            {notices.map((notice) => (
              <div key={notice.id} className="carousel-item">
                <div className="notice-card">
                  <div className="notice-header">
                    <span className="notice-type" style={{ color: getNoticeTypeColor(notice.type) }}>
                      {notice.type === 'success' && '✓ '}
                      {notice.type === 'warning' && '⚠ '}
                      {notice.type === 'info' && 'ℹ '}
                      {notice.title}
                    </span>
                    <span className="notice-time">{notice.time}</span>
                  </div>
                  <div className="notice-content">{notice.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {notices.map((_, index) => (
              <span 
                key={index} 
                className={`carousel-dot ${index === currentNotice ? 'active' : ''}`}
                onClick={() => setCurrentNotice(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'rgba(0, 255, 136, 0.05)', 
        border: '1px solid rgba(0, 255, 136, 0.2)', 
        borderRadius: 8, 
        padding: '12px 16px',
        marginTop: 12 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <RobotOutlined style={{ color: '#00ff88', fontSize: 16 }} />
          <span style={{ color: '#00ff88', fontSize: 14, fontWeight: 'bold' }}>AI洞察流</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(0, 255, 136, 0.8)', lineHeight: '1.8' }}>
          <div>🤖 {new Date().toLocaleTimeString()} 系统AI服务运行中，{Object.values(aiStatus as Record<string, { available: boolean }>).filter((s) => s.available).length}个AI模块在线</div>
          {equipmentResult && <div>🔧 设备健康度: {equipmentResult.healthScore}/100，{equipmentResult.faultPredictions.length > 0 ? `检测到${equipmentResult.faultPredictions.length}项故障风险` : '暂无故障风险'}</div>}
          <div>📊 数据洞察: 设备综合效率趋势上升，建议关注热处理车间设备状态</div>
        </div>
      </div>

      <div className="dashboard-footer">
        <div className="footer-item">
          <span className="footer-dot"></span>
          系统运行正常
        </div>
        <div className="footer-item">
          <span className="footer-dot warning"></span>
          {aiStats.warning + aiStats.alert}条待处理预警
        </div>
        <div className="footer-item">
          <span className="footer-dot success"></span>
          AI分析服务在线
        </div>
      </div>
    </div>
  );
};

export default SciFiDashboard;
