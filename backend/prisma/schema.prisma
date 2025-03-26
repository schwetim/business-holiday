generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Event {
  id            Int       @id @default(autoincrement())
  externalId    String?   @unique @map("external_id")
  name          String
  description   String?
  industry      String
  
  // Address fields
  country       String
  city          String
  region String? @map("region")
  zipCode       String    @map("zip_code")
  street        String
  streetNumber  String    @map("street_number")
  
  // Location display and coordinates
  location      String    // e.g. "Munich, Germany"
  latitude      Float?
  longitude     Float?
  
  // Event details
  startDate     DateTime  @map("start_date")
  endDate       DateTime  @map("end_date")
  websiteUrl    String?   @map("website_url")
  ticketPrice   Decimal?  @map("ticket_price") @db.Decimal(10,2)
  imagePath     String?   @map("image_path")
  
  // Metadata
  createdAt     DateTime  @default(now()) @map("created_at")
  // Relations
  clickLogs     ClickLog[]
  bookings      Booking[]

  @@map("events")
}

model ClickLog {
  id          Int      @id @default(autoincrement())
  eventId     Int      @map("event_id")
  clickType   String   @map("click_type")
  redirectUrl String   @map("redirect_url")
  createdAt   DateTime @default(now()) @map("created_at")
  event       Event    @relation(fields: [eventId], references: [id])

  @@map("click_logs")
}

model Booking {
  id            Int      @id @default(autoincrement())
  eventId       Int      @map("event_id")
  hotelName     String?  @map("hotel_name")
  flightSummary String?  @map("flight_summary")
  totalEstimate Decimal? @map("total_estimate") @db.Decimal(10,2)
  createdAt     DateTime @default(now()) @map("created_at")
  event         Event    @relation(fields: [eventId], references: [id])

  @@map("bookings")
}
