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
        {/* Buttons Container */}
        <div className="flex justify-between items-center mt-4"> {/* Added flex classes and margin-top */}
          <Link href={`/recommended-trips/${trip.id}`} passHref>
            <button className="w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out text-sm"> {/* Adjusted width and text size */}
              View Details
            </button>
          </Link>
          {/* Save Button Placeholder */}
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-300 text-sm"
            onClick={(e) => { e.stopPropagation(); alert('Save button clicked!'); }} // Placeholder action
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedTripCard;
