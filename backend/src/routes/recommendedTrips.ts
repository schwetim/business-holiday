import { Router, Request, Response } from 'express';
import { RecommendedTrip, Event, Accommodation, Flight } from '../types'; // Import necessary types

const router = Router();

// Detailed mock data for recommended trips
const mockRecommendedTrips: RecommendedTrip[] = [
  {
    id: 1,
    title: "Tech Conference & Beach Break in Lisbon",
    description: "Attend the annual European Tech Summit (Oct 10-12, 2025) and enjoy a relaxing stay near the coast.",
    imageUrl: "https://via.placeholder.com/800x400?text=Lisbon+Tech+Trip+Hero", // Hero image
    eventId: 101, // Link to a potential event ID
    destination: "Lisbon, Portugal",
    dates: "Oct 10-15, 2025",
    accommodationSuggestion: "Stay at the Sunny Coast Hotel",
    eventDetails: { // Mock Event Details
      id: 101,
      name: "European Tech Summit",
      description: "A leading conference for technology professionals in Europe.",
      industry: "Technology",
      country: "Portugal",
      city: "Lisbon",
      region: null,
      zipCode: "1000-001",
      street: "Rua da Tecnologia",
      streetNumber: "1",
      location: "Lisbon, Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      startDate: "2025-10-10T09:00:00Z",
      endDate: "2025-10-12T18:00:00Z",
      websiteUrl: "https://example.com/techsummit",
      ticketPrice: 750,
      imagePath: "https://via.placeholder.com/400x200?text=Tech+Summit+Event",
      createdAt: new Date().toISOString(),
      categories: [{ id: 1, name: "Conference" }],
      tags: [{ id: 1, name: "AI" }, { id: 2, name: "Software" }],
    },
    suggestedAccommodation: { // Mock Accommodation
      id: "hotel-lisbon-1",
      name: "Sunny Coast Hotel",
      price: 120,
      currency: "EUR",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/300x200?text=Sunny+Coast+Hotel",
      bookingLink: "https://booking.com/sunny-coast",
      totalPrice: 600, // Example total price for the stay duration
    },
    suggestedFlights: [ // Mock Flights
      {
        id: "flight-lisbon-1",
        airline: "TAP Air Portugal",
        departureTime: "2025-10-10T07:00:00Z",
        arrivalTime: "2025-10-10T09:00:00Z",
        duration: "2h 0m",
        stops: 0,
        price: 150,
        currency: "EUR",
        bookingLink: "https://kiwi.com/flight-lisbon-1",
      },
      {
        id: "flight-lisbon-2",
        airline: "Ryanair",
        departureTime: "2025-10-10T10:00:00Z",
        arrivalTime: "2025-10-10T12:30:00Z",
        duration: "2h 30m",
        stops: 0,
        price: 120,
        currency: "EUR",
        bookingLink: "https://kiwi.com/flight-lisbon-2",
      },
    ],
  },
  {
    id: 2,
    title: "Marketing Workshop & City Exploration in Berlin",
    description: "Join a hands-on Digital Marketing Workshop (Nov 5-6, 2025) and explore the vibrant city of Berlin.",
    imageUrl: "https://via.placeholder.com/800x400?text=Berlin+Marketing+Trip+Hero",
    eventId: 102,
    destination: "Berlin, Germany",
    dates: "Nov 5-8, 2025",
    accommodationSuggestion: "Comfortable stay in the city center",
     eventDetails: { // Mock Event Details
      id: 102,
      name: "Digital Marketing Workshop",
      description: "Learn the latest strategies in digital marketing.",
      industry: "Marketing",
      country: "Germany",
      city: "Berlin",
      region: null,
      zipCode: "10115",
      street: "Friedrichstraße",
      streetNumber: "180",
      location: "Berlin, Germany",
      latitude: 52.5200,
      longitude: 13.4050,
      startDate: "2025-11-05T09:00:00Z",
      endDate: "2025-11-06T17:00:00Z",
      websiteUrl: "https://example.com/marketingworkshop",
      ticketPrice: 500,
      imagePath: "https://via.placeholder.com/400x200?text=Marketing+Workshop+Event",
      createdAt: new Date().toISOString(),
      categories: [{ id: 2, name: "Workshop" }],
      tags: [{ id: 3, name: "Digital" }, { id: 4, name: "Strategy" }],
    },
    suggestedAccommodation: { // Mock Accommodation
      id: "hotel-berlin-1",
      name: "City Center Hotel Berlin",
      price: 90,
      currency: "EUR",
      rating: 4.0,
      imageUrl: "https://via.placeholder.com/300x200?text=City+Center+Hotel",
      bookingLink: "https://booking.com/berlin-city",
      totalPrice: 270, // Example total price
    },
    suggestedFlights: [ // Mock Flights
      {
        id: "flight-berlin-1",
        airline: "Lufthansa",
        departureTime: "2025-11-05T08:00:00Z",
        arrivalTime: "2025-11-05T09:30:00Z",
        duration: "1h 30m",
        stops: 0,
        price: 100,
        currency: "EUR",
        bookingLink: "https://kiwi.com/flight-berlin-1",
      },
    ],
  },
  {
    id: 3,
    title: "Finance Summit & Mountain Retreat in Zurich",
    description: "Participate in the Global Finance Leaders Summit (Dec 1-3, 2025) followed by a refreshing mountain getaway.",
    imageUrl: "https://via.placeholder.com/800x400?text=Zurich+Finance+Trip+Hero",
    eventId: 103,
    destination: "Zurich, Switzerland",
    dates: "Dec 1-5, 2025",
    accommodationSuggestion: "Luxury chalet with a view",
     eventDetails: { // Mock Event Details
      id: 103,
      name: "Global Finance Leaders Summit",
      description: "Annual summit for finance professionals.",
      industry: "Finance",
      country: "Switzerland",
      city: "Zurich",
      region: null,
      zipCode: "8001",
      street: "Bahnhofstrasse",
      streetNumber: "10",
      location: "Zurich, Switzerland",
      latitude: 47.3769,
      longitude: 8.5417,
      startDate: "2025-12-01T09:00:00Z",
      endDate: "2025-12-03T18:00:00Z",
      websiteUrl: "https://example.com/financesummit",
      ticketPrice: 1200,
      imagePath: "https://via.placeholder.com/400x200?text=Finance+Summit+Event",
      createdAt: new Date().toISOString(),
      categories: [{ id: 1, name: "Conference" }],
      tags: [{ id: 5, name: "Investment" }, { id: 6, name: "Banking" }],
    },
    suggestedAccommodation: { // Mock Accommodation
      id: "hotel-zurich-1",
      name: "Mountain View Chalet",
      price: 250,
      currency: "CHF",
      rating: 4.8,
      imageUrl: "https://via.placeholder.com/300x200?text=Mountain+Chalet",
      bookingLink: "https://booking.com/zurich-chalet",
      totalPrice: 1000, // Example total price
    },
    suggestedFlights: [ // Mock Flights
      {
        id: "flight-zurich-1",
        airline: "Swiss International Air Lines",
        departureTime: "2025-12-01T07:30:00Z",
        arrivalTime: "2025-12-01T09:00:00Z",
        duration: "1h 30m",
        stops: 0,
        price: 180,
        currency: "CHF",
        bookingLink: "https://kiwi.com/flight-zurich-1",
      },
    ],
  },
   {
    id: 4,
    title: "Healthcare Expo & Coastal Escape in Barcelona",
    description: "Visit the International Healthcare Exhibition (Jan 20-22, 2026) and unwind on the beautiful Barcelona coast.",
    imageUrl: "https://via.placeholder.com/800x400?text=Barcelona+Healthcare+Trip+Hero",
    eventId: 104,
    destination: "Barcelona, Spain",
    dates: "Jan 20-25, 2026",
    accommodationSuggestion: "Beachfront hotel",
     eventDetails: { // Mock Event Details
      id: 104,
      name: "International Healthcare Exhibition",
      description: "Leading exhibition for the healthcare industry.",
      industry: "Healthcare",
      country: "Spain",
      city: "Barcelona",
      region: null,
      zipCode: "08001",
      street: "Carrer de la Marina",
      streetNumber: "16",
      location: "Barcelona, Spain",
      latitude: 41.3851,
      longitude: 2.1734,
      startDate: "2026-01-20T09:00:00Z",
      endDate: "2026-01-22T18:00:00Z",
      websiteUrl: "https://example.com/healthcareexpo",
      ticketPrice: 600,
      imagePath: "https://via.placeholder.com/400x200?text=Healthcare+Expo+Event",
      createdAt: new Date().toISOString(),
      categories: [{ id: 3, name: "Exhibition" }],
      tags: [{ id: 7, name: "Medical" }, { id: 8, name: "Pharma" }],
    },
    suggestedAccommodation: { // Mock Accommodation
      id: "hotel-barcelona-1",
      name: "Barcelona Beach Resort",
      price: 180,
      currency: "EUR",
      rating: 4.3,
      imageUrl: "https://via.placeholder.com/300x200?text=Beach+Resort",
      bookingLink: "https://booking.com/barcelona-beach",
      totalPrice: 900, // Example total price
    },
    suggestedFlights: [ // Mock Flights
      {
        id: "flight-barcelona-1",
        airline: "Vueling",
        departureTime: "2026-01-20T06:00:00Z",
        arrivalTime: "2026-01-20T08:00:00Z",
        duration: "2h 0m",
        stops: 0,
        price: 80,
        currency: "EUR",
        bookingLink: "https://kiwi.com/flight-barcelona-1",
      },
    ],
  }
];

// GET /api/recommended-trips
router.get('/', (req: Request, res: Response) => {
  try {
    // Return simplified data for the list view
    const simplifiedTrips = mockRecommendedTrips.map(trip => ({
      id: trip.id,
      title: trip.title,
      description: trip.description,
      imageUrl: trip.imageUrl, // Use the hero image for the card
      eventId: trip.eventId,
      destination: trip.destination,
      dates: trip.dates,
      accommodationSuggestion: trip.accommodationSuggestion,
      // Exclude detailed nested objects for the list view
    }));
    // TODO: Implement filtering and sorting based on query parameters (req.query)
    res.json(simplifiedTrips);
  } catch (error) {
    console.error('Error fetching recommended trips:', error);
    res.status(500).json({ error: 'Failed to fetch recommended trips' });
  }
});

// GET /api/recommended-trips/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // Find the full detailed trip object
  const trip = mockRecommendedTrips.find(t => t.id === parseInt(id, 10));

  if (trip) {
    res.json(trip); // Return the full detailed object
  } else {
    res.status(404).json({ error: 'Recommended trip not found' });
  }
});


export default router;
