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
  createdAt: string; // Keep as string

  // Potential future inclusion of counts (adjust if API adds these)
  // clickLogsCount?: number;
  // bookingsCount?: number;

  // Relations (if API includes them, unlikely for list view)
  // clickLogs?: ClickLog[]; 
  // bookings?: Booking[]; 
}

// Define related types if needed later
// export interface ClickLog { ... }
// export interface Booking { ... }
