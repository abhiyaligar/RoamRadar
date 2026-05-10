# API Documentation - RoamRadar

This document outlines the REST API endpoints built with **FastAPI**.
Base URL: `/api/v1`

## 1. Authentication Endpoints

### `POST /auth/register`
- **Description:** Register a new user.
- **Request Body:** `{ "email": "user@example.com", "password": "...", "full_name": "John Doe" }`
- **Response:** `201 Created` with User object.

### `POST /auth/token`
- **Description:** Login and receive a JWT access token.
- **Request Body:** OAuth2PasswordRequestForm. Must explicitly include `username`, `password`, and `grant_type="password"`.
- **Response:** `{ "access_token": "jwt...", "token_type": "bearer" }`

### `GET /users/me`
- **Description:** Get current logged-in user details.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` User object.

## 2. Trip Endpoints

### `GET /trips`
- **Description:** Get all trips for the authenticated user.
- **Response:** `200 OK` Array of Trip objects.

### `POST /trips`
- **Description:** Create a new trip.
- **Request Body:** `{ "name": "...", "description": "...", "start_date": "...", "end_date": "...", "cover_image_url": "...", "is_public": false }`
- **Response:** `201 Created` Trip object.

### `GET /trips/{trip_id}`
- **Description:** Get specific trip details (includes related stops and budget summary).
- **Response:** `200 OK` Trip object with nested Stops and Activities.

### `PUT /trips/{trip_id}`
- **Description:** Update trip metadata (name, dates).
- **Response:** `200 OK` Updated Trip.

### `DELETE /trips/{trip_id}`
- **Description:** Delete a trip and cascade delete stops/activities.
- **Response:** `204 No Content`

## 3. Stop & Itinerary Endpoints

### `POST /trips/{trip_id}/stops`
- **Description:** Add a new city/stop to a trip.
- **Request Body:** `{ "city_name": "Paris", "country": "France", "latitude": 48.85, "longitude": 2.35, "arrival_date": "...", "departure_date": "...", "order_index": 1 }`
- **Response:** `201 Created` Stop object.

### `PUT /trips/{trip_id}/stops/{stop_id}`
- **Description:** Update stop details (e.g., change dates, reorder).

### `DELETE /trips/{trip_id}/stops/{stop_id}`
- **Description:** Remove a stop from the trip.

## 4. Activity Endpoints

### `POST /stops/{stop_id}/activities`
- **Description:** Add an activity to a stop.
- **Request Body:** `{ "name": "Louvre Museum", "category": "Sightseeing", "cost_amount": 20.00, "scheduled_time": "2026-06-15T10:00:00Z" }`
- **Response:** `201 Created` Activity object.

### `PUT /stops/{stop_id}/activities/{activity_id}`
- **Description:** Update activity details.

### `DELETE /stops/{stop_id}/activities/{activity_id}`
- **Description:** Remove an activity from a stop.

## 5. Social & Sharing Endpoints (Scalable)

### `POST /trips/{trip_id}/share/public`
- **Description:** Toggle public sharing for a trip.
- **Request Body:** `{ "is_public": true }`
- **Response:** `200 OK` `{ "public_link_id": "aB3dE9" }`

### `GET /shared/{public_link_id}`
- **Description:** Fetch a read-only version of a trip (No Auth required).
- **Response:** `200 OK` Redacted Trip object (no private notes).

### `POST /trips/{trip_id}/share/user`
- **Description:** Share a trip directly with another registered user or via email invite.
- **Request Body:** `{ "email": "friend@example.com", "permission_level": "viewer" }`
- **Response:** `201 Created` TripShare object.

## 6. S3 Media Endpoints

### `POST /upload/image`
- **Description:** Upload an image directly to Supabase S3.
- **Headers:** `Content-Type: multipart/form-data`
- **Response:** `200 OK` `{ "image_url": "https://supabase..." }`
