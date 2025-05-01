import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api'; // Import api service
import { Event } from '../types'; // Import Event type
import { parseDateString } from '../utils/dateUtils'; // Assuming parseDateString is needed

const ResultsPage: React.FC = () => {
  const router = useRouter();
  // Read all accumulated query parameters
  const { eventId, accommodationId, location, checkInDate, checkOutDate, origin, transportationProvider } = router.query;

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Fetch Selected Event Details for display
  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      setLoadingEvent(true);
      setEventError(null);
      api.getEventById(eventId)
        .then(eventData => {
          setSelectedEvent(eventData);
          setLoadingEvent(false);
        })
        .catch(err => {
          console.error("Error fetching event details:", err);
          setEventError('Failed to load event details.');
          setLoadingEvent(false);
        });
    } else {
      setLoadingEvent(false); // No eventId, no loading
    }
  }, [eventId]); // Depend on eventId

  // Format dates for display
  const formattedCheckInDate = checkInDate && typeof checkInDate === 'string' ? parseDateString(checkInDate).toLocaleDateString() : 'N/A';
  const formattedCheckOutDate = checkOutDate && typeof checkOutDate === 'string' ? parseDateString(checkOutDate).toLocaleDateString() : 'N/A';

  // Determine Accommodation Status
  const accommodationStatus = accommodationId === 'skipped' ? 'Skipped' : (accommodationId ? `Selected (ID: ${accommodationId})` : 'Not Selected');

  // Determine Transportation Status
  let transportationStatus = 'Not Selected';
  if (origin && transportationProvider) {
      transportationStatus = `Flights from ${origin} via ${transportationProvider}`;
  } else if (transportationProvider === 'skipped') {
      transportationStatus = 'Skipped';
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trip Summary & Booking</h1>

      {/* Trip Summary Section */}
      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Trip Details:</h2>

        {loadingEvent && <p>Loading event details...</p>}
        {eventError && <p className="text-red-500">{eventError}</p>}
        {selectedEvent && !loadingEvent && !eventError && (
          <p className="mb-2"><strong>Event:</strong> {selectedEvent.name}</p>
        )}
        {!selectedEvent && !loadingEvent && !eventError && (
           <p className="mb-2"><strong>Event ID:</strong> {eventId || 'N/A'}</p>
        )}

        <p className="mb-2"><strong>Location:</strong> {location || 'N/A'}</p>
        <p className="mb-2"><strong>Dates:</strong> {formattedCheckInDate} - {formattedCheckOutDate}</p>
        <p className="mb-2"><strong>Accommodation:</strong> {accommodationStatus}</p>
        <p className="mb-2"><strong>Transportation:</strong> {transportationStatus}</p>

        {/* Add more summary details as needed */}
      </div>

      {/* Static Mockups for Additional Booking Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Airport Transfer Mockup */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Book Airport Transfer</h3>
          <p className="text-gray-600 mb-4">Arrange your ride from the airport to your accommodation.</p>
          {/* Placeholder Button/Image */}
          <div className="bg-gray-300 h-12 rounded-md flex items-center justify-center text-gray-700 font-medium">
            Book Transfer via Kiwi.com (Mock)
          </div>
        </div>

        {/* Rental Car Mockup */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Book Rental Car</h3>
          <p className="text-gray-600 mb-4">Explore your destination with a rental car.</p>
          {/* Placeholder Button/Image */}
          <div className="bg-gray-300 h-12 rounded-md flex items-center justify-center text-gray-700 font-medium">
            Book Rental Car via Kiwi.com (Mock)
          </div>
        </div>
      </div>

      {/* Final Booking Links Section (Placeholder) */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 text-center">
         <h2 className="text-lg font-semibold text-gray-800 mb-4">Ready to Book?</h2>
         <p className="text-gray-600 mb-4">Click the links above for Accommodation, Flights, Transfer, and Car Rental to complete your bookings on our affiliate sites.</p>
         {/* Example Affiliate Link Button (TBD - replace with actual links from summary) */}
         {/* <a href="#" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
           Go to Booking Site
         </a> */}
      </div>

    </div>
  );
};

export default ResultsPage;
