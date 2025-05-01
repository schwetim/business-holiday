import express, { Request, Response, Router } from 'express';
import { Flight } from '../types'; // Import from backend types
import { addHours, format } from 'date-fns'; // Import date-fns for mock data

const router: Router = express.Router();

// Mock data generation function
const generateMockFlights = (origin: string, destination: string, startDate: string, endDate: string): Flight[] => {
  console.log(`Generating mock flights from ${origin} to ${destination} for dates ${startDate} to ${endDate}`);

  // Simple mock data - replace with real API call later
  const mockFlights: Flight[] = [
    {
      id: 'flight1',
      airline: 'MockAir',
      departureTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"), // Example: 2 hours from now
      arrivalTime: format(addHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"), // Example: 5 hours from now
      duration: '3h 0m',
      stops: 0,
      price: 120,
      currency: 'EUR',
      bookingLink: `https://www.kiwi.com/en/search/${origin}/${destination}/${startDate}/${endDate}/?affilid=YOUR_AFFILIATE_ID`,
    },
    {
      id: 'flight2',
      airline: 'DummyWings',
      departureTime: format(addHours(new Date(), 6), "yyyy-MM-dd'T'HH:mm:ss"),
      arrivalTime: format(addHours(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss"),
      duration: '4h 0m',
      stops: 1,
      price: 90,
      currency: 'EUR',
      bookingLink: `https://www.kiwi.com/en/search/${origin}/${destination}/${startDate}/${endDate}/?affilid=YOUR_AFFILIATE_ID`,
    },
    {
      id: 'flight3',
      airline: 'Placeholder Airlines',
      departureTime: format(addHours(new Date(), 12), "yyyy-MM-dd'T'HH:mm:ss"),
      arrivalTime: format(addHours(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss"),
      duration: '3h 0m',
      stops: 0,
      price: 150,
      currency: 'EUR',
      bookingLink: `https://www.kiwi.com/en/search/${origin}/${destination}/${startDate}/${endDate}/?affilid=YOUR_AFFILIATE_ID`,
    },
  ];

  return mockFlights;
};

// GET /api/flights
router.get('/', (req: Request, res: Response) => {
  const { origin, destination, startDate, endDate } = req.query;

  if (!origin || typeof origin !== 'string' || !destination || typeof destination !== 'string' || !startDate || typeof startDate !== 'string' || !endDate || typeof endDate !== 'string') {
    return res.status(400).json({ message: 'Missing required query parameters: origin, destination, startDate, endDate' });
  }

  try {
    // TODO: Replace with actual WayAway API call
    const flights = generateMockFlights(origin, destination, startDate, endDate);
    res.json(flights);
  } catch (error) {
    console.error("Error fetching/generating flights:", error);
    res.status(500).json({ message: 'Internal server error while fetching flights' });
  }
});

export default router;
