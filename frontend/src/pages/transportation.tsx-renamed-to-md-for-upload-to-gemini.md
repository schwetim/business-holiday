import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api'; // Import api service
import { Flight } from '../types'; // Import Flight type
import FlightCard from '../components/FlightCard'; // Import FlightCard component
import { parseDateString, formatDateToISO } from '../utils/dateUtils'; // Import date utilities

const TransportationPage: React.FC = () => {
  const router = useRouter();
  // Read accumulated query parameters
  const { eventId, accommodationId, location, checkInDate, checkOutDate } = router.query;

  // State for origin input
  const [origin, setOrigin] = useState<string>('');

  // State for flights, loading, and error
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loadingFlights, setLoadingFlights] = useState<boolean>(false);
  const [flightError, setFlightError] = useState<string | null>(null);

  // State to potentially store event details (optional, but useful for display)
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Fetch event details if needed for display
  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      setLoadingEvent(true);
      setEventError(null);
      api.getEventById(eventId)
        .then(eventData => {
          setEventDetails(eventData);
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
  }, [eventId]);


  // Format dates for display
  const formattedCheckInDate = checkInDate && typeof checkInDate === 'string' ? parseDateString(checkInDate).toLocaleDateString() : 'N/A';
  const formattedCheckOutDate = checkOutDate && typeof checkOutDate === 'string' ? parseDateString(checkOutDate).toLocaleDateString() : 'N/A';

  // Handle "Find Flights" button click
  const handleFindFlights = async () => {
    // Ensure required parameters are available
    if (!origin || !location || !checkInDate || !checkOutDate) {
      setFlightError('Please provide origin, destination, check-in, and check-out dates.');
      return;
    }

    setLoadingFlights(true);
    setFlightError(null);
    setFlights([]); // Clear previous results

    try {
      // Format dates to ISO strings for the API call
      const formattedCheckIn = formatDateToISO(new Date(checkInDate as string));
      const formattedCheckOut = formatDateToISO(new Date(checkOutDate as string));

      const fetchedFlights = await api.getFlights({
        origin,
        destination: location as string, // Use location from query as destination
        startDate: formattedCheckIn,
        endDate: formattedCheckOut,
      });
      setFlights(fetchedFlights);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlightError('Failed to load flights. Please try again later.');
    } finally {
      setLoadingFlights(false);
    }
  };

  // Handle "Finish Trip Planning" button click
  const handleFinishPlanning = () => {
     // Ensure required parameters are available for navigation
     if (!eventId || !location || !checkInDate || !checkOutDate || !origin) {
        console.error("Missing required data for finish navigation:", { eventId, location, checkInDate, checkOutDate, origin });
        // Optionally show an error message to the user
        return;
     }

     // Pass all accumulated query parameters
     router.push({
       pathname: '/results',
       query: {
         eventId: eventId,
         accommodationId: accommodationId,
         location: location,
         checkInDate: checkInDate,
         checkOutDate: checkOutDate,
         origin: origin, // Add origin
         transportationProvider: 'kiwi', // Indicate provider (mock for now)
         // Note: We don't pass a specific flight ID as the user might not select one
       },
     });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transportation Options</h1>

      {/* Trip Details Section */}
      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Trip Details:</h2>
        {loadingEvent && <p>Loading event details...</p>}
        {eventError && <p className="text-red-500">{eventError}</p>}
        {eventDetails && !loadingEvent && !eventError && (
          <p><strong>For Event:</strong> {eventDetails.name}</p>
        )}
        <p><strong>Event ID:</strong> {eventId || 'N/A'}</p>
        <p><strong>Accommodation Choice:</strong> {accommodationId === 'skipped' ? 'Skipped' : accommodationId || 'N/A'}</p>
        <p><strong>Destination:</strong> {location || 'N/A'}</p> {/* Use Destination here */}
        <p><strong>Dates:</strong> {formattedCheckInDate} - {formattedCheckOutDate}</p>
      </div>

      {/* Flight Search Section */}
      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Flights</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Starting location (e.g., London)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFindFlights}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            disabled={loadingFlights} // Disable button while loading
          >
            {loadingFlights ? 'Searching...' : 'Find Flights'}
          </button>
        </div>

        {/* Flight Loading/Error/List */}
        {loadingFlights && (
           <div className="flex justify-center items-center h-32">
             <p className="text-lg font-semibold">Loading flights...</p>
           </div>
        )}

        {flightError && <p className="text-red-500">{flightError}</p>}

        {!loadingFlights && !flightError && flights.length === 0 && (
          <p>Enter your starting location and click "Find Flights" to see options.</p>
        )}

        {!loadingFlights && !flightError && flights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}

        {/* See More Flights Link */}
        {!loadingFlights && !flightError && flights.length > 0 && (
           <div className="mt-6 text-center">
             <a
               href={`https://www.kiwi.com/en/search/${origin}/${location}/${formattedCheckInDate}/${formattedCheckOutDate}/?affilid=YOUR_AFFILIATE_ID`} // Construct Kiwi link
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline"
             >
               See more flights for your Itinerary on kiwi.com
             </a>
           </div>
        )}
      </div>


      {/* Finish Trip Planning Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleFinishPlanning}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          // Disable if origin is not entered, as it's needed for the next step
          disabled={!origin}
        >
          Finish Trip Planning
        </button>
      </div>
    </div>
  );
};

export default TransportationPage;
