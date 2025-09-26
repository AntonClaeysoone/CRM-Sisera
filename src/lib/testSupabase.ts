import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('customers')
      .select('count(*)')
      .limit(1);
    
    console.log('Health check result:', { healthCheck, healthError });
    
    // Test insert without RLS concerns
    const testCustomer = {
      first_name: 'Test',
      last_name: 'Customer',
      email: `test_${Date.now()}@example.com`,
      phone: '+32 123 456 789',
      address: 'Test Address',
      store: 'sisera'
    };
    
    console.log('Attempting test insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('customers')
      .insert([testCustomer])
      .select();
    
    console.log('Insert result:', { insertData, insertError });
    
    if (insertError) {
      console.error('Insert error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      });
    }
    
    return {
      success: !insertError,
      error: insertError,
      data: insertData
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error
    };
  }
};

