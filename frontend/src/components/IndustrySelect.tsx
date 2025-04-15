import React, { useEffect, useState } from 'react';
import SelectField from './SelectField';
import { api } from '../services/api';

interface IndustrySelectProps {
  value: string;
  onChange: (value: string) => void;
  industries?: string[];
  onIndustriesLoaded?: (industries: string[]) => void;
}

const IndustrySelect: React.FC<IndustrySelectProps> = ({ 
  value, 
  onChange,
  industries: externalIndustries,
  onIndustriesLoaded
}) => {
  const [industries, setIndustries] = useState<string[]>(externalIndustries || []);
  const [loading, setLoading] = useState(!externalIndustries);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip API call if industries were provided by parent component
    if (externalIndustries && externalIndustries.length > 0) {
      setIndustries(externalIndustries);
      setLoading(false);
      return;
    }
    
    const fetchIndustries = async () => {
      try {
        console.log('IndustrySelect: Fetching industries');
        const data = await api.getIndustries();
        console.log('IndustrySelect: Received industries', data);
        
        if (!Array.isArray(data)) {
          console.error('IndustrySelect: Received non-array data:', data);
          setError('Received invalid data format from API');
          return;
        }
        
        setIndustries(data);
        
        // Notify parent component if callback provided
        if (onIndustriesLoaded) {
          onIndustriesLoaded(data);
        }
      } catch (err) {
        console.error('IndustrySelect: Error fetching industries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, [externalIndustries, onIndustriesLoaded]);

  // Add debugging output to help troubleshoot
  console.log('IndustrySelect render:', { 
    industries, 
    loading, 
    error, 
    hasExternalIndustries: Boolean(externalIndustries && externalIndustries.length > 0)
  });

  return (
    <div>
      <SelectField
        id="industry"
        label="Industry"
        value={value}
        options={industries.map((i) => ({ label: i, value: i }))}
        onChange={onChange}
        disabled={loading}
        error={error || undefined}
        placeholder="Select an industry"
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading industries...</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default IndustrySelect;
