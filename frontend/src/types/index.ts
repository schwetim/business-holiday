export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

// Corresponds to the Event model in Prisma, assuming the API returns all fields
export interface Event {
  id: number;
  externalId?: string | null; // Assuming it might be null
  name: string;
  description?: string | null;
  industry: string;

  // Address fields
  country: string;
  city: string;
  region?: string | null;
  zipCode: string;
  street: string;
  streetNumber: string;

  // Location display and coordinates
  location: string; // e.g. "Munich, Germany"
  latitude?: number | null;
  longitude?: number | null;

  // Event details
  startDate: string; // Keep as string, as it comes from JSON
  endDate: string;   // Keep as string
  websiteUrl?: string | null;
  ticketPrice?: number | string | null; // Prisma Decimal can be string or number in JS/TS
  imagePath?: string | null;

  // Metadata
  createdAt: string;

  // Potential future inclusion of counts (adjust if API adds these)
  // clickLogsCount?: number;
  // bookingsCount?: number;

  // Relations (if API includes them, unlikely for list view)
  categories?: Category[];
  tags?: Tag[];
}

// Define related types if needed later
// export interface ClickLog { ... }
// export interface Booking { ... }

// Represents accommodation data (e.g., from Booking.com API or mock)
export interface Accommodation {
  id: string | number; // Could be string or number depending on API
  name: string;
  price: number | string; // Price might be formatted string or number
  currency?: string; // e.g., 'EUR', 'USD'
  rating?: number | null; // e.g., 4.5
  imageUrl?: string | null;
  bookingLink: string; // Affiliate link
  // Add other relevant fields as needed: address, amenities, etc.
  totalPrice?: number | string;
}

// Represents flight data (e.g., from WayAway API or mock)
export interface Flight {
  id: string | number; // Could be string or number depending on API
  airline: string;
  departureTime: string; // ISO string or similar
  arrivalTime: string;   // ISO string or similar
  duration: string;      // e.g., "2h 30m"
  stops: number;
  price: number | string; // Price might be formatted string or number
  currency?: string; // e.g., 'EUR', 'USD'
  bookingLink: string; // Affiliate link (mock URL for now)
  // Add other relevant fields as needed: origin, destination, etc.
}

// Represents a Recommended Trip
export interface RecommendedTrip {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  eventId: number; // Link to a potential event ID
  destination: string;
  dates: string;
  accommodationSuggestion: string;
}
