import { Router, Request, Response } from 'express';

const router = Router();

// Mock data for recommended trips
const mockRecommendedTrips = [
  {
    id: 1,
    title: "Tech Conference & Beach Break in Lisbon",
    description: "Attend the annual European Tech Summit (Oct 10-12, 2025) and enjoy a relaxing stay near the coast.",
    imageUrl: "https://via.placeholder.com/400x200?text=Lisbon+Tech+Trip", // Placeholder image
    eventId: 101, // Link to a potential event ID
    destination: "Lisbon, Portugal",
    dates: "Oct 10-15, 2025",
    accommodationSuggestion: "Stay at the Sunny Coast Hotel"
  },
  {
    id: 2,
    title: "Marketing Workshop & City Exploration in Berlin",
    description: "Join a hands-on Digital Marketing Workshop (Nov 5-6, 2025) and explore the vibrant city of Berlin.",
    imageUrl: "https://via.placeholder.com/400x200?text=Berlin+Marketing+Trip", // Placeholder image
    eventId: 102,
    destination: "Berlin, Germany",
    dates: "Nov 5-8, 2025",
    accommodationSuggestion: "Comfortable stay in the city center"
  },
  {
    id: 3,
    title: "Finance Summit & Mountain Retreat in Zurich",
    description: "Participate in the Global Finance Leaders Summit (Dec 1-3, 2025) followed by a refreshing mountain getaway.",
    imageUrl: "https://via.placeholder.com/400x200?text=Zurich+Finance+Trip", // Placeholder image
    eventId: 103,
    destination: "Zurich, Switzerland",
    dates: "Dec 1-5, 2025",
    accommodationSuggestion: "Luxury chalet with a view"
  },
   {
    id: 4,
    title: "Healthcare Expo & Coastal Escape in Barcelona",
    description: "Visit the International Healthcare Exhibition (Jan 20-22, 2026) and unwind on the beautiful Barcelona coast.",
    imageUrl: "https://via.placeholder.com/400x200?text=Barcelona+Healthcare+Trip", // Placeholder image
    eventId: 104,
    destination: "Barcelona, Spain",
    dates: "Jan 20-25, 2026",
    accommodationSuggestion: "Beachfront hotel"
  }
];

// GET /api/recommended-trips
router.get('/', (req: Request, res: Response) => {
  try {
    // In a real application, this would fetch data from a database or service
    res.json(mockRecommendedTrips);
  } catch (error) {
    console.error('Error fetching recommended trips:', error);
    res.status(500).json({ error: 'Failed to fetch recommended trips' });
  }
});

// GET /api/recommended-trips/:id (placeholder for single trip details)
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const trip = mockRecommendedTrips.find(t => t.id === parseInt(id, 10));

  if (trip) {
    res.json(trip);
  } else {
    res.status(404).json({ error: 'Recommended trip not found' });
  }
});


export default router;
