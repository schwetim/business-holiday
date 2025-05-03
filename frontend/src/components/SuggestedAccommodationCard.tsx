import React from 'react';
import { Accommodation } from '../types'; // Import the shared type

interface SuggestedAccommodationCardProps {
  accommodation: Accommodation;
}

const SuggestedAccommodationCard: React.FC<SuggestedAccommodationCardProps> = ({ accommodation }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex">
      {accommodation.imageUrl && (
        <img
          src={accommodation.imageUrl}
          alt={accommodation.name}
          className="w-32 h-32 object-cover flex-shrink-0"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{accommodation.name}</h3>
        {accommodation.rating && (
          <p className="text-sm text-gray-600 mb-2">Rating: {accommodation.rating}/5</p>
        )}
        <p className="text-md font-bold text-gray-800 mb-3">
          {accommodation.totalPrice ? `Total: ${accommodation.totalPrice} ${accommodation.currency || ''}` : `Price: ${accommodation.price} ${accommodation.currency || ''}`}
        </p>
        {/* The "Book Now" button will be handled on the detail page */}
      </div>
    </div>
  );
};

export default SuggestedAccommodationCard;
