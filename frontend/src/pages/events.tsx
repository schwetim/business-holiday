import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Event } from '../types';
import EventCard from '../components/EventCard';

// Simple Pagination component
const Pagination = ({ eventsPerPage, totalEvents, paginate, currentPage }: {
  eventsPerPage: number;
  totalEvents: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-8">
      <ul className="flex justify-center list-none p-0">
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
        </li>
        {/* Basic display, could add more sophisticated page number list */}
        <li className="mx-1 px-3 py-1 border rounded bg-blue-500 text-white">
          {currentPage}
        </li>
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length || pageNumbers.length === 0}
            className="mx-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};


export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]); // Store all fetched events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(20); // Number of events per page

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch all events
        const fetchedEvents = await api.getEvents({ industry: '' }); // Pass empty industry to satisfy type

        // Sort events by date (earliest first)
        const sortedEvents = fetchedEvents.sort((a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setAllEvents(sortedEvents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  // Group events by industry and paginate
  const groupedAndPaginatedEvents = useMemo(() => {
    // Implement pagination on the flat list first
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    // Then group the current page's events by industry
    const paginatedGrouped = currentEvents.reduce((acc, event) => {
      const industry = event.industry || 'Other'; // Handle potential missing industry
      if (!acc[industry]) {
        acc[industry] = [];
      }
      acc[industry].push(event);
      return acc;
    }, {} as Record<string, Event[]>);


    return paginatedGrouped;

  }, [allEvents, currentPage, eventsPerPage]); // Re-calculate when allEvents, currentPage, or eventsPerPage changes

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total number of pages (for pagination component)
  // const totalPages = Math.ceil(allEvents.length / eventsPerPage); // Not directly used in this pagination component


  if (loading) {
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

  const industryNames = Object.keys(groupedAndPaginatedEvents).sort(); // Sort industries alphabetically

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Explore Events
        </h1>

        {allEvents.length === 0 ? (
          <div className="text-xl text-gray-600 text-center">
            No events found.
          </div>
        ) : (
          <>
            {industryNames.map(industry => (
              <div key={industry} className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                  {industry}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedAndPaginatedEvents[industry].map((event) => (
                    // Use the shared EventCard component
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <Pagination
              eventsPerPage={eventsPerPage}
              totalEvents={allEvents.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
