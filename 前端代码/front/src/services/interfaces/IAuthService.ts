export interface LoginParams {
  account: string;
  password: string;
}

export interface RegisterParams {
  account: string;
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface UserInfo {
  account: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface AuthResult {
  token: string;
  user: UserInfo;
}

export interface IAuthService {
  login(params: LoginParams): Promise<AuthResult>;
  register(params: RegisterParams): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserInfo | null>;
  validateToken(): Promise<boolean>;
}
