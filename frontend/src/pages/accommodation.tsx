import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api'; 
import { Accommodation, Event } from '../types'; // Import Event type as well
import AccommodationCard from '../components/AccommodationCard'; 


const AccommodationPage: React.FC = () => {
  const router = useRouter();
  const { eventId, location, startDate, endDate } = router.query;

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState<boolean>(true); 
  const [accommodationError, setAccommodationError] = useState<string | null>(null); 

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Fetch Selected Event Details
  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      setLoadingEvent(true);
      setEventError(null);
      api.getEventById(eventId)
        .then(eventData => {
          if (eventData) {
            setSelectedEvent(eventData);
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
  }, [eventId, router.isReady]);

  // Fetch Accommodations (existing useEffect)
  useEffect(() => {
    // Fetch accommodations only if location and dates are available
    if (location && typeof location === 'string' && startDate && typeof startDate === 'string' && endDate && typeof endDate === 'string') {
      setLoadingAccommodations(true); // Use renamed state setter
      setAccommodationError(null); // Use renamed state setter

      // Use the specific function from the api service
      api.getAccommodations({ 
        location,
        startDate,
        endDate,
        // eventId could also be passed if needed by backend logic
        // eventId: eventId 
      })
        .then(response => {
          // The response is already expected to be Accommodation[]
          setAccommodations(response); 
          setLoadingAccommodations(false); // Use renamed state setter
        })
        .catch(err => {
          // Correctly handle the error within the catch block
          console.error("Error fetching accommodations:", err);
          setAccommodationError('Failed to load accommodations. Please try again later.'); // Use renamed state setter
          setLoadingAccommodations(false); // Use renamed state setter
        });
    } else if (router.isReady) { 
      // This block should be outside the 'if' that triggers the fetch, 
      // but inside the useEffect, to handle missing params after router is ready.
      setAccommodationError('Missing required information (location or dates) to search for accommodations.'); // Use renamed state setter
      setLoadingAccommodations(false); // Use renamed state setter
    }
    // Add router.isReady to dependency array to ensure query params are available
  }, [location, startDate, endDate, router.isReady]); // Removed eventId dependency here as it's handled in the other useEffect

  // Helper to format date range
  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return '';
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
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
                {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accommodation Section Header */}
      <h2 className="text-2xl font-bold mb-4">Select Accommodation in {location || '...'}</h2>
      
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
            // Use the actual AccommodationCard component
            <AccommodationCard key={acc.id} accommodation={acc} /> 
          ))}
        </div>
      )}
    </>
  );
};

export default AccommodationPage;
