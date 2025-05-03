import { useState, useEffect } from 'react';
import RecommendedTripCard from '../components/RecommendedTripCard'; // Import the component
import { RecommendedTrip } from '../types'; // Import the type
import Link from 'next/link'; // Import Link

const RecommendedTripsPage: React.FC = () => {
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/recommended-trips')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
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
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Recommended Trips</h1>

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
