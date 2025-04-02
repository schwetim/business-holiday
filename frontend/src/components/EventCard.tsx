import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EventCardProps {
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
  onSelect: (event: EventCardProps) => void;
}

export default function EventCard({
  id,
  name,
  startDate,
  location,
  industry,
  description,
  websiteUrl,
  ticketPrice,
  imagePath,
  address,
  clickLogs,
  bookings,
  onSelect,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log('EventCard received props:', {
    id,
    name,
    startDate,
    location,
    industry,
    description,
    websiteUrl,
    ticketPrice,
    imagePath,
    address,
    clickLogs,
    bookings
  });

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect({
      id,
      name,
      startDate,
      location,
      industry,
      description,
      websiteUrl,
      ticketPrice,
      imagePath,
      address,
      clickLogs,
      bookings,
      onSelect,
    });
  };

  return (
    <motion.div
      className="border rounded-lg shadow-sm overflow-hidden cursor-pointer"
      onClick={toggleExpansion}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-600">{location} - {industry}</p>
            <p className="text-sm text-gray-500">
              {startDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mt-4 space-y-2">
                {description && (
                  <p className="text-sm text-gray-700">{description}</p>
                )}

                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Website
                  </a>
                )}

                {ticketPrice && (
                  <p className="text-sm text-gray-700">
                    Ticket Price: ${ticketPrice.toFixed(2)}
                  </p>
                )}

                {imagePath && (
                  <img
                    src={imagePath}
                    alt={name}
                    className="mt-2 rounded-lg"
                  />
                )}

                <div className="text-sm text-gray-700">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.region}</p>
                  <p>{address.country} {address.zip}</p>
                </div>

                <div className="flex space-x-4 text-sm text-gray-600 mt-2">
                  <p>Views: {clickLogs}</p>
                  <p>Bookings: {bookings}</p>
                </div>
                <button
                  onClick={handleSelect}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Select Event
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
