import { useState, useEffect } from 'react';
import RecommendedTripCard from '../components/RecommendedTripCard'; // Import the component
import { RecommendedTrip } from '../types'; // Import the type
import Link from 'next/link'; // Import Link
import { api } from '../services/api';

const RecommendedTripsPage: React.FC = () => {
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder state for filtering and sorting
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'popularity', 'price'

  useEffect(() => {
    setIsLoading(true);
    // TODO: Implement actual filtering and sorting in the backend API call
    api.getRecommendedTrips()
      .then((data: RecommendedTrip[]) => {
        setRecommendedTrips(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching recommended trips:', err);
        setError('Failed to load recommended trips.');
        setRecommendedTrips([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [/* Add filter/sort dependencies here when implemented */]); // Add dependencies when filtering/sorting is implemented

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">All Recommended Trips</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Handpicked Event and Accommodation Packages to Maximize Your Business Travel
        </p>
        {/* Rest of the page content */}

        {/* Filtering and Sorting UI - Placeholder */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Regions</option>
            {/* TODO: Populate with actual regions from API */}
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
          </select>

          <select
            value={filterDuration}
            onChange={(e) => setFilterDuration(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Any Duration</option>
            {/* TODO: Populate with actual duration options */}
            <option value="short">Short (1-3 days)</option>
            <option value="medium">Medium (4-7 days)</option>
            <option value="long">Long (8+ days)</option>
          </select>

          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Any Price Range</option>
            {/* TODO: Populate with actual price range options */}
            <option value="low">Low (&lt; $500)</option>
            <option value="medium">Medium ($500 - $1500)</option>
            <option value="high">High (&gt; $1500)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="newest">Sort by Newest</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {isLoading && <p className="text-center">Loading recommendations...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!isLoading && recommendedTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTrips.map(trip => (
              <RecommendedTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {!isLoading && recommendedTrips.length === 0 && !error && (
          <p className="text-center text-gray-500">No recommended trips available at this time.</p>
        )}

        <div className="mt-8 text-center">
           <Link href="/" passHref>
             <button className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out">
               Back to Homepage
             </button>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedTripsPage;
