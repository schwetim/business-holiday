import React from 'react';
import { Flight } from '../types'; // Import the shared type

interface SuggestedFlightCardProps {
  flight: Flight;
}

const SuggestedFlightCard: React.FC<SuggestedFlightCardProps> = ({ flight }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{flight.airline}</h3>
        <p className="text-md font-bold text-gray-800">{flight.price} {flight.currency || ''}</p>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        <p><span className="font-medium">Departure:</span> {flight.departureTime}</p>
        <p><span className="font-medium">Arrival:</span> {flight.arrivalTime}</p>
        <p><span className="font-medium">Duration:</span> {flight.duration}</p>
        <p><span className="font-medium">Stops:</span> {flight.stops}</p>
      </div>
      {/* The "Book Now" button will be handled on the detail page */}
    </div>
  );
};

export default SuggestedFlightCard;
