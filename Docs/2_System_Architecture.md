# System Architecture - RoamRadar

## 1. High-Level Architecture Overview
RoamRadar follows a modern decoupled architecture. The frontend is a Single Page Application (SPA) communicating with a robust backend API. The data layer is powered by a relational database, with external services handling map rendering and media storage.

### Client-Server Flow
1. **Client:** Web browser (React app).
2. **Backend API:** Serves RESTful requests (FastAPI).
3. **Database:** Stores structured application data (PostgreSQL).
4. **Blob Storage:** Hosts user-uploaded images/avatars (Supabase S3).
5. **Third-Party APIs:** Renders maps and geolocation data (MapBox).

## 2. Technology Stack

### 2.1. Frontend
- **Framework:** React (Vite/Next.js recommended)
- **Styling:** Tailwind CSS for rapid, scalable UI development.
- **Routing:** React Router DOM.
- **State Management:** Zustand or React Context API (ideal for complex itinerary states without Redux boilerplate).
- **Maps:** MapBox GL JS (`react-map-gl`) for dynamic, customizable travel routes and city markers.

### 2.2. Backend
- **Framework:** FastAPI (Python) - chosen for high performance, async capabilities, and auto-generated API docs (Swagger).
- **Authentication:** FastAPI Users or custom JWT implementation using `python-jose` and `passlib`. Note: Must use `bcrypt<4.0` due to compatibility issues with passlib.
- **ORM:** SQLAlchemy (Async).
- **Database Migrations:** Alembic (using `postgresql+asyncpg` for app runtime, but parsed as `postgresql` sync driver in `env.py`).
- **Cloud Storage SDK:** Boto3 for interacting with Supabase S3 buckets.

### 2.3. Database
- **Primary Database:** PostgreSQL (Hosted on Render).
- **Justification:** Complex relational data (Users -> Trips -> Stops -> Activities) requires strong ACID compliance and structured schemas.

### 2.4. Infrastructure & Deployment
- **Frontend Hosting:** Vercel or Netlify.
- **Backend Hosting:** Render (Web Service).
- **Database Hosting:** Render (Managed PostgreSQL).
- **Object Storage:** Supabase Storage (S3-compatible API).

## 3. MapBox Integration Strategy
MapBox is selected over Google Maps for:
1. **Design:** Highly customizable map styles that fit the "premium" feel of RoamRadar.
2. **Features:** Easy integration of lines (routes between cities), markers (stops), and popups (activities).
3. **Cost:** Generous free tier for startups/hackathons.

**Implementation:**
- Use MapBox Geocoding API for the "City Search" feature.
- Use MapBox GL JS on the "Itinerary View Screen" to plot the multi-city trip visually.

## 4. Scalable Social Strategy
To satisfy the requirement of keeping the social sharing feature scalable (while avoiding chat/notifications initially):
- Implement a robust permissions table (`trip_shares` or `trip_permissions`) that maps User IDs to Trip IDs with access levels (`viewer`, `editor`).
- This allows the future addition of collaborative editing.
- Generate unique UUIDs or short links for "Public" read-only sharing.
