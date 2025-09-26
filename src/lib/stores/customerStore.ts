import { create } from 'zustand';
import { Customer, CustomerState } from '../../types';
import { supabase } from '../supabase';

interface CustomerStore extends CustomerState {
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomer: (id: string) => Customer | undefined;
  setCustomers: (customers: Customer[]) => void;
  loadCustomers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
}

// Helper function to convert Supabase customer to app customer format
const convertFromSupabase = (supabaseCustomer: any): Customer => ({
  id: supabaseCustomer.id,
  firstName: supabaseCustomer.first_name,
  lastName: supabaseCustomer.last_name,
  email: supabaseCustomer.email,
  phone: supabaseCustomer.phone,
  address: supabaseCustomer.address,
  birthDate: supabaseCustomer.birth_date,
  store: supabaseCustomer.store as 'sisera' | 'boss',
  notes: supabaseCustomer.notes || '',
  createdAt: new Date(supabaseCustomer.created_at),
  updatedAt: new Date(supabaseCustomer.updated_at)
});

// Helper function to convert app customer to Supabase format
const convertToSupabase = (customer: Partial<Customer>) => ({
  first_name: customer.firstName,
  last_name: customer.lastName,
  email: customer.email,
  phone: customer.phone,
  address: customer.address,
  birth_date: customer.birthDate,
  store: customer.store,
  notes: customer.notes
});

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const customers = data?.map(convertFromSupabase) || [];
      set({ customers, isLoading: false });
    } catch (error) {
      console.error('Error loading customers:', error);
      set({ 
        error: 'Fout bij het laden van klanten: ' + (error as any)?.message,
        isLoading: false 
      });
    }
  },

  refreshCustomers: async () => {
    await get().loadCustomers();
  },

  addCustomer: async (customerData) => {
    try {
      set({ isLoading: true, error: null });

      const supabaseData = convertToSupabase(customerData);
      const { data, error } = await supabase
        .from('customers')
        .insert([supabaseData])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newCustomer = convertFromSupabase(data[0]);
        set(state => ({
          customers: [newCustomer, ...state.customers],
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      set({ 
        error: 'Fout bij het toevoegen van klant: ' + (error as any)?.message,
        isLoading: false 
      });
    }
  },

  updateCustomer: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });

      const supabaseData = convertToSupabase(updates);
      const { data, error } = await supabase
        .from('customers')
        .update(supabaseData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const updatedCustomer = convertFromSupabase(data[0]);
        set(state => ({
          customers: state.customers.map(customer =>
            customer.id === id ? updatedCustomer : customer
          ),
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      set({ 
        error: 'Fout bij het bijwerken van klant: ' + (error as any)?.message,
        isLoading: false 
      });
    }
  },

  deleteCustomer: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting customer:', error);
      set({ 
        error: 'Fout bij het verwijderen van klant: ' + (error as any)?.message,
        isLoading: false 
      });
    }
  },

  getCustomer: (id) => {
    return get().customers.find(customer => customer.id === id);
  },

  setCustomers: (customers) => {
    set({ customers });
  }
}));
