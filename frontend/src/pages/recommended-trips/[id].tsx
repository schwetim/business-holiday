import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { RecommendedTrip, Event, Accommodation, Flight } from '../../types'; // Import necessary types
import Link from 'next/link';
import SuggestedAccommodationCard from '../../components/SuggestedAccommodationCard'; // Import the new component
import SuggestedFlightCard from '../../components/SuggestedFlightCard'; // Import the new component
import { api } from '../../services/api';

const RecommendedTripDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [recommendedTrip, setRecommendedTrip] = useState<RecommendedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      api.getRecommendedTripById(id as string)
        .then((data: RecommendedTrip | null) => {
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
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-12">Loading trip details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!recommendedTrip) {
    return <div className="text-center py-12 text-gray-500">Recommended trip not found.</div>;
  }

  const {
    title,
    description,
    imageUrl,
    destination,
    dates,
    eventDetails,
    suggestedAccommodation,
    suggestedFlights,
  } = recommendedTrip;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Hero Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover rounded-md mb-6"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />

        {/* Trip Overview */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Destination & Dates</h2>
            <p className="text-gray-700"><span className="font-medium">Destination:</span> {destination}</p>
            <p className="text-gray-700"><span className="font-medium">Dates:</span> {dates}</p>
          </div>

          {/* Event Details */}
          {eventDetails && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Related Event</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{eventDetails.name}</h3>
              <p className="text-gray-700 text-sm mb-2">{eventDetails.description}</p>
              <p className="text-gray-600 text-sm"><span className="font-medium">Dates:</span> {eventDetails.startDate} - {eventDetails.endDate}</p>
              {eventDetails.websiteUrl && (
                <a href={eventDetails.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Event Website</a>
              )}
            </div>
          )}
        </div>

        {/* Suggested Accommodation */}
        {suggestedAccommodation && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Suggested Accommodation</h2>
            {/* Use the new SuggestedAccommodationCard component */}
            <SuggestedAccommodationCard accommodation={suggestedAccommodation} />
            {/* "Book Now" button for Accommodation */}
            <a href={suggestedAccommodation.bookingLink} target="_blank" rel="noopener noreferrer">
              <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
                Book Accommodation Now
              </button>
            </a>
          </div>
        )}

        {/* Suggested Flights */}
        {suggestedFlights && suggestedFlights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Suggested Flights</h2>
            <div className="grid grid-cols-1 gap-4">
              {suggestedFlights.map(flight => (
                // Use the new SuggestedFlightCard component
                <SuggestedFlightCard key={flight.id} flight={flight} />
              ))}
            </div>
             {/* "Book Now" button for Flights (could be per flight or a general link) */}
             {/* This example uses the first flight's link, adjust as needed */}
             {suggestedFlights[0]?.bookingLink && (
                <a href={suggestedFlights[0].bookingLink} target="_blank" rel="noopener noreferrer">
                  <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
                    Book Flights Now
                  </button>
                </a>
             )}
          </div>
        )}

        {/* Map Placeholder */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Location Map</h2>
          <div className="w-full h-64 bg-gray-300 rounded-md flex items-center justify-center text-gray-600">
            Map Placeholder
            {/* TODO: Integrate Google Maps JS API here */}
          </div>
        </div>

        {/* Back Button */}
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
