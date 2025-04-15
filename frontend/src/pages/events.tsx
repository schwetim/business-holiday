import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Event {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  date: string;
}

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router.isReady, router.query]);

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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Events
        </h1>

        {events.length === 0 ? (
          <div className="text-xl text-gray-600 text-center">
            No events found for your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{event.location}</p>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      ${event.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/event/${event.id}`)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
