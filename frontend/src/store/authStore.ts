import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ 
          token, 
          user, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);