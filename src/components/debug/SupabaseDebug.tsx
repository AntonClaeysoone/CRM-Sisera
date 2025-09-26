import { useState } from 'react';
import { testSupabaseConnection } from '../../lib/testSupabase';

const SupabaseDebug = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setTesting(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        🔍 Supabase Debug Tool
      </h3>
      
      <button
        onClick={handleTest}
        disabled={testing}
        className="btn-primary mb-4"
      >
        {testing ? 'Testing...' : 'Test Supabase Connection'}
      </button>

      {result && (
        <div className={`p-4 rounded-md ${
          result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <h4 className="font-medium mb-2">
            {result.success ? '✅ Success!' : '❌ Failed'}
          </h4>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium">Troubleshooting steps:</h4>
        <ol className="list-decimal ml-4 mt-2 space-y-1">
          <li>Check if environment variables are set correctly</li>
          <li>Verify Supabase URL and anon key are correct</li>
          <li>Make sure the migration has been run</li>
          <li>Check if RLS is disabled via Supabase dashboard</li>
          <li>Verify database table exists and is accessible</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseDebug;

