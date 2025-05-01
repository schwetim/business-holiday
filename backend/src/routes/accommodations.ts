import express, { Request, Response, Router } from 'express';
import { Accommodation } from '../types'; // Import from backend types
import { differenceInDays, parseISO } from 'date-fns'; // Import date-fns

const router: Router = express.Router();

// Mock data generation function
const generateMockAccommodations = (location: string, startDateStr: string, endDateStr: string): Accommodation[] => {
  // Simple mock data - replace with real API call later
  const mockHotels = [
    { id: 'hotel1', name: `Grand Hotel ${location}`, price: 150, currency: 'EUR', rating: 4.5, imageUrl: `/mock-images/hotel1.jpg`, bookingLink: '#' },
    { id: 'hotel2', name: `Central Inn ${location}`, price: 95, currency: 'EUR', rating: 3.8, imageUrl: `/mock-images/hotel2.jpg`, bookingLink: '#' },
    { id: 'hotel3', name: `Riverside Suites ${location}`, price: 210, currency: 'EUR', rating: 4.8, imageUrl: null, bookingLink: '#' }, // Example with no image
    { id: 'hotel4', name: `Budget Stay ${location}`, price: 'Contact for price', currency: 'EUR', rating: 3.0, imageUrl: `/mock-images/hotel4.jpg`, bookingLink: '#' }, // Example with string price
  ];

  // Basic filtering/variation based on input (can be more sophisticated)
  // For now, just return the list slightly varied or filtered if needed.
  // Example: return fewer hotels if dates are short? Or vary prices?
  // Let's just return the full list for now for simplicity.

  console.log(`Generating mock accommodations for ${location} from ${startDateStr} to ${endDateStr}`);

  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);
  const durationInDays = differenceInDays(endDate, startDate);
  const durationInNights = durationInDays > 0 ? durationInDays : 1; // Assume at least 1 night stay

  // Add booking links and calculate total price
  return mockHotels.map(hotel => {
    const totalPrice = typeof hotel.price === 'number'
      ? hotel.price * durationInNights
      : hotel.price; // Keep string price as is

    return {
      ...hotel,
      totalPrice,
      // In a real scenario, the booking link would be generated based on dates, location, etc.
      bookingLink: `https://example.booking.com/search?location=${encodeURIComponent(location)}&checkin=${startDateStr}&checkout=${endDateStr}&hotel_id=${hotel.id}&aid=YOUR_AFFILIATE_ID`
    };
  });
};

// GET /api/accommodations
router.get('/', (req: Request, res: Response) => {
  const { location, startDate, endDate } = req.query;

  if (!location || typeof location !== 'string' || !startDate || typeof startDate !== 'string' || !endDate || typeof endDate !== 'string') {
    return res.status(400).json({ message: 'Missing required query parameters: location, startDate, endDate' });
  }

  try {
    // TODO: Replace with actual Booking.com API call
    const accommodations = generateMockAccommodations(location, startDate, endDate);
    res.json(accommodations);
  } catch (error) {
    console.error("Error fetching/generating accommodations:", error);
    res.status(500).json({ message: 'Internal server error while fetching accommodations' });
  }
});

export default router;
