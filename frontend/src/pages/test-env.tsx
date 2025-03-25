import { useEffect, useState } from 'react';

export default function TestEnv() {
  const [envData, setEnvData] = useState<{
    apiUrl: string | undefined;
    testFetch: string;
  }>({
    apiUrl: undefined,
    testFetch: 'Not fetched yet'
  });

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        setEnvData(prev => ({ ...prev, apiUrl }));
        
        if (apiUrl) {
          const response = await fetch(`${apiUrl}/api/events?test=1`);
          const text = await response.text();
          setEnvData(prev => ({ ...prev, testFetch: text }));
        }
      } catch (error) {
        setEnvData(prev => ({ 
          ...prev, 
          testFetch: `Error: ${error instanceof Error ? error.message : String(error)}`
        }));
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Environment Test</h1>
      <div className="space-y-4">
        <p>API URL: {envData.apiUrl || 'Not set'}</p>
        <p>Test Fetch Result: {envData.testFetch}</p>
      </div>
    </div>
  );
}
