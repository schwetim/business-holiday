import React from 'react';
import Link from 'next/link'; // Assuming Next.js for routing
import { RecommendedTrip } from '../types'; // Import the shared type

interface RecommendedTripCardProps {
  trip: RecommendedTrip;
}

const RecommendedTripCard: React.FC<RecommendedTripCardProps> = ({ trip }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <img
        src={trip.imageUrl}
        alt={trip.title}
        className="w-full h-48 object-cover"
        // Basic error handling for images
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{trip.title}</h3>
        <p className="text-sm text-gray-700 mb-3">{trip.description}</p>
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-medium">Dates:</span> {trip.dates}
          <br />
          <span className="font-medium">Accommodation:</span> {trip.accommodationSuggestion}
        </p>
        <Link href={`/recommended-trips/${trip.id}`} passHref>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecommendedTripCard;
