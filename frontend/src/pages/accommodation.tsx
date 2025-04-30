import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { Accommodation, Event } from '../types'; // Import Event type as well
import ItinerarySidebar from '../components/ItinerarySidebar'; // Import the new sidebar component
import AccommodationCard from '../components/AccommodationCard';
import { parseDateString, addSubtractDays, formatDateToISO, calculateInclusiveDuration } from '../utils/dateUtils'; // Import date utilities


const AccommodationPage: React.FC = () => {
  const router = useRouter();
  const { eventId, location } = router.query; // Removed startDate and endDate from here

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState<boolean>(true);
  const [accommodationError, setAccommodationError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // State for selected dates (initialized with recommended dates)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  // Calculate total duration based on selected dates
  const totalDuration = (checkInDate && checkOutDate) ? calculateInclusiveDuration(checkInDate, checkOutDate) : null;


  // Fetch Selected Event Details and Calculate Initial Recommended Dates
  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      setLoadingEvent(true);
      setEventError(null);
      api.getEventById(eventId)
        .then(eventData => {
          if (eventData) {
            setSelectedEvent(eventData);

            // Calculate initial recommended dates
            const eventStartDate = parseDateString(eventData.startDate);
            const eventEndDate = parseDateString(eventData.endDate);

            const initialCheckIn = addSubtractDays(eventStartDate, -3);
            const initialCheckOut = addSubtractDays(eventEndDate, 2);

            // Set initial state for checkInDate and checkOutDate
            setCheckInDate(initialCheckIn);
            setCheckOutDate(initialCheckOut);

          } else {
            setEventError(`Event with ID ${eventId} not found.`);
          }
          setLoadingEvent(false);
        })
        .catch(err => {
          console.error("Error fetching event details:", err);
          setEventError('Failed to load event details.');
          setLoadingEvent(false);
        });
    } else if (router.isReady) {
      setEventError('Event ID is missing from URL.');
      setLoadingEvent(false);
    }
  }, [eventId, router.isReady]); // Depend on eventId and router readiness


  // Fetch Accommodations using Selected Dates
  useEffect(() => {
    // Fetch accommodations only if location and selected dates are available
    if (location && typeof location === 'string' && checkInDate && checkOutDate) {
      setLoadingAccommodations(true);
      setAccommodationError(null);

      // Format selected dates to ISO strings for the API call
      const formattedCheckIn = formatDateToISO(checkInDate);
      const formattedCheckOut = formatDateToISO(checkOutDate);

      api.getAccommodations({
        location,
        startDate: formattedCheckIn,
        endDate: formattedCheckOut,
        // eventId could also be passed if needed by backend logic
        // eventId: eventId
      })
        .then(response => {
          setAccommodations(response);
          setLoadingAccommodations(false);
        })
        .catch(err => {
          console.error("Error fetching accommodations:", err);
          setAccommodationError('Failed to load accommodations. Please try again later.');
          setLoadingAccommodations(false);
        });
    } else if (router.isReady) {
      // This block handles cases where location or dates are missing.
      if (!location) {
         setAccommodationError('Missing required information (location) to search for accommodations.');
      } else if (!checkInDate || !checkOutDate) {
         // This case might happen if event fetching fails or dates are cleared
         setAccommodationError('Please select check-in and check-out dates to search for accommodations.');
      }
      setLoadingAccommodations(false);
    }
    // Dependency array: Trigger fetch when location or selected dates change
  }, [location, checkInDate, checkOutDate, router.isReady]);


  // Handlers for date changes from the sidebar calendar
  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
  };

  const handleCheckOutChange = (date: Date | null) => {
    setCheckOutDate(date);
  };


  // Helper to format date range for event details display
  const formatEventDateRange = (start?: string, end?: string) => {
    if (!start || !end) return '';
    const startDateObj = parseDateString(start); // Use helper
    const endDateObj = parseDateString(end);   // Use helper
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${startDateObj.toLocaleDateString(undefined, options)} - ${endDateObj.toLocaleDateString(undefined, options)}`;
  };


  return (
    <> {/* Use Fragment to avoid extra div */}
      {/* Selected Event Details Section */}
      <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-lg">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Selected Event:</h2>
          {loadingEvent && <p>Loading event details...</p>}
          {eventError && <p className="text-red-500">{eventError}</p>}
          {selectedEvent && !loadingEvent && !eventError && (
            <div>
              <p className="text-xl font-bold text-indigo-700">{selectedEvent.name}</p>
              <p className="text-sm text-gray-600">
                {selectedEvent.city}, {selectedEvent.country} {selectedEvent.region ? `(${selectedEvent.region})` : ''}
              </p>
              <p className="text-sm text-gray-500">
                {formatEventDateRange(selectedEvent.startDate, selectedEvent.endDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Column */}
        <div className="md:col-span-1">
          <ItinerarySidebar
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
          />
        </div>

        {/* Main Content Column */}
        <div className="md:col-span-3">
          {/* Accommodation Section Header */}
          {loadingEvent || !selectedEvent ? (
             <h2 className="text-2xl font-bold mb-4">Select Accommodation...</h2>
          ) : (
             <h2 className="text-2xl font-bold mb-4">
               {totalDuration !== null ? `${totalDuration} day trip` : 'Select dates'} to {location || '...'} for {selectedEvent.name}
             </h2>
          )}


          {/* Link back to event search or specific event? TBD */}
          {/* <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">
            &larr; Back
          </button> */}

          {/* Accommodation Loading/Error/List */}
          {loadingAccommodations && <p>Loading accommodations...</p>}

          {accommodationError && <p className="text-red-500">{accommodationError}</p>}

          {!loadingAccommodations && !accommodationError && accommodations.length === 0 && (
            <p>No accommodations found for the specified location and dates.</p>
          )}

          {!loadingAccommodations && !accommodationError && accommodations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.map(acc => (
                // Use the actual AccommodationCard component and pass required props
                <AccommodationCard
                  key={acc.id}
                  accommodation={acc}
                  eventId={eventId}
                  location={location}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                />
              ))}
            </div>
          )}

          {/* Skip Accommodation Button */}
          {!loadingAccommodations && !accommodationError && (
             <div className="mt-6 text-center">
               <button
                 onClick={() => {
                   if (!eventId || !location || !checkInDate || !checkOutDate) {
                     console.error("Missing required data for skip navigation:", { eventId, location, checkInDate, checkOutDate });
                     // Optionally show an error message to the user
                     return;
                   }
                   const formattedCheckIn = formatDateToISO(checkInDate);
                   const formattedCheckOut = formatDateToISO(checkOutDate);

                   router.push({
                     pathname: '/transportation',
                     query: {
                       eventId: eventId,
                       accommodationId: 'skipped', // Indicate accommodation was skipped
                       location: location,
                       checkInDate: formattedCheckIn,
                       checkOutDate: formattedCheckOut,
                     },
                   });
                 }}
                 className="text-blue-600 hover:underline"
               >
                 Skip Accommodation
               </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccommodationPage;
