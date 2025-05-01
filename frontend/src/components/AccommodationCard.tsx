import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { Accommodation } from '../types'; // Import the shared type
import { formatDateToISO } from '../utils/dateUtils'; // Import date formatting helper

interface AccommodationCardProps {
  accommodation: Accommodation;
  eventId: string | string[] | undefined; // Add eventId prop
  location: string | string[] | undefined; // Add location prop
  checkInDate: Date | null; // Add checkInDate prop
  checkOutDate: Date | null; // Add checkOutDate prop
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  eventId,
  location,
  checkInDate,
  checkOutDate,
}) => {
  const router = useRouter(); // Initialize router

  // Helper to format price if it's a number
  const formatPrice = (price: number | string, currency?: string) => {
    if (typeof price === 'number') {
      return `${currency || '$'}${price.toFixed(2)}`; // Basic formatting
    }
    return price; // Assume string price is already formatted
  };

  // Handle button click to navigate to transportation page
  const handleSelectAccommodation = () => {
    if (!eventId || !location || !checkInDate || !checkOutDate) {
      console.error("Missing required data for navigation:", { eventId, location, checkInDate, checkOutDate });
      // Optionally show an error message to the user
      return;
    }

    // Format dates to ISO strings for query parameters
    const formattedCheckIn = formatDateToISO(checkInDate);
    const formattedCheckOut = formatDateToISO(checkOutDate);

    router.push({
      pathname: '/transportation',
      query: {
        eventId: eventId,
        accommodationId: accommodation.id, // Pass accommodation ID
        location: location,
        checkInDate: formattedCheckIn,
        checkOutDate: formattedCheckOut,
      },
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      {accommodation.imageUrl && (
        <img
          src={accommodation.imageUrl}
          alt={accommodation.name}
          className="w-full h-48 object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
        />
      )}
      {!accommodation.imageUrl && (
         <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
           No Image Available
         </div>
      )}

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{accommodation.name}</h3>
          {accommodation.rating != null && (
            <p className="text-sm text-yellow-600 mb-2">Rating: {accommodation.rating} / 5</p> // Assuming a 5-star scale
          )}
          <p className="text-lg font-medium text-gray-800 mb-1">
            {formatPrice(accommodation.price, accommodation.currency)} per night
          </p>
          {accommodation.totalPrice != null && (
             <p className="text-base text-gray-700 mb-3">
               {formatPrice(accommodation.totalPrice, accommodation.currency)} total for stay
             </p>
          )}
        </div>

        {/* Changed from <a> to <button> and updated text/handler */}
        <button
          onClick={handleSelectAccommodation}
          className="mt-auto block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Select and continue to transportation
        </button>
      </div>
    </div>
  );
};

export default AccommodationCard;
