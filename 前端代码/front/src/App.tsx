import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider, theme, App as AntApp } from 'antd';
import {
  AppstoreOutlined,
  ToolOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  AlertOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import AppRoutes, { menuRouteMap, routeMenuMap } from './router';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { dataStore } from './store/dataStore';
import { Logo, ErrorBoundary } from './components/common';
import { onUnauthorized } from '@/utils/authEvent';
import { AiAssistantFab } from '@/components/ai';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; avatar?: string } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { token: { colorBgContainer } } = theme.useToken();

  const currentMenu = routeMenuMap[location.pathname] || 'dashboard';

  const refreshCurrentUser = () => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCurrentUser();
      dataStore.initializeAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return onUnauthorized(() => {
      handleLogout();
      navigate('/dashboard');
    });
  }, [navigate]);

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '智能大屏' },
    { key: 'ai-monitoring', icon: <AlertOutlined />, label: 'AI智能中心' },
    { key: 'equipment', icon: <AppstoreOutlined />, label: '设备管理' },
    { key: 'material', icon: <ToolOutlined />, label: '物料管理' },
    { key: 'process', icon: <SettingOutlined />, label: '工序及工艺管理' },
    { key: 'reports', icon: <FileTextOutlined />, label: '报表分析' },
  ];

  const handleMenuClick = (key: string) => {
    const path = menuRouteMap[key];
    if (path) {
      navigate(path);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/dashboard');
  };

  if (!isAuthenticated) {
    return (
      <AntApp>
        <Auth onLogin={handleLogin} />
      </AntApp>
    );
  }

  const isDashboard = currentMenu === 'dashboard';

  return (
    <ErrorBoundary>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorBorder: '#e8e8e8',
          colorBgContainer: isDashboard ? 'transparent' : '#f0f2f5',
        },
      }}
    >
      <AntApp>
      {isDashboard ? (
        <div style={{ margin: 0, padding: 0 }}>
          <AppRoutes onEnterSystem={() => navigate('/ai-monitoring')} />
        </div>
      ) : (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          collapsedWidth={80}
          style={{
            overflow: 'hidden',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="logo" style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start', 
            gap: 12,
            padding: collapsed ? '0' : '0 16px',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ 
              width: collapsed ? 40 : 44, 
              height: collapsed ? 40 : 44, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Logo size={collapsed ? 40 : 44} />
            </div>
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="app-title-main">工业智造管理系统</span>
                <span className="app-title-sub">Industrial System</span>
              </div>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentMenu]}
            onClick={({ key }) => handleMenuClick(key)}
            style={{ 
              borderRight: 0,
              overflow: 'hidden',
              flex: 1
            }}
            items={menuItems}
          />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            style={{
              background: colorBgContainer,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              position: 'fixed',
              left: collapsed ? 80 : 200,
              right: 0,
              top: 0,
              zIndex: 100,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {menuItems.find((item) => item.key === currentMenu)?.label || ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{currentUser?.username || '用户'}</span>
                <div 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: '#1890ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#fff',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => setProfileVisible(true)}
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserOutlined />
                  )}
                </div>
                <button 
                  className="header-btn" 
                  title="退出登录" 
                  onClick={handleLogout}
                  style={{ marginLeft: 8 }}
                >
                  <LogoutOutlined />
                </button>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: '84px 24px 24px',
              padding: 24,
              background: colorBgContainer,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
              minHeight: 280,
              overflow: 'auto',
            }}
          >
            <AppRoutes onEnterSystem={() => navigate('/ai-monitoring')} />
          </Content>
        </Layout>
        <UserProfile 
          visible={profileVisible} 
          onClose={() => setProfileVisible(false)} 
          onAvatarChange={refreshCurrentUser}
        />
        <AiAssistantFab />
      </Layout>
      )}
      </AntApp>
    </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
