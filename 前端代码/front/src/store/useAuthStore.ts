import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserInfo {
  account: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: UserInfo | null;

  setAuth: (token: string, user: UserInfo) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        token: null,
        currentUser: null,

        setAuth: (token, user) =>
          set({ isAuthenticated: true, token, currentUser: user }, false, 'setAuth'),

        clearAuth: () =>
          set({ isAuthenticated: false, token: null, currentUser: null }, false, 'clearAuth'),

        updateUser: (updates) =>
          set(
            (state) => ({
              currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
            }),
            false,
            'updateUser',
          ),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          currentUser: state.currentUser,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
