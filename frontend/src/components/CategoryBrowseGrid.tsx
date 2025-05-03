import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { IndustryWithCount } from '../types';
import Link from 'next/link';

const CategoryBrowseGrid: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const data = await api.getIndustriesWithCount();
        // Limit to 12 industries as requested
        setIndustries(data.slice(0, 12));
      } catch (err) {
        setError('Failed to load industries.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  if (loading) {
    return <div>Loading industries...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Browse by Industry & Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {industries.map((industry) => (
          <Link key={industry.name} href={`/results?industry=${encodeURIComponent(industry.name)}`} passHref>
            <div className="block cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              {/* Placeholder for icon/image */}
              <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                {industry.name.charAt(0)}
              </div>
              <h3 className="text-sm font-semibold truncate">{industry.name}</h3>
              <p className="text-xs text-gray-500">{industry.count} events</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBrowseGrid;
