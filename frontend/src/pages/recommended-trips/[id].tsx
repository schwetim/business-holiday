import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { RecommendedTrip } from '../../types'; // Import the type
import Link from 'next/link'; // Import Link

const RecommendedTripDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL

  const [recommendedTrip, setRecommendedTrip] = useState<RecommendedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) { // Ensure ID is available before fetching
      setIsLoading(true);
      fetch(`/api/recommended-trips/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: RecommendedTrip) => {
          setRecommendedTrip(data);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching recommended trip ${id}:`, err);
          setError('Failed to load recommended trip details.');
          setRecommendedTrip(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]); // Re-run effect if ID changes

  if (isLoading) {
    return <div className="text-center py-12">Loading trip details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!recommendedTrip) {
    return <div className="text-center py-12 text-gray-500">Recommended trip not found.</div>;
  }

  // Display trip details
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <img
          src={recommendedTrip.imageUrl}
          alt={recommendedTrip.title}
          className="w-full h-64 object-cover rounded-md mb-6"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{recommendedTrip.title}</h1>
        <p className="text-gray-700 mb-4">{recommendedTrip.description}</p>
        <div className="text-sm text-gray-600 mb-6">
          <p><span className="font-medium">Destination:</span> {recommendedTrip.destination}</p>
          <p><span className="font-medium">Dates:</span> {recommendedTrip.dates}</p>
          <p><span className="font-medium">Accommodation Suggestion:</span> {recommendedTrip.accommodationSuggestion}</p>
          {/* Link to event details if eventId is relevant and a page exists */}
          {recommendedTrip.eventId && (
             <p><span className="font-medium">Related Event ID:</span> {recommendedTrip.eventId}</p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link href="/recommended-trips" passHref>
            <button className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out">
              Back to All Recommendations
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedTripDetailPage;
