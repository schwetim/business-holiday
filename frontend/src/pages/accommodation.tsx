import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { Accommodation, Event } from '../types'; // Import Event type as well
import ItinerarySidebar from '../components/ItinerarySidebar'; // Import the new sidebar component
import AccommodationCard from '../components/AccommodationCard';
import { parseDateString, addSubtractDays, formatDateToISO, calculateInclusiveDuration, isDateRangeValid } from '../utils/dateUtils'; // Import date utilities and validation helper
import { isWithinInterval, parseISO } from 'date-fns'; // Import date-fns for validation

const AccommodationPage: React.FC = () => {
  const router = useRouter();
  const { eventId, location } = router.query;

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState<boolean>(true);
  const [accommodationError, setAccommodationError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // State for selected dates (initialized with recommended dates)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  // State for tentative date selection from calendar (before validation)
  const [tentativeCheckInDate, setTentativeCheckInDate] = useState<Date | null>(null);
  const [tentativeCheckOutDate, setTentativeCheckOutDate] = useState<Date | null>(null);

  // State for validation hint message
  const [validationHint, setValidationHint] = useState<string | null>(null);

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

            // Set initial state for both selected and tentative dates
            setCheckInDate(initialCheckIn);
            setCheckOutDate(initialCheckOut);
            setTentativeCheckInDate(initialCheckIn);
            setTentativeCheckOutDate(initialCheckOut);

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

  // Validation logic and state update based on tentative dates
  useEffect(() => {
    if (selectedEvent && tentativeCheckInDate && tentativeCheckOutDate) {
      const eventStartDate = parseISO(selectedEvent.startDate);
      const eventEndDate = parseISO(selectedEvent.endDate);

      // Check if the tentative range includes the event dates
      const isValid = isDateRangeValid(
        tentativeCheckInDate,
        tentativeCheckOutDate,
        eventStartDate,
        eventEndDate
      );

      if (isValid) {
        // If valid, update the main state and hide hint
        setCheckInDate(tentativeCheckInDate);
        setCheckOutDate(tentativeCheckOutDate);
        setValidationHint(null);
      } else {
        // If invalid, show hint and do NOT update main state
        setValidationHint("Selected range must include the event dates.");
        // Keep the main checkInDate/checkOutDate state unchanged
      }
    } else if (tentativeCheckInDate || tentativeCheckOutDate) {
        // If one date is selected but not the other, clear hint
        setValidationHint(null);
    } else {
        // If both dates are cleared, clear hint
        setValidationHint(null);
    }
  }, [tentativeCheckInDate, tentativeCheckOutDate, selectedEvent]); // Depend on tentative dates and selected event

  // Fetch Accommodations using Selected Dates (this useEffect now depends on the *validated* dates)
  useEffect(() => {
    // Fetch accommodations only if location and *validated* selected dates are available
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
    } else if (router.isReady && (!checkInDate || !checkOutDate)) {
      // This block handles cases where location or *validated* dates are missing.
      // Only show error if router is ready and dates are missing after potential initial load
      if (!location) {
         setAccommodationError('Missing required information (location) to search for accommodations.');
      } else if (!checkInDate || !checkOutDate) {
         // This case might happen if event fetching fails or dates are cleared
         setAccommodationError('Please select check-in and check-out dates to search for accommodations.');
      }
      setLoadingAccommodations(false);
    }
    // Dependency array: Trigger fetch when location or *validated* selected dates change
  }, [location, checkInDate, checkOutDate, router.isReady]);

  // Handlers for date changes from the sidebar calendar (update tentative state)
  const handleTentativeCheckInChange = useCallback((date: Date | null) => {
    setTentativeCheckInDate(date);
    // Clear hint on any new interaction
    setValidationHint(null);
  }, []);

  const handleTentativeCheckOutChange = useCallback((date: Date | null) => {
    setTentativeCheckOutDate(date);
     // Clear hint on any new interaction
    setValidationHint(null);
  }, []);


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
      {/* Main content area with sidebar */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Column */}
        <div className="md:col-span-1">
          {selectedEvent && ( // Only render sidebar if event is loaded
            <ItinerarySidebar
              checkInDate={tentativeCheckInDate} // Pass tentative dates to sidebar
              checkOutDate={tentativeCheckOutDate} // Pass tentative dates to sidebar
              onCheckInChange={handleTentativeCheckInChange} // Use tentative handlers
              onCheckOutChange={handleTentativeCheckOutChange} // Use tentative handlers
              eventStartDate={selectedEvent.startDate} // Pass event dates for highlighting
              eventEndDate={selectedEvent.endDate} // Pass event dates for highlighting
            />
          )}
           {/* Validation Hint */}
           {validationHint && (
              <p className="text-red-500 text-sm mt-2">{validationHint}</p>
           )}
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
          {loadingAccommodations && (
             <div className="flex justify-center items-center h-48">
               <p className="text-lg font-semibold">Loading accommodations...</p>
             </div>
          )}

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
