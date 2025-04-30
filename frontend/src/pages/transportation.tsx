import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseDateString } from '../utils/dateUtils'; // Assuming parseDateString is needed

const TransportationPage: React.FC = () => {
  const router = useRouter();
  const { eventId, accommodationId, location, checkInDate, checkOutDate } = router.query;

  const [eventDetails, setEventDetails] = useState<any>(null); // State to potentially store event details
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Optional: Fetch event details if needed for display
  // useEffect(() => {
  //   if (eventId && typeof eventId === 'string') {
  //     // Fetch event details using eventId if necessary
  //     // api.getEventById(eventId).then(...)
  //   }
  // }, [eventId]);


  // Format dates for display
  const formattedCheckInDate = checkInDate && typeof checkInDate === 'string' ? parseDateString(checkInDate).toLocaleDateString() : 'N/A';
  const formattedCheckOutDate = checkOutDate && typeof checkOutDate === 'string' ? parseDateString(checkOutDate).toLocaleDateString() : 'N/A';


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transportation Options</h1>

      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Trip Details:</h2>
        <p><strong>Event ID:</strong> {eventId || 'N/A'}</p>
        <p><strong>Accommodation Choice:</strong> {accommodationId === 'skipped' ? 'Skipped' : accommodationId || 'N/A'}</p>
        <p><strong>Location:</strong> {location || 'N/A'}</p>
        <p><strong>Dates:</strong> {formattedCheckInDate} - {formattedCheckOutDate}</p>
        {/* Potentially display event name here if fetched */}
        {/* {eventDetails && <p><strong>For Event:</strong> {eventDetails.name}</p>} */}
      </div>

      {/* Transportation search/listing will go here */}
      {/* Transportation search/listing will go here */}
      <p>Transportation search and results will be displayed here.</p>

      {/* Skip Transportation Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            // Pass all existing query parameters and add transportationId=skipped
            router.push({
              pathname: '/results',
              query: {
                eventId: eventId,
                accommodationId: accommodationId,
                location: location,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                transportationId: 'skipped', // Indicate transportation was skipped
              },
            });
          }}
          className="text-blue-600 hover:underline"
        >
          Skip Transportation
        </button>
      </div>

      {/* Link to next step (e.g., Booking Summary) - TBD */}
      {/* <div className="mt-6 text-right">
        <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Continue to Booking Summary
        </button>
      </div> */}
    </div>
  );
};

export default TransportationPage;
