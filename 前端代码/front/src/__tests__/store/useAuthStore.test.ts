import { useAuthStore } from '@/store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      token: null,
      currentUser: null,
    });
  });

  describe('setAuth', () => {
    it('sets authentication state', () => {
      const store = useAuthStore.getState();
      store.setAuth('token-abc', {
        account: 'admin',
        username: '管理员',
        email: 'admin@test.com',
        phone: '13800000000',
      });
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('token-abc');
      expect(state.currentUser?.account).toBe('admin');
      expect(state.currentUser?.username).toBe('管理员');
    });
  });

  describe('clearAuth', () => {
    it('clears authentication state', () => {
      const store = useAuthStore.getState();
      store.setAuth('token-abc', {
        account: 'admin',
        username: '管理员',
        email: 'admin@test.com',
        phone: '13800000000',
      });
      store.clearAuth();
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.currentUser).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('updates user info partially', () => {
      const store = useAuthStore.getState();
      store.setAuth('token-abc', {
        account: 'admin',
        username: '管理员',
        email: 'admin@test.com',
        phone: '13800000000',
      });
      store.updateUser({ username: '新管理员', phone: '13900000000' });
      const state = useAuthStore.getState();
      expect(state.currentUser?.username).toBe('新管理员');
      expect(state.currentUser?.phone).toBe('13900000000');
      expect(state.currentUser?.account).toBe('admin');
      expect(state.currentUser?.email).toBe('admin@test.com');
    });

    it('does nothing when no user is set', () => {
      const store = useAuthStore.getState();
      store.updateUser({ username: '新管理员' });
      expect(useAuthStore.getState().currentUser).toBeNull();
    });

    it('updates avatar', () => {
      const store = useAuthStore.getState();
      store.setAuth('token-abc', {
        account: 'admin',
        username: '管理员',
        email: 'admin@test.com',
        phone: '13800000000',
      });
      store.updateUser({ avatar: 'https://example.com/avatar.png' });
      expect(useAuthStore.getState().currentUser?.avatar).toBe('https://example.com/avatar.png');
    });
  });
});
