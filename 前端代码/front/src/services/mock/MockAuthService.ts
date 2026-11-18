import type { IAuthService, LoginParams, RegisterParams, AuthResult, UserInfo } from '../interfaces';
import { sha256, generateToken } from '@/utils/crypto';
import { mockDelay } from './mockConfig';

const userDB = new Map<string, { passwordHash: string; user: UserInfo }>();
const tokenDB = new Map<string, string>();

export class MockAuthService implements IAuthService {
  async login(params: LoginParams): Promise<AuthResult> {
    await mockDelay();
    const entry = userDB.get(params.account);
    if (!entry) throw new Error('账号不存在，请先注册');

    const inputHash = await sha256(params.password);
    if (entry.passwordHash !== inputHash) throw new Error('账号或密码错误');

    const token = generateToken();
    tokenDB.set(token, params.account);

    return { token, user: entry.user };
  }

  async register(params: RegisterParams): Promise<void> {
    await mockDelay();
    if (userDB.has(params.account)) throw new Error('该账号已被注册');

    const passwordHash = await sha256(params.password);
    const user: UserInfo = {
      account: params.account,
      username: params.username,
      email: params.email,
      phone: params.phone,
      avatar: '',
    };
    userDB.set(params.account, { passwordHash, user });
  }

  async logout(): Promise<void> {
    await mockDelay();
    const token = localStorage.getItem('token');
    if (token) tokenDB.delete(token);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<UserInfo | null> {
    await mockDelay();
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  async validateToken(): Promise<boolean> {
    await mockDelay();
    const token = localStorage.getItem('token');
    return token ? tokenDB.has(token) : false;
  }
}
