import React from 'react';
import { Flight } from '../types'; // Import the shared type
import { format } from 'date-fns'; // Import date-fns for formatting

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {

  // Helper to format price if it's a number
  const formatPrice = (price: number | string, currency?: string) => {
    if (typeof price === 'number') {
      return `${currency || '$'}${price.toFixed(2)}`; // Basic formatting
    }
    return price; // Assume string price is already formatted
  };

  // Helper to format time
  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return format(date, 'HH:mm'); // Format as HH:mm
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return 'Invalid Time';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{flight.airline}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)} ({flight.duration})
          </p>
          <p className="text-sm text-gray-600 mb-3">
            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </p>
          <p className="text-lg font-medium text-gray-800 mb-3">
            {formatPrice(flight.price, flight.currency)}
          </p>
        </div>

        <a
          href={flight.bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          Book Now on kiwi.com
        </a>
      </div>
    </div>
  );
};

export default FlightCard;
