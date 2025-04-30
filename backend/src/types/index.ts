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
}

// Add other backend-specific types here if necessary
