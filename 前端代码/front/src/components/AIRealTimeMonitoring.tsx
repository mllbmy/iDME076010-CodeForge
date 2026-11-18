import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Card, Row, Col, Statistic, Progress, Tag, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, App } from 'antd';
import { AlertOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, SettingOutlined, DeleteOutlined, EditOutlined, RobotOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import echarts from '@/utils/echarts';
import { dataStore } from '../store/dataStore';
import { useAiStore } from '@/store/useAiStore';
import { EquipmentMonitoringData, AlertRule, AlertRecord, TrendData } from '../store/types';

interface MonitoringStats {
  total: number;
  running: number;
  warning: number;
  alert: number;
  avgHealth: number;
}

const { Option } = Select;

const AIRealTimeMonitoring: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('monitoring');
  const [equipmentData, setEquipmentData] = useState<EquipmentMonitoringData[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alertRecords, setAlertRecords] = useState<AlertRecord[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [stats, setStats] = useState<MonitoringStats>({ total: 0, running: 0, warning: 0, alert: 0, avgHealth: 0 });
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isRuleListOpen, setIsRuleListOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const { message } = App.useApp();
  const [ruleSearchText, setRuleSearchText] = useState('');
  const { aiStatus, equipmentResult, codeResult, routeResult, bomResult } = useAiStore();

  const filteredRules = useMemo(() => {
    if (!ruleSearchText) return alertRules;
    return alertRules.filter(rule => 
      rule.name.toLowerCase().includes(ruleSearchText.toLowerCase()) ||
      rule.equipmentName.toLowerCase().includes(ruleSearchText.toLowerCase()) ||
      rule.equipmentId.toLowerCase().includes(ruleSearchText.toLowerCase())
    );
  }, [alertRules, ruleSearchText]);

  useEffect(() => {
    // 初始化AI监控数据
    dataStore.initializeAIMonitoringData();
    
    // 订阅数据变化
    const unsubscribe = dataStore.subscribe(() => {
      updateData();
    });
    
    updateData();
    
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 渲染趋势图表
    if (activeTabKey === 'trend' && trendData.length > 0) {
      setTimeout(() => {
        renderTrendCharts();
      }, 100);
    }
  }, [activeTabKey, trendData]);

  const updateData = () => {
    setEquipmentData(dataStore.getEquipmentMonitoringData());
    setAlertRules(dataStore.getAlertRules());
    setAlertRecords(dataStore.getAlertRecords());
    setTrendData(dataStore.getTrendData());
    setStats(dataStore.getAIMonitoringStats());
  };

  const renderTrendCharts = () => {
    try {
      // 为每台设备渲染趋势图表
      equipmentData.forEach(equipment => {
        const tempElement = document.getElementById(`tempChart-${equipment.equipmentId}`);
        const vibrationElement = document.getElementById(`vibrationChart-${equipment.equipmentId}`);
        const loadElement = document.getElementById(`loadChart-${equipment.equipmentId}`);
        
        if (!tempElement || !vibrationElement || !loadElement) {
          console.warn(`Chart elements not found for equipment ${equipment.equipmentId}`);
          return;
        }

        // 温度趋势图
        const tempChart = echarts.init(tempElement);
        tempChart.setOption({
          title: {
            text: '温度趋势',
            textStyle: {
              fontSize: 14,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: trendData.map(item => item.time),
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: trendData.map(item => item.temperature.toFixed(1)),
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(255, 107, 107, 0.3)'
                  }, {
                    offset: 1, color: 'rgba(255, 107, 107, 0.1)'
                  }],
                },
              },
              lineStyle: {
                color: '#ff6b6b',
              },
            },
          ],
        });

        // 振动趋势图
        const vibrationChart = echarts.init(vibrationElement);
        vibrationChart.setOption({
          title: {
            text: '振动趋势',
            textStyle: {
              fontSize: 14,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: trendData.map(item => item.time),
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: trendData.map(item => item.vibration.toFixed(1)),
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(86, 182, 194, 0.3)'
                  }, {
                    offset: 1, color: 'rgba(86, 182, 194, 0.1)'
                  }],
                },
              },
              lineStyle: {
                color: '#56b6c2',
              },
            },
          ],
        });

        // 负载趋势图
        const loadChart = echarts.init(loadElement);
        loadChart.setOption({
          title: {
            text: '负载趋势',
            textStyle: {
              fontSize: 14,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: trendData.map(item => item.time),
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: trendData.map(item => item.load.toFixed(1)),
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(255, 184, 0, 0.3)'
                  }, {
                    offset: 1, color: 'rgba(255, 184, 0, 0.1)'
                  }],
                },
              },
              lineStyle: {
                color: '#ffb800',
              },
            },
          ],
        });

        // 响应式调整
        const handleResize = () => {
          tempChart.resize();
          vibrationChart.resize();
          loadChart.resize();
        };
        window.addEventListener('resize', handleResize);
        
        // 清理函数
        return () => {
          window.removeEventListener('resize', handleResize);
          tempChart.dispose();
          vibrationChart.dispose();
          loadChart.dispose();
        };
      });
    } catch (error) {
      console.error('Error rendering charts:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '运行中':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case '离线':
        return <CloseCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };



  const getAlertLevelTag = (level?: string) => {
    switch (level) {
      case 'warning':
        return <Tag color="orange">预警</Tag>;
      case 'alert':
        return <Tag color="red">报警</Tag>;
      default:
        return null;
    }
  };

  const handleRuleModalOpen = (rule?: AlertRule) => {
    if (rule) {
      setEditingRule(rule);
    } else {
      setEditingRule(null);
    }
    setIsRuleModalOpen(true);
  };

  useEffect(() => {
    if (isRuleModalOpen) {
      if (editingRule) {
        form.setFieldsValue({
          ...editingRule,
          enabled: editingRule.enabled !== undefined ? editingRule.enabled : true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ enabled: true });
      }
    }
  }, [isRuleModalOpen, editingRule, form]);

  const handleRuleListOpen = () => {
    setIsRuleListOpen(true);
  };

  const handleRuleModalClose = () => {
    setIsRuleModalOpen(false);
    setEditingRule(null);
    form.resetFields();
  };

  const handleRuleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRule) {
        dataStore.updateAlertRule(editingRule.id, values);
        message.success('规则更新成功');
      } else {
        dataStore.addAlertRule(values);
        message.success('规则添加成功');
      }
      handleRuleModalClose();
    });
  };

  const handleRuleDelete = (id: string) => {
    dataStore.deleteAlertRule(id);
    message.success('规则删除成功');
  };

  const handleRuleToggle = (id: string, enabled: boolean) => {
    dataStore.updateAlertRule(id, { enabled });
  };

  const tabsItems: TabsProps['items'] = [
    {
      key: 'monitoring',
      label: '监控面板',
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={4}>
              <Card className="stat-card">
                <Statistic 
                  title="设备总数" 
                  value={stats.total} 
                  prefix={<AlertOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="stat-card">
                <Statistic 
                  title="运行中" 
                  value={stats.running} 
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="stat-card">
                <Statistic 
                  title="预警" 
                  value={stats.warning} 
                  prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="stat-card">
                <Statistic 
                  title="报警" 
                  value={stats.alert} 
                  prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="stat-card">
                <Statistic 
                  title="平均健康度" 
                  value={stats.avgHealth} 
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress 
                  percent={stats.avgHealth} 
                  strokeColor={{ from: '#52c41a', to: '#1890ff' }} 
                  style={{ marginTop: 8 }}
                  status={stats.avgHealth < 60 ? 'exception' : stats.avgHealth < 80 ? 'active' : 'normal'}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16}>
            {equipmentData.map((equipment) => (
              <Col span={8} key={equipment.equipmentId}>
                <Card 
                  className="equipment-card"
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 'bold' }}>{equipment.equipmentName}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#666', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: 12 }}>{equipment.equipmentId}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: equipment.status === '运行中' ? '#52c41a' : '#d9d9d9' }}>
                          {getStatusIcon(equipment.status)}
                          {equipment.status}
                        </span>
                        {getAlertLevelTag(equipment.alertLevel)}
                      </div>
                    </div>
                  }
                >
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#666' }}>温度</span>
                      <span style={{ fontSize: 14, fontWeight: 'bold', color: equipment.temperature > 75 ? '#f5222d' : equipment.temperature > 60 ? '#faad14' : '#52c41a' }}>{equipment.temperature}℃</span>
                    </div>
                    <Progress 
                      percent={(equipment.temperature / 100) * 100} 
                      strokeColor={equipment.temperature > 75 ? '#f5222d' : equipment.temperature > 60 ? '#faad14' : '#ff6b6b'} 
                      status={equipment.temperature > 75 ? 'exception' : equipment.temperature > 60 ? 'active' : 'normal'}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#666' }}>振动</span>
                      <span style={{ fontSize: 14, fontWeight: 'bold', color: equipment.vibration > 7 ? '#f5222d' : equipment.vibration > 5 ? '#faad14' : '#52c41a' }}>{equipment.vibration}mm/s</span>
                    </div>
                    <Progress 
                      percent={(equipment.vibration / 10) * 100} 
                      strokeColor={equipment.vibration > 7 ? '#f5222d' : equipment.vibration > 5 ? '#faad14' : '#56b6c2'} 
                      status={equipment.vibration > 7 ? 'exception' : equipment.vibration > 5 ? 'active' : 'normal'}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#666' }}>负载</span>
                      <span style={{ fontSize: 14, fontWeight: 'bold', color: equipment.load > 80 ? '#f5222d' : equipment.load > 60 ? '#faad14' : '#52c41a' }}>{equipment.load}%</span>
                    </div>
                    <Progress 
                      percent={equipment.load} 
                      strokeColor={equipment.load > 80 ? '#f5222d' : equipment.load > 60 ? '#faad14' : '#ffb800'} 
                      status={equipment.load > 80 ? 'exception' : equipment.load > 60 ? 'active' : 'normal'}
                    />
                  </div>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>健康度</div>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: equipment.health < 60 ? '#f5222d' : equipment.health < 80 ? '#faad14' : '#52c41a' }}>{equipment.health}%</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>累计运行</div>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>{equipment.runtime}h</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'alerts',
      label: '预警记录',
      children: (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>实时预警列表</h3>
            <span style={{ fontSize: 14, color: '#666' }}>{alertRecords.length} 条预警</span>
          </div>
          
          {alertRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>当前无预警，设备运行正常</p>
            </div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {alertRecords.map((record) => (
                <Card key={record.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>{record.equipmentName} ({record.equipmentId})</h4>
                      <p style={{ color: '#666', fontSize: 12 }}>
                        {record.metric === 'temperature' ? '温度' : 
                         record.metric === 'vibration' ? '振动' : 
                         record.metric === 'load' ? '负载' : '健康度'}
                        {record.value} {record.metric === 'temperature' ? '℃' : 
                         record.metric === 'vibration' ? 'mm/s' : '%'}
                        (阈值: {record.threshold})
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {record.level === 'warning' ? 
                        <Tag color="orange">预警</Tag> : 
                        <Tag color="red">报警</Tag>
                      }
                      <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{record.timestamp}</p>
                      <Tag color={record.status === 'active' ? 'blue' : 'green'} style={{ marginTop: 4 }}>
                        {record.status === 'active' ? '活跃' : '已解决'}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'trend',
      label: '趋势分析',
      children: (
        <div>
          {equipmentData.map((equipment) => (
            <Card key={equipment.equipmentId} title={equipment.equipmentName} style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="温度趋势" size="small">
                    <div id={`tempChart-${equipment.equipmentId}`} style={{ width: '100%', height: 250 }}></div>
                    <div style={{ marginTop: 8, textAlign: 'right', fontSize: 12, color: '#666' }}>
                      均值: {trendData.reduce((sum, item) => sum + item.temperature, 0) / trendData.length || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="振动趋势" size="small">
                    <div id={`vibrationChart-${equipment.equipmentId}`} style={{ width: '100%', height: 250 }}></div>
                    <div style={{ marginTop: 8, textAlign: 'right', fontSize: 12, color: '#666' }}>
                      均值: {trendData.reduce((sum, item) => sum + item.vibration, 0) / trendData.length || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="负载趋势" size="small">
                    <div id={`loadChart-${equipment.equipmentId}`} style={{ width: '100%', height: 250 }}></div>
                    <div style={{ marginTop: 8, textAlign: 'right', fontSize: 12, color: '#666' }}>
                      均值: {trendData.reduce((sum, item) => sum + item.load, 0) / trendData.length || 0}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2><RobotOutlined style={{ marginRight: 8 }} />AI智能中心</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#52c41a' }}>
            <CheckCircleOutlined />
            实时监控中
          </span>
          <Button 
            type="primary" 
            icon={<SettingOutlined />} 
            onClick={handleRuleListOpen}
          >
            预警规则
          </Button>
        </div>
      </div>
      
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="设备AI分析"
              value={aiStatus.equipment.available ? '在线' : '离线'}
              valueStyle={{ color: aiStatus.equipment.available ? '#52c41a' : '#ff4d4f', fontSize: 16 }}
              prefix={<AlertOutlined />}
            />
            {equipmentResult && <span style={{ fontSize: 12, color: '#999' }}>健康度: {equipmentResult.healthScore}</span>}
          </Col>
          <Col span={6}>
            <Statistic
              title="编码AI生成"
              value={aiStatus.code.available ? '在线' : '离线'}
              valueStyle={{ color: aiStatus.code.available ? '#52c41a' : '#ff4d4f', fontSize: 16 }}
              prefix={<RobotOutlined />}
            />
            {codeResult && <span style={{ fontSize: 12, color: '#999' }}>最新: {codeResult.primaryCode.code}</span>}
          </Col>
          <Col span={6}>
            <Statistic
              title="路线AI推荐"
              value={aiStatus.route.available ? '在线' : '离线'}
              valueStyle={{ color: aiStatus.route.available ? '#52c41a' : '#ff4d4f', fontSize: 16 }}
              prefix={<SettingOutlined />}
            />
            {routeResult && <span style={{ fontSize: 12, color: '#999' }}>置信度: {Math.round(routeResult.confidence * 100)}%</span>}
          </Col>
          <Col span={6}>
            <Statistic
              title="BOM AI校验"
              value={aiStatus.bom.available ? '在线' : '离线'}
              valueStyle={{ color: aiStatus.bom.available ? '#52c41a' : '#ff4d4f', fontSize: 16 }}
              prefix={<CheckCircleOutlined />}
            />
            {bomResult && <span style={{ fontSize: 12, color: '#999' }}>{bomResult.valid ? '校验通过' : `发现${bomResult.summary.errorCount}个错误`}</span>}
          </Col>
        </Row>
      </Card>
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={tabsItems} />
      
      {/* 预警规则管理模态框 */}
      <Modal
        title={editingRule ? '编辑预警规则' : '添加预警规则'}
        open={isRuleModalOpen}
        onCancel={handleRuleModalClose}
        onOk={handleRuleSubmit}
        width={700}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
                <Input placeholder="如：CNC加工中心温度过高预警" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enabled" label="启用状态" valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="停用" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="equipmentId" 
            label="选择设备" 
            rules={[{ required: true, message: '请选择设备' }]}
          >
            <Select 
              placeholder="请选择要监控的设备" 
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                const equipment = equipmentData.find(e => e.equipmentId === value);
                if (equipment) {
                  form.setFieldsValue({ equipmentName: equipment.equipmentName });
                }
              }}
            >
              {equipmentData.map((equipment) => (
                <Option key={equipment.equipmentId} value={equipment.equipmentId}>
                  {equipment.equipmentName} ({equipment.equipmentId})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="equipmentName" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="metric" 
                label="监控指标" 
                rules={[{ required: true, message: '请选择监控指标' }]}
              >
                <Select placeholder="请选择监控指标">
                  <Option value="temperature">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#ff6b6b' }}>●</span>
                      温度 (℃)
                    </div>
                  </Option>
                  <Option value="vibration">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#56b6c2' }}>●</span>
                      振动 (mm/s)
                    </div>
                  </Option>
                  <Option value="load">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#ffb800' }}>●</span>
                      负载 (%)
                    </div>
                  </Option>
                  <Option value="health">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#52c41a' }}>●</span>
                      健康度 (%)
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="operator" 
                label="判断条件" 
                rules={[{ required: true, message: '请选择判断条件' }]}
              >
                <Select placeholder="请选择判断条件">
                  <Option value=">">大于 (&gt;)</Option>
                  <Option value="<">小于 (&lt;)</Option>
                  <Option value=">=">大于等于 (≥)</Option>
                  <Option value="<=">小于等于 (≤)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="warningThreshold" 
                label="预警阈值" 
                rules={[{ required: true, message: '请输入预警阈值' }]}
                extra="达到此值触发预警（黄色）"
              >
                <Space.Compact>
                  <InputNumber style={{ width: 'calc(100% - 60px)' }} placeholder="如：75" />
                  <Input style={{ width: 60 }} readOnly value="阈值" />
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="alertThreshold" 
                label="报警阈值" 
                rules={[{ required: true, message: '请输入报警阈值' }]}
                extra="达到此值触发报警（红色）"
              >
                <Space.Compact>
                  <InputNumber style={{ width: 'calc(100% - 60px)' }} placeholder="如：90" />
                  <Input style={{ width: 60 }} readOnly value="阈值" />
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="description" label="规则描述">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入规则描述，如：监控CNC加工中心温度，防止过热损坏设备..." 
            />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 预警规则列表抽屉 */}
      <Modal
        title="预警规则管理"
        open={isRuleListOpen}
        onCancel={() => setIsRuleListOpen(false)}
        footer={[
          <Button key="add" type="primary" icon={<SettingOutlined />} onClick={() => handleRuleModalOpen()}>
            添加规则
          </Button>,
          <Button key="close" onClick={() => setIsRuleListOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Input.Search 
                placeholder="搜索规则名称或设备" 
                allowClear
                onSearch={setRuleSearchText}
                onChange={(e) => setRuleSearchText(e.target.value)}
              />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <span style={{ color: '#666' }}>
                共 {filteredRules.length} 条规则，
                <span style={{ color: '#52c41a' }}>{filteredRules.filter(r => r.enabled).length} 条启用</span>，
                <span style={{ color: '#999' }}>{filteredRules.filter(r => !r.enabled).length} 条停用</span>
              </span>
            </Col>
          </Row>
        </div>
        
        {filteredRules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            <SettingOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <p>暂无预警规则，请点击"添加规则"创建</p>
          </div>
        ) : (
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {filteredRules.map((rule) => (
              <Card 
                key={rule.id} 
                style={{ 
                  marginBottom: 12,
                  borderLeft: rule.enabled ? '4px solid #52c41a' : '4px solid #d9d9d9',
                }}
                size="small"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <Switch 
                        checked={rule.enabled} 
                        onChange={(checked) => handleRuleToggle(rule.id, checked)}
                        size="small"
                      />
                      <span style={{ fontWeight: 'bold', fontSize: 14 }}>{rule.name}</span>
                      <Tag color={rule.enabled ? 'green' : 'default'}>
                        {rule.enabled ? '已启用' : '已停用'}
                      </Tag>
                    </div>
                    
                    <Row style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      <Col span={12}>
                        <span>设备: <strong>{rule.equipmentName}</strong> ({rule.equipmentId})</span>
                      </Col>
                      <Col span={12}>
                        <span>指标: 
                          <span style={{ 
                            color: rule.metric === 'temperature' ? '#ff6b6b' : 
                                   rule.metric === 'vibration' ? '#56b6c2' : 
                                   rule.metric === 'load' ? '#ffb800' : '#52c41a',
                            marginLeft: 4,
                            fontWeight: 'bold'
                          }}>
                            {rule.metric === 'temperature' ? '温度' : 
                             rule.metric === 'vibration' ? '振动' : 
                             rule.metric === 'load' ? '负载' : '健康度'}
                          </span>
                        </span>
                      </Col>
                    </Row>
                    
                    <Row style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      <Col span={12}>
                        <span>条件: <strong>{rule.operator}</strong></span>
                      </Col>
                      <Col span={12}>
                        <span>
                          阈值: 
                          <Tag color="orange" style={{ marginLeft: 4 }}>预警 {rule.warningThreshold}</Tag>
                          <Tag color="red" style={{ marginLeft: 4 }}>报警 {rule.alertThreshold}</Tag>
                        </span>
                      </Col>
                    </Row>
                    
                    {rule.description && (
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        描述: {rule.description}
                      </div>
                    )}
                  </div>
                  
                  <Space direction="vertical" size="small" style={{ marginLeft: 16 }}>
                    <Button 
                      size="small" 
                      icon={<EditOutlined />}
                      onClick={() => handleRuleModalOpen(rule)}
                    >
                      编辑
                    </Button>
                    <Button 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleRuleDelete(rule.id)}
                    >
                      删除
                    </Button>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIRealTimeMonitoring;