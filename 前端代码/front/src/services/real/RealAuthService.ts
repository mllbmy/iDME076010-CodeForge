import type { IAuthService, LoginParams, RegisterParams, AuthResult, UserInfo } from '../interfaces';

const MOCK_TOKEN = 'mock-token-local-dev';
const MOCK_USER: UserInfo = {
  account: 'admin',
  username: '系统管理员',
  email: 'admin@example.com',
  phone: '13800000000',
};

export class RealAuthService implements IAuthService {
  async login(_params: LoginParams): Promise<AuthResult> {
    return { token: MOCK_TOKEN, user: MOCK_USER };
  }

  async register(_params: RegisterParams): Promise<void> {
    return;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<UserInfo | null> {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  async validateToken(): Promise<boolean> {
    return !!localStorage.getItem('token');
  }
}
