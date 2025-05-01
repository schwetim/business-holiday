// Represents accommodation data (e.g., from Booking.com API or mock)
// Duplicated from frontend/src/types for backend use to maintain separation.
// Consider creating a shared types package later if needed.
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

// Add other backend-specific types here if necessary
