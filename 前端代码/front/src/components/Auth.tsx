import React, { useState } from 'react';
import { Form, Input, Button, App, Tabs, ConfigProvider } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import './Auth.css';
import { sha256, generateToken } from '@/utils/crypto';
import { Logo } from '@/components/common';

interface AuthProps {
  onLogin: () => void;
}

interface UserData {
  account: string;
  username: string;
  passwordHash: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface LoginResult {
  token: string;
  user: Omit<UserData, 'passwordHash'>;
}

const mockUserDB = new Map<string, UserData>();
const mockTokenDB = new Map<string, string>();

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const { message } = App.useApp();

  const handleLogin = async (values: { account: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = mockUserDB.get(values.account);
      if (!user) {
        message.error('账号不存在，请先注册');
        return;
      }

      const inputHash = await sha256(values.password);
      if (user.passwordHash !== inputHash) {
        message.error('账号或密码错误');
        return;
      }

      const token = generateToken();
      mockTokenDB.set(token, user.account);

      const loginResult: LoginResult = {
        token,
        user: { account: user.account, username: user.username, email: user.email, phone: user.phone, avatar: user.avatar },
      };
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(loginResult.user));

      message.success('登录成功！');
      onLogin();
    } catch (error) {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 免登录直接进入（游客模式）：写入本地凭据后直接进入系统
  const handleDirectEnter = () => {
    const token = generateToken();
    const guestUser = {
      account: 'guest',
      username: '游客用户',
      email: '',
      phone: '',
      avatar: '',
    };
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    message.success('已进入游客模式');
    onLogin();
  };

  const handleRegister = async (values: {
    account: string;
    username: string;
    password: string;
    email: string;
    phone: string;
  }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (mockUserDB.has(values.account)) {
        message.error('该账号已被注册');
        return;
      }

      const passwordHash = await sha256(values.password);
      const newUser: UserData = {
        account: values.account,
        username: values.username,
        passwordHash,
        email: values.email,
        phone: values.phone,
        avatar: '',
      };

      mockUserDB.set(newUser.account, newUser);
      message.success('注册成功！请使用新账号登录');
      setActiveTab('login');
      registerForm.resetFields();
    } catch (error) {
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const numberValidator = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    if (!/^\d+$/.test(value)) return Promise.reject('只能输入数字');
    return Promise.resolve();
  };

  const accountValidator = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    if (!/^\d+$/.test(value)) return Promise.reject('只能输入数字');
    if (value.length !== 10) return Promise.reject('账号必须是10位数字');
    return Promise.resolve();
  };

  const passwordValidator = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!hasNumber || !hasLetter || !hasSymbol) return Promise.reject('密码必须包含数字、字母和符号');
    return Promise.resolve();
  };

  const usernameValidator = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    if (!/^[\u4e00-\u9fa5a-zA-Z]+$/.test(value)) return Promise.reject('只能输入中文和英文');
    return Promise.resolve();
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'login',
      label: '登录',
      children: (
        <div className="auth-form-wrapper">
          <Form form={form} name="login" onFinish={handleLogin} layout="vertical" className="auth-form">
            <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }, { validator: accountValidator }]}>
              <Input prefix={<IdcardOutlined />} placeholder="请输入账号" autoComplete="off" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }, { validator: passwordValidator }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" autoComplete="off" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth-btn" loading={loading}>
                登录
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="button"
                className="auth-btn auth-btn-ghost"
                onClick={handleDirectEnter}
                disabled={loading}
              >
                直接进入（游客模式）
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <div className="auth-form-wrapper auth-form-scroll">
          <Form form={registerForm} name="register" onFinish={handleRegister} layout="vertical" className="auth-form">
            <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }, { validator: accountValidator }]}>
              <Input prefix={<IdcardOutlined />} placeholder="请输入账号" autoComplete="off" />
            </Form.Item>
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }, { validator: usernameValidator }]}>
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" autoComplete="off" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}>
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" autoComplete="off" />
            </Form.Item>
            <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }, { validator: numberValidator }]}>
              <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" autoComplete="off" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码长度至少为6位' }, { validator: passwordValidator }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" autoComplete="off" />
            </Form.Item>
            <Form.Item name="confirmPassword" label="确认密码" dependencies={['password']} rules={[{ required: true, message: '请确认密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('两次输入的密码不一致')); } })]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" autoComplete="off" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth-btn" loading={loading}>
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1976d2',
          colorBorder: 'rgba(255, 255, 255, 0.15)',
          colorBgContainer: 'transparent',
          colorText: '#ffffff',
          colorTextDescription: 'rgba(255, 255, 255, 0.85)',
          colorBgElevated: 'rgba(0, 0, 0, 0.45)',
        },
      }}
    >
      <div className="auth-container">
        <div className="auth-bg"></div>
        <div className="auth-brand">
          <div className="auth-logo">
            <Logo size={120} />
          </div>
          <h1 className="auth-title">
            <span className="title-main">工业智造管理系统</span>
          </h1>
          <p className="auth-subtitle">Industrial Intelligent Manufacturing System</p>
        </div>
        <div className="auth-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered className="auth-tabs" items={tabItems} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Auth;
