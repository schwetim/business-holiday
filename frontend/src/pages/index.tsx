import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import SelectField from '../components/SelectField';
import IndustrySelect from '../components/IndustrySelect';

interface Event {
  id: number;
  name: string;
  industry: string;
  city: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
}

export default function Home() {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/events/industries')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Response is not JSON");
        }
        return res.json();
      })
      .then(data => setIndustries(data))
      .catch(error => {
        console.error('Error fetching industries:', error);
        setIndustries([]);
      });
  }, []);

  const handleSearch = async () => {
    if (!industry) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events?industry=${industry}&region=${region}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Response is not JSON");
      }
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroBanner />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Find Business Events & Hotels
          </h1>
          
          <div className="space-y-6">
            <IndustrySelect
              value={industry}
              onChange={setIndustry}
            />

            <SelectField
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                { value: 'Europe', label: 'Europe' },
                { value: 'Asia', label: 'Asia' },
                { value: 'North America', label: 'North America' },
                { value: 'South America', label: 'South America' },
                { value: 'Africa', label: 'Africa' },
                { value: 'Oceania', label: 'Oceania' },
              ]}
              placeholder="Select region (optional)"
            />

            <button
              onClick={handleSearch}
              disabled={!industry || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Searching...' : 'Search Business Events & Hotels'}
            </button>

            {events.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold">Found {events.length} events</h2>
                {events.map(event => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {event.city}, {event.country} ({event.region})
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
