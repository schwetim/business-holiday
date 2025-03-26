import React, { useEffect, useState } from 'react';
import SelectField from './SelectField';

interface IndustrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const IndustrySelect: React.FC<IndustrySelectProps> = ({ value, onChange }) => {
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/industries`);
        const data = await res.json();
        setIndustries(data);
      } catch (err) {
        console.error('Error fetching industries:', err);
        setError('Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <SelectField
      id="industry"
      label="Industry"
      value={value}
      options={industries.map((i) => ({ label: i, value: i }))}
      onChange={onChange}
      disabled={loading}
      error={error || undefined}
    />
  );
};

export default IndustrySelect;
