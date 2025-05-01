import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import { isWithinInterval, parseISO } from 'date-fns'; // Import date-fns functions

interface ItinerarySidebarProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  eventStartDate: string; // Event start date string from API
  eventEndDate: string;   // Event end date string from API
  onCheckInChange: (date: Date | null) => void;
  onCheckOutChange: (date: Date | null) => void;
}

const ItinerarySidebar: React.FC<ItinerarySidebarProps> = ({
  checkInDate,
  checkOutDate,
  eventStartDate,
  eventEndDate,
  onCheckInChange,
  onCheckOutChange
}) => {
  // react-datepicker uses a single state for the date range
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([checkInDate, checkOutDate]);
  const [startDate, endDate] = dateRange;

  // Parse event dates once
  const parsedEventStartDate = React.useMemo(() => parseISO(eventStartDate), [eventStartDate]);
  const parsedEventEndDate = React.useMemo(() => parseISO(eventEndDate), [eventEndDate]);

  // Update internal state when props change (e.g., initial load from recommended dates)
  React.useEffect(() => {
    setDateRange([checkInDate, checkOutDate]);
  }, [checkInDate, checkOutDate]);


  // Handle date changes from the calendar
  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    const [newStartDate, newEndDate] = update;

    // Call parent component's handlers when a range is selected
    // The validation logic will be handled in the parent (accommodation.tsx)
    onCheckInChange(newStartDate);
    onCheckOutChange(newEndDate);
  };

  // Function to determine day class names
  const getDayClassName = (date: Date): string | null => {
    let className = '';

    // Highlight selected range
    if (startDate && endDate && date >= startDate && date <= endDate) {
      className += ' bg-blue-200';
    }

    // Highlight event dates
    if (isWithinInterval(date, { start: parsedEventStartDate, end: parsedEventEndDate })) {
       className += ' bg-green-200'; // Use a different color for event dates
    }

    // Combine classes, trim whitespace
    return className.trim() || null;
  };


  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Trip Itinerary</h3>
      {/* Calendar Widget */}
      <div className="bg-white p-3 rounded-md shadow-inner">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          isClearable={true}
          inline // Display calendar inline
          calendarClassName="border-0 shadow-none" // Basic styling adjustments
          dayClassName={getDayClassName} // Use the custom function for day classes
        />
      </div>
      {/* Other itinerary details will go here */}
    </div>
  );
};

export default ItinerarySidebar;
