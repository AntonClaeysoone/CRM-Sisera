import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Dummy authentication - in real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@sisera.be' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: 'admin@sisera.be',
            name: 'Admin Sisera',
            role: 'admin',
            createdAt: new Date()
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);



