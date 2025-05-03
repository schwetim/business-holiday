import { useState, useEffect } from 'react';
import SelectField from '../components/SelectField';
import IndustrySelect from '../components/IndustrySelect';
import EventCard from '../components/EventCard'; // Import the new component
import { Event } from '../types'; // Import the shared type

// Removed the old inline Event interface

export default function Home() {
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'destinations', 'dates'
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [keywords, setKeywords] = useState(''); // New state for keywords
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
    if (activeTab === 'events') {
      if (!industry && !keywords && !region) return; // Allow search with just keywords or region
      setIsLoading(true);
      try {
        // Include keywords in the API call if needed by the backend
        const res = await fetch(`/api/events?industry=${industry}&region=${region}&keywords=${keywords}`);
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
    }
    // Placeholder search logic for other tabs
    else if (activeTab === 'destinations') {
      console.log('Searching destinations...');
      // Add placeholder logic here
    } else if (activeTab === 'dates') {
      console.log('Searching dates...');
      // Add placeholder logic here
    }
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case 'events':
        return isLoading ? 'Searching Events...' : 'Show me upcoming events';
      case 'destinations':
        return 'Explore Destinations';
      case 'dates':
        return 'Find by Date';
      default:
        return 'Search';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8"> {/* Keep padding for content */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Find Business Events & Hotels
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center font-medium text-sm focus:outline-none ${
              activeTab === 'events'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium text-sm focus:outline-none ${
              activeTab === 'destinations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('destinations')}
          >
            Destinations
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium text-sm focus:outline-none ${
              activeTab === 'dates'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('dates')}
          >
            Dates
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'events' && (
            <>
              {/* Keywords/Event Name */}
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords / Event Name
                </label>
                <input
                  type="text"
                  id="keywords"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., Tech Conference, Marketing Summit"
                />
              </div>

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

              {/* Categories Multi-select Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                  Categories multi-select placeholder
                </div>
              </div>
            </>
          )}

          {activeTab === 'destinations' && (
            <>
              {/* Country/Region Dropdown Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country / Region
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                  Country/Region dropdown placeholder
                </div>
              </div>

              {/* Date Range Picker Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                  Date range picker placeholder
                </div>
              </div>
            </>
          )}

          {activeTab === 'dates' && (
            <>
              {/* Date Range Picker Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                  Date range picker placeholder
                </div>
              </div>

              {/* Optional Destination Field Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Optional Destination
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                  Optional destination field placeholder
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSearch}
            disabled={(activeTab === 'events' && !industry && !keywords && !region) || isLoading} // Disable only for events if no fields are filled
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {getButtonLabel()}
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
          {!isLoading && events.length === 0 && activeTab === 'events' && (industry || keywords || region) && ( // Show message only after search attempt on events tab
            <p className="text-center text-gray-500 mt-8">No events found for the selected criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}
