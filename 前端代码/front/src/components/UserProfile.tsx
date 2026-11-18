import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, App, Card, Descriptions } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';

interface UserData {
  account: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface UserProfileProps {
  visible: boolean;
  onClose: () => void;
  onAvatarChange?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onClose, onAvatarChange }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (visible) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setAvatarUrl(user.avatar || '');
        form.setFieldsValue(user);
      }
    }
  }, [visible, form]);

  const handleAvatarUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setAvatarUrl(url);
      message.success('头像已选择，点击保存按钮确认更改');
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async (values: Record<string, unknown>) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...values,
      avatar: avatarUrl,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const usersStr = localStorage.getItem('registeredUsers');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const userIndex = users.findIndex((u: UserData) => u.account === currentUser.account);
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
    }

    message.success('个人信息保存成功');
    setIsEditing(false);
    if (onAvatarChange) {
      onAvatarChange();
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      form.setFieldsValue(currentUser);
      setAvatarUrl(currentUser.avatar || '');
    }
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal
      title="个人信息"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      {currentUser && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            {isEditing ? (
              <Upload
                name="avatar"
                listType="picture-circle"
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
                accept="image/*"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 100, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #d9d9d9', borderRadius: '50%', cursor: 'pointer' }}>
                    <UserOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
                    <span style={{ fontSize: 12, color: '#999', marginTop: 4 }}>点击上传</span>
                  </div>
                )}
              </Upload>
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '2px solid #1890ff' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7ff' }}>
                    <UserOutlined style={{ fontSize: 50, color: '#1890ff' }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              <Form.Item
                name="account"
                label="账号"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input prefix={<IdcardOutlined />} disabled />
              </Form.Item>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsEditing(false)}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </div>
            </Form>
          ) : (
            <Card>
              <Descriptions column={1}>
                <Descriptions.Item label="账号">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IdcardOutlined />
                    <span>{currentUser.account}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="用户名">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined />
                    <span>{currentUser.username}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MailOutlined />
                    <span>{currentUser.email}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="手机号">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PhoneOutlined />
                    <span>{currentUser.phone}</span>
                  </div>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  编辑信息
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );
};

export default UserProfile;