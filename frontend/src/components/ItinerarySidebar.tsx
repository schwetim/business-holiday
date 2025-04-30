import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles

interface ItinerarySidebarProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  onCheckInChange: (date: Date | null) => void;
  onCheckOutChange: (date: Date | null) => void;
}

const ItinerarySidebar: React.FC<ItinerarySidebarProps> = ({ checkInDate, checkOutDate, onCheckInChange, onCheckOutChange }) => {
  // react-datepicker uses a single state for the date range
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([checkInDate, checkOutDate]);
  const [startDate, endDate] = dateRange;

  // Update internal state when props change (e.g., initial load from recommended dates)
  React.useEffect(() => {
    setDateRange([checkInDate, checkOutDate]);
  }, [checkInDate, checkOutDate]);


  // Handle date changes from the calendar
  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    const [newStartDate, newEndDate] = update;

    // Call parent component's handlers when a range is selected
    if (newStartDate && newEndDate) {
      onCheckInChange(newStartDate);
      onCheckOutChange(newEndDate);
    } else if (newStartDate && !newEndDate) {
      // Handle case where only start date is selected (clearing end date)
      onCheckInChange(newStartDate);
      onCheckOutChange(null);
    } else if (!newStartDate && newEndDate) {
       // Handle case where only end date is selected (shouldn't happen with selectsRange=true, but for robustness)
       onCheckInChange(null);
       onCheckOutChange(newEndDate);
    } else {
       // Handle case where both dates are cleared
       onCheckInChange(null);
       onCheckOutChange(null);
    }
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
          dayClassName={(date: Date): string | null =>
            date >= (startDate || new Date(0)) && date <= (endDate || new Date(0)) ? 'bg-blue-200' : null
          } // Highlight selected range (basic)
        />
      </div>
      {/* Other itinerary details will go here */}
    </div>
  );
};

export default ItinerarySidebar;
