import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { PackingChecklistPage } from './pages/PackingChecklistPage';
import { TripNotesPage } from './pages/TripNotesPage';
import { CommunityPage } from './pages/CommunityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<CitySearchPage />} />
          <Route path="/destination/:id" element={<DestinationDetailsPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/builder" element={<ItineraryBuilderPage />} />
          <Route path="/itinerary/:id" element={<ItineraryViewPage />} />
          <Route path="/share/:public_link_id" element={<ItineraryViewPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checklist" element={<PackingChecklistPage />} />
          <Route path="/notes" element={<TripNotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
