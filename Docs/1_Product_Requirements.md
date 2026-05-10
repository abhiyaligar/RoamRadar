# Product Requirements Document (PRD) - Traveloop

## 1. Overview
### Vision
To become a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. Traveloop empowers users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool combining flexibility and interactivity.

### Mission
Build a user-centric, responsive application that simplifies the complexity of planning multi-city travel. Provide travelers with intuitive tools to:
- Add and manage travel stops and durations
- Explore cities and activities of interest
- Estimate trip budgets automatically
- Visualize timelines and plans
- Share trip plans with others

## 2. Core Functionalities
Users can:
1. Create customized multi-city itineraries.
2. Assign travel dates, activities, and budgets.
3. Discover activities and destinations through search.
4. Receive cost breakdowns and visual calendars.
5. Share their plans publicly or with friends.

## 3. Screens and User Flows

### 1. Login / Signup Screen
- **Description:** Entry point of the app allowing users to create or access their account.
- **Key Functionality:** Email & password fields, Login button, Signup link, "Forgot Password", basic validation.

### 2. Dashboard / Home Screen
- **Description:** Central hub showing upcoming trips, popular cities, and quick actions.
- **Key Functionality:** Welcome message, list of recent trips, "Plan New Trip" button, recommended destinations, budget highlights.

### 3. Create Trip Screen
- **Description:** Form to initiate a new trip.
- **Key Functionality:** Trip name, start & end dates, trip description, cover photo upload (optional), save button.

### 4. My Trips (Trip List) Screen
- **Description:** List view of all trips created by the user with basic summary data.
- **Key Functionality:** Trip cards showing name, date range, destination count, edit/view/delete actions.

### 5. Itinerary Builder Screen
- **Description:** Interface to add cities, dates, and activities for each stop.
- **Key Functionality:** "Add Stop" button, select city and travel dates, assign activities to each stop, reorder cities.

### 6. Itinerary View Screen
- **Description:** Visual representation of the completed trip itinerary.
- **Key Functionality:** Day-wise layout, city headers, activity blocks with time and cost, view mode toggle (calendar/list).

### 7. City Search
- **Description:** Search interface to find and add cities to a trip.
- **Key Functionality:** Search bar, list of cities with meta info (country, cost index, popularity), "Add to Trip" button, filter by country/region.

### 8. Activity Search
- **Description:** Browse and select things to do in each stop.
- **Key Functionality:** Activity filters (type, cost, duration), add/remove buttons, quick view of description and images.

### 9. Trip Budget & Cost Breakdown Screen
- **Description:** Summarized financial view showing estimated total cost and breakdowns.
- **Key Functionality:** Cost breakdown by transport, stay, activities, meals; pie/bar charts, average cost per day, alerts for over budget days.

### 10. Packing Checklist Screen
- **Description:** A per-trip checklist where users can add, check off, and manage packing items.
- **Key Functionality:** Add/remove items, mark as packed, categorize by type (clothing, documents, electronics), reset checklist for re-use.

### 11. Shared/Public Itinerary View Screen (Scalable Social Feature)
- **Description:** Public page displaying a sharable version of an itinerary. Built with future scale in mind.
- **Key Functionality:** Public URL generation, itinerary summary, "Copy Trip" button, social media sharing, read-only view.

### 12. User Profile / Settings Screen
- **Description:** User settings page to update profile information and preferences.
- **Key Functionality:** Editable fields (name, photo, email), language preference, delete account, saved destinations list.

### 13. Trip Notes / Journal Screen
- **Description:** A simple text note-taking screen where users can write and save notes.
- **Key Functionality:** Add/edit/delete notes per trip or per stop, timestamp display, notes list view sorted by date.

### 14. Admin / Analytics Dashboard (Optional)
- **Description:** Admin-only interface to track user trends, trip data, and platform usage.
- **Key Functionality:** Tables and charts of trips created, top cities/activities, user engagement stats, user management tools.
