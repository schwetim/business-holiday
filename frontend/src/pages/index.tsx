import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import SelectField from '../components/SelectField';
import IndustrySelect from '../components/IndustrySelect';
import EventCard from '../components/EventCard'; // Import the new component
import { Event } from '../types'; // Import the shared type

// Removed the old inline Event interface

export default function Home() {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [events, setEvents] = useState<Event[]>([]); // Use imported Event type
  const [industries, setIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null); // State for expanded card

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

            {/* Event List Section */}
            {isLoading && <p className="text-center mt-8">Loading events...</p>}
            {!isLoading && events.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Found {events.length} events</h2>
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isExpanded={event.id === expandedCardId}
                    onToggle={() => setExpandedCardId(prevId => prevId === event.id ? null : event.id)}
                  />
                ))}
              </div>
            )}
            {!isLoading && events.length === 0 && industry && ( // Show message only after search attempt
              <p className="text-center text-gray-500 mt-8">No events found for the selected criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
