import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseDateString } from '../utils/dateUtils'; // Assuming parseDateString is needed

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const { eventId, accommodationId, location, checkInDate, checkOutDate, transportationId } = router.query;

  // Format dates for display
  const formattedCheckInDate = checkInDate && typeof checkInDate === 'string' ? parseDateString(checkInDate).toLocaleDateString() : 'N/A';
  const formattedCheckOutDate = checkOutDate && typeof checkOutDate === 'string' ? parseDateString(checkOutDate).toLocaleDateString() : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trip Summary & Booking</h1>

      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Selections:</h2>
        <p><strong>Event ID:</strong> {eventId || 'N/A'}</p>
        <p><strong>Location:</strong> {location || 'N/A'}</p>
        <p><strong>Dates:</strong> {formattedCheckInDate} - {formattedCheckOutDate}</p>
        <p><strong>Accommodation:</strong> {accommodationId === 'skipped' ? 'Skipped' : accommodationId || 'Not Selected'}</p>
        <p><strong>Transportation:</strong> {transportationId === 'skipped' ? 'Skipped' : transportationId || 'Not Selected'}</p>
        {/* Potentially display event name here if fetched */}
        {/* {eventDetails && <p><strong>For Event:</strong> {eventDetails.name}</p>} */}
      </div>

      {/* Booking summary and affiliate links will go here */}
      <p>Booking summary and links to affiliate sites will be displayed here.</p>

      {/* Example Affiliate Link Button (TBD) */}
      {/* <div className="mt-6 text-center">
        <a href="#" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Book Now via Affiliate
        </a>
      </div> */}
    </div>
  );
};

export default ResultsPage;
