export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  createdAt: Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string; // ISO date string or Date
  store: 'sisera' | 'boss';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
}


