import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import EventCard from '../components/EventCard';
import { EventCardProps } from '../components/EventCard';

interface Event {
  id: string;
  name: string;
  startDate: Date;
  location: string;
  industry: string;
  description?: string;
  websiteUrl?: string;
  ticketPrice?: number;
  imagePath?: string;
  address: {
    city: string;
    region: string;
    country: string;
    street?: string;
    zip?: string;
  };
  clickLogs: number;
  bookings: number;
}

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventCardProps | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!router.isReady) return;

      try {
        const queryString = new URLSearchParams({
          industry: router.query.industry as string,
          airport: router.query.airport as string,
          startDate: router.query.startDate as string,
          endDate: router.query.endDate as string,
        }).toString();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?${queryString}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data: Event[] = await response.json();
        console.log('Fetched events data:', data);
        setEvents(data.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router.isReady, router.query]);

  const handleSelectEvent = (event: EventCardProps) => {
    setSelectedEvent(event);
  };

  if (!router.isReady || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  console.log('Rendering events page with:', events.length, 'events');

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
            <p className="text-gray-600">{selectedEvent.location}</p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Events
        </h1>

        {events.length === 0 ? (
          <div className="text-xl text-gray-600 text-center">
            No events found for your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              console.log('Rendering EventCard with:', event);
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  name={event.name}
                  startDate={new Date(event.startDate)}
                  location={event.location}
                  industry={event.industry}
                  description={event.description}
                  websiteUrl={event.websiteUrl}
                  ticketPrice={event.ticketPrice}
                  imagePath={event.imagePath}
                  address={event.address}
                  clickLogs={event.clickLogs}
                  bookings={event.bookings}
                  onSelect={handleSelectEvent}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
