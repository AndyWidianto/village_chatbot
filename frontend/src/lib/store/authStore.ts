import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  profileUrl: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => 
        set({ 
          user, 
          accessToken: token, 
          isAuthenticated: true 
        }),

      setUser: (user) => 
        set({
          user
        }),
      updateAccessToken: (token) => 
        set({ 
          accessToken: token 
        }),

      logout: () => 
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        }),
    }),
    {
      name: 'auth-storage', // Nama key di localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);