# systemPatterns.md

## 🧠 How the System is Built
A lightweight web platform using modern JAMstack principles:
- Static frontend served via CDN (Next.js + TailwindCSS)
- Dynamic content loaded via REST API (Node.js + Express + TypeScript)
- Prisma ORM for type-safe database access
- External booking flows via affiliate APIs (Booking.com, WayAway)

## 🧱 Key Technical Decisions
- Use affiliate links for booking = no regulatory overhead
- No authentication = lower complexity and faster development
- CSV-based event import = flexible data management
- Automatic development data = consistent testing environment
- Real-time API fetches for hotels/flights = always fresh data
- Click tracking for affiliate analytics
- Multi-stage Docker builds = optimized production images
- Prisma for type-safe database access = reduced runtime errors
- Environment-based configuration = flexible deployment options
- Next.js API routes for development = simplified local setup

## 🧰 Architecture Patterns

### 🔄 User Flow Architecture
```mermaid
graph TD
    A[Event Search] --> B[Event Selection]
    B --> C[Hotel Search]
    C --> D[Flight Search]
    D --> E[Booking Links]
    
    subgraph Event Flow
        A --> |Filter by| F[Industry]
        A --> |Filter by| G[Region]
        A --> |Filter by| H[Dates]
    end
    
    subgraph Location Lock
        B --> |Lock Location| C
        B --> |Lock Dates| D
    end
    
    subgraph Affiliate Flow
        E --> I[Booking.com]
        E --> J[WayAway]
        E --> K[Event Website]
    end
```

### 🎯 Data Flow Architecture
```mermaid
graph TD
    A[Frontend] --> B[API Layer]
    B --> C[Database]
    B --> D[Strapi CMS]
    B --> E[External APIs]
    
    subgraph External Services
        E --> F[Booking.com API]
        E --> G[WayAway API]
        E --> H[Analytics]
    end
    
    subgraph Data Storage
        C --> I[Events]
        C --> J[Analytics]
        C --> K[User Flow]
    end
```

### API Layer Design
- **Development Environment:**
  - Next.js API routes proxy requests to backend
  - Container-to-container communication
  - Hot reloading support
  - Local debugging capabilities

- **Production Environment:**
  - Direct API calls to backend URL
  - Environment variables from Vercel/Render
  - Optimized for performance
  - No proxy overhead

### 🏗 Core Patterns
- **Modular monolith**: Single repo, structured folders by domain (api, ui, db)
- **Component-based UI**: Reusable components (HeroBanner, SelectField, DestinationSelect)
- **RESTful API design**: Simple JSON contracts (/api/events)
- **Static + dynamic hybrid**: Pre-rendered pages + API-interpolated content
- **Incremental adoption**: Easy to replace/scale any part later

### 🐳 Docker Architecture
- **Docker-first development**: 
  - Consistent environments across team
  - Volume mounts for hot reloading
  - Environment-specific configurations
  - Container networking for local development

### 📊 Data Layer

#### Event Data Model
```mermaid
classDiagram
    class Event {
        +String id
        +String title
        +String description
        +String industry
        +String region
        +String city
        +Float latitude
        +Float longitude
        +Date startDate
        +Date endDate
        +Float ticketPrice
        +String websiteUrl
        +String imageUrl
    }
    
    class Analytics {
        +String id
        +String eventId
        +String action
        +Date timestamp
        +String userFlow
    }
    
    Event --> Analytics
```

#### Integration Models
```mermaid
classDiagram
    class HotelSearch {
        +String city
        +Date checkIn
        +Date checkOut
        +Int guests
        +searchHotels()
    }
    
    class FlightSearch {
        +String origin
        +String destination
        +Date departDate
        +Date returnDate
        +searchFlights()
    }
    
    class AffiliateTracking {
        +String provider
        +String clickId
        +String eventId
        +trackClick()
    }
```
- **Type-safe data layer**: Prisma schema as single source of truth
- **Environment Configuration**:
  - Service-specific .env files
  - Public vs private variables separation
  - Docker-compatible env management
- **Development Data Management**:
  - Auto-import on startup in dev mode
  - External ID tracking for deduplication
  - Structured image path mapping
  - Environment-aware data loading

### 🔌 API Service Pattern
- **Centralized API Service**:
  - Single source of truth for API calls
  - Environment-aware base URL configuration
  - Unified error handling
  - Type-safe interfaces
  - Prevents duplicate requests
  - Consistent request/response patterns

### 📱 User Interface Patterns
- **Progressive Disclosure**:
  - Show basic event info first
  - Expand details on interaction
  - Step-by-step booking flow
- **State Management**:
  - Location locking
  - Search parameters
  - User flow tracking
- **Error Handling**:
  - Graceful degradation
  - Informative messages
  - Retry mechanisms
- **Loading States**:
  - Skeleton screens
  - Progress indicators
  - Optimistic updates

### 🔍 Search Patterns
- **Event Search**:
  - Industry filtering
  - Location-based results
  - Date range filtering
- **Hotel Search**:
  - Location-locked search
  - Price range filtering
  - Amenity filtering
- **Flight Search**:
  - Origin airport selection
  - Date flexibility
  - Price tracking

## 🛡️ Principles Followed
- Keep it simple (KISS)
  - Clear separation of development/production environments
  - Intuitive API service design
  - Minimal configuration needed
- Build only what's needed (YAGNI)
  - Environment-specific optimizations
  - No unnecessary abstractions
- DRY (Don't Repeat Yourself)
  - Centralized API logic
  - Reusable components
  - Shared type definitions
- Secure by default
  - Don't store unnecessary data
  - Environment-based security
- Fail gracefully
  - Timeout-safe APIs
  - Loading states
  - Error boundaries
- Scale with confidence
  - No single point of failure
  - Environment-specific optimizations
- Type safety over convenience
  - TypeScript + Prisma
  - Strict type checking
