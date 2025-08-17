import { useState, useEffect } from 'react';
import SelectField from '../components/SelectField';
import IndustrySelect from '../components/IndustrySelect';
import EventCard from '../components/EventCard'; // Import the new component
import CategoryMultiSelect from '../components/CategoryMultiSelect'; // Import the new component
import TagMultiSelect from '../components/TagMultiSelect'; // Import the new component
import Link from 'next/link'; // Import Link for navigation
import RecommendedTripCard from '../components/RecommendedTripCard'; // Import the new component
import CategoryBrowseGrid from '../components/CategoryBrowseGrid'; // Import the new component
import { Event, Category, Tag, RecommendedTrip, CountryWithCount } from '../types'; // Import the shared types
import { api } from '../services/api'; // Import the API service
import DatePicker, { registerLocale } from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import { enGB } from 'date-fns/locale'; // Import a locale

registerLocale('en-GB', enGB); // Register the locale

// Removed the old inline Event interface

export default function Home() {
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'destinations', 'dates'
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [keywords, setKeywords] = useState(''); // New state for keywords
  const [events, setEvents] = useState<Event[]>([]); // Use imported Event type
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // New state for selected categories
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // New state for selected tags
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>([]); // New state for recommended trips
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null); // State for expanded card

  // State for Destination tab
  const [countries, setCountries] = useState<CountryWithCount[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // State for Dates tab
  const [startDateDatesTab, setStartDateDatesTab] = useState<Date | null>(null);
  const [endDateDatesTab, setEndDateDatesTab] = useState<Date | null>(null);
  const [optionalDestination, setOptionalDestination] = useState<string>('');


  // Fetch industries on mount
  useEffect(() => {
    api.getIndustries()
      .then(data => setIndustries(data))
      .catch(error => {
        console.error('Error fetching industries:', error);
        setIndustries([]);
      });
  }, []);

  // Fetch recommended trips on mount
  useEffect(() => {
    api.getRecommendedTrips()
      .then((data: RecommendedTrip[]) => {
        setRecommendedTrips(data);
      })
      .catch(error => {
        console.error('Error fetching recommended trips:', error);
        setRecommendedTrips([]);
      });
  }, []);

  // Fetch countries with event counts on mount for Destination tab
  useEffect(() => {
    api.getCountriesWithEventCounts()
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setCountries([]);
      });
  }, []); // Empty dependency array means this runs once on mount


  const handleSearch = async () => {
    if (activeTab === 'events') {
      // Allow search with any combination of filters, including none
      setIsLoading(true);
      try {
        // Fetch categories and tags to map selected IDs to names for the API call
        const allCategories: Category[] = await api.getCategories();
        const allTags: Tag[] = await api.getTags();

        const selectedCategoryNames = allCategories
          .filter(cat => selectedCategories.includes(cat.id))
          .map(cat => cat.name);

        const selectedTagNames = allTags
          .filter(tag => selectedTags.includes(tag.id))
          .map(tag => tag.name);


        const queryParams = new URLSearchParams();
        if (industry) queryParams.append('industry', industry);
        if (region) queryParams.append('region', region);
        if (keywords) queryParams.append('keywords', keywords);
        if (selectedCategoryNames.length > 0) {
          queryParams.append('categories', selectedCategoryNames.join(','));
        }
        if (selectedTagNames.length > 0) {
          queryParams.append('tags', selectedTagNames.join(','));
        }

        const data = await api.getEvents({
          industry: industry || '',
          region: region || '',
          startDate: startDate?.toISOString() || '',
          endDate: endDate?.toISOString() || '',
          categories: selectedCategoryNames.length > 0 ? selectedCategoryNames.join(',') : undefined,
          tags: selectedTagNames.length > 0 ? selectedTagNames.join(',') : undefined,
          keywords: keywords || ''
        });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    // Search logic for Destinations tab
    else if (activeTab === 'destinations') {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCountry) queryParams.append('country', selectedCountry); // Use 'country' parameter for country
        if (startDate) queryParams.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) queryParams.append('endDate', endDate.toISOString().split('T')[0]);

        console.log('Fetching events for destinations:', queryParams.toString()); // Log the URL

        const data = await api.getEvents({
          country: selectedCountry || undefined,
          startDate: startDate?.toISOString().split('T')[0] || undefined,
          endDate: endDate?.toISOString().split('T')[0] || undefined
        });
        console.log('Received data for destinations:', data); // Log the received data
        setEvents(data); // Update events state with filtered results
      } catch (error) {
        console.error('Error fetching events for destinations:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    // Search logic for Dates tab
    else if (activeTab === 'dates') {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (optionalDestination) queryParams.append('region', optionalDestination); // Use 'region' parameter for optional destination
        if (startDateDatesTab) queryParams.append('startDate', startDateDatesTab.toISOString());
        if (endDateDatesTab) queryParams.append('endDate', endDateDatesTab.toISOString());

        console.log('Fetching events for dates tab:', queryParams.toString()); // Log the URL

        const data = await api.getEvents({
          region: optionalDestination || undefined,
          startDate: startDateDatesTab?.toISOString() || undefined,
          endDate: endDateDatesTab?.toISOString() || undefined
        });
        console.log('Received data for dates tab:', data); // Log the received data
        setEvents(data); // Update events state with filtered results
      } catch (error) {
        console.error('Error fetching events for dates tab:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getButtonLabel = () => {
    // Rename button for all tabs
    return isLoading ? 'Searching Events...' : 'Find Events';
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8"> {/* Keep padding for content */}
      {/* Search Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12"> {/* Changed from max-w-md to max-w-3xl */}
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
              <div className="flex flex-col md:flex-row gap-6"> {/* Increased gap from gap-4 to gap-6 */}
                <div className="flex-1">
                  <IndustrySelect
                    value={industry}
                    onChange={setIndustry}
                  />
                </div>
                <div className="flex-1">
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
                </div>
              </div>

              {/* Categories Multi-select */}
              <CategoryMultiSelect
                selectedCategories={selectedCategories}
                onChange={setSelectedCategories}
              />

              {/* Tags Multi-select */}
              <TagMultiSelect
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
            </>
          )}

          {activeTab === 'destinations' && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Country/Region Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country / Region
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" // Added h-10 to match Industry dropdown height
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country.country} value={country.country}>
                        {country.country} ({country.count} events)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1">
                {/* Date Range Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Range (Optional)
                  </label>
                  <div className="mt-1">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update: [Date | null, Date | null]) => {
                        const [newStartDate, newEndDate] = update;
                        setStartDate(newStartDate);
                        setEndDate(newEndDate);
                      }}
                      isClearable={true}
                      placeholderText="Select a date range"
                      className="block w-full rounded-md border-gray-300 shadow-sm h-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" // Added h-10
                      dateFormat="yyyy/MM/dd"
                      locale="en-GB"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Date Range Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <div className="mt-1">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDateDatesTab}
                      endDate={endDateDatesTab}
                      onChange={(update: [Date | null, Date | null]) => {
                        const [newStartDate, newEndDate] = update;
                        setStartDateDatesTab(newStartDate);
                        setEndDateDatesTab(newEndDate);
                      }}
                      isClearable={true}
                      placeholderText="Select a date range"
                      className="block w-full rounded-md border-gray-300 shadow-sm h-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      dateFormat="yyyy/MM/dd"
                      locale="en-GB"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {/* Optional Destination Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Optional Destination
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={optionalDestination}
                    onChange={(e) => setOptionalDestination(e.target.value)}
                  >
                    <option value="">Select a destination (optional)</option>
                    {/* Assuming 'countries' state can be reused or a similar list is available */}
                    {countries.map(country => (
                      <option key={country.country} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isLoading} // Disable button while loading
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
          {!isLoading && events.length === 0 && activeTab === 'events' && (industry || keywords || region || selectedCategories.length > 0 || selectedTags.length > 0) && ( // Show message only after search attempt on events tab
            <p className="text-center text-gray-500 mt-8">No events found for the selected criteria.</p>
          )}
        </div>
      </div>

      {/* Recommended Trips Section */}
      {recommendedTrips.length > 0 && (
        <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-md p-6"> {/* Slightly different background */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recommended Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Responsive grid */}
            {recommendedTrips.slice(0, 3).map(trip => ( // Display first 3-4 trips
              <RecommendedTripCard key={trip.id} trip={trip} />
            ))}
          </div>
          {recommendedTrips.length > 3 && ( // Show "See All" button if more than 3 trips
            <div className="mt-8 text-center">
              <Link href="/recommended-trips" passHref>
                <button className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                  See All Recommendations
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Browse by Industry & Category Section */}
      <CategoryBrowseGrid />
    </div>
  );
}
