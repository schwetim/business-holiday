import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router'; // Import useRouter
import { Event } from '../types'; // Import the shared type

// Simple ChevronDown icon component (can be replaced with a library icon)
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggle }) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const router = useRouter(); // Initialize router

  // Sync internal state with external prop
  useEffect(() => {
    setIsOpen(isExpanded);
  }, [isExpanded]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if icon is clicked
    onToggle();
  };

  // Function to handle event selection
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card toggle when clicking button
    router.push({
      pathname: '/accommodation',
      query: { 
        eventId: event.id, 
        location: event.city, // Use city as location for now
        startDate: event.startDate,
        endDate: event.endDate,
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={onToggle} // Allow clicking anywhere on the card to toggle
    >
      {/* Compact View */}
      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{event.name}</h3>
          <p className="text-sm text-gray-600">
            {event.city}, {event.country} {event.region ? `(${event.region})` : ''}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </p>
          <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {event.industry}
          </span>
        </div>
        <button
          onClick={handleToggle}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label={isOpen ? 'Collapse' : 'Expand'}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDownIcon className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      {/* Expanded View - Animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="border-t border-gray-200"
            // Prevent click propagation from expanded section if needed
            // onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-4 space-y-3">
              {event.imagePath && (
                <img 
                  src={event.imagePath} 
                  alt={event.name} 
                  className="w-full h-48 object-cover rounded-md mb-3" 
                  // Basic error handling for images
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              {event.description && (
                <p className="text-sm text-gray-700">{event.description}</p>
              )}

              {/* Categories and Tags */}
              {(((event.categories?.length ?? 0) > 0) || ((event.tags?.length ?? 0) > 0)) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {event.categories?.map(category => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category.name}
                    </span>
                  ))}
                  {event.tags?.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm">
                <p><span className="font-medium">Address:</span> {event.street} {event.streetNumber}, {event.zipCode} {event.city}, {event.country}</p>
              </div>
              {event.ticketPrice != null && (
                 <p className="text-sm"><span className="font-medium">Price:</span> ${Number(event.ticketPrice).toFixed(2)}</p>
              )}
              {event.websiteUrl && (
                <a
                  href={event.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()} // Prevent card toggle when clicking link
                >
                  Visit Event Website
                </a>
              )}
              {/* Placeholder for counts - uncomment and adjust if API provides them */}
              {/* <p className="text-sm text-gray-500">Clicks: {event.clickLogsCount ?? 0}</p> */}
              {/* <p className="text-sm text-gray-500">Bookings: {event.bookingsCount ?? 0}</p> */}

              {/* Select Button */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center"> {/* Added flex classes */}
                {/* Save Button Placeholder */}
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 text-sm"
                  onClick={(e) => { e.stopPropagation(); alert('Save button clicked!'); }} // Placeholder action
                >
                  Save
                </button>
                <button
                  onClick={handleSelect}
                  className="w-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" // Adjusted width
                >
                  Select Event & Find Accommodation
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCard;
