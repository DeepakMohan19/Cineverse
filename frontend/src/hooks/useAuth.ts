import { create } from 'zustand';

interface AuthState {
  user: { _id: string; name: string; email: string } | null;
  token: string | null;
  setUser: (user: AuthState['user'], token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user') as string) 
    : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  
  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
