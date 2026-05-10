import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Calendar, MapPin, Search, Share2, Trash2, Globe, Loader2, Edit3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await api.get('/trips');
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublic = async (tripId: string, currentState: boolean) => {
    try {
      await api.put(`/trips/${tripId}`, { is_public: !currentState });
      setTrips(trips.map(t => t.id === tripId ? { ...t, is_public: !currentState } : t));
    } catch (err) {
      alert('Failed to update privacy settings');
    }
  };

  const deleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this entire trip? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  const filteredTrips = trips.filter(trip => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = trip.name.toLowerCase().includes(searchLower);
    const cityMatch = trip.stops?.some((s: any) => s.city_name.toLowerCase().includes(searchLower));
    const activityMatch = trip.stops?.some((s: any) => 
      s.activities?.some((a: any) => a.name.toLowerCase().includes(searchLower))
    );
    
    if (activeFilter === 'public') return trip.is_public && (nameMatch || cityMatch || activityMatch);
    if (activeFilter === 'private') return !trip.is_public && (nameMatch || cityMatch || activityMatch);
    return nameMatch || cityMatch || activityMatch;
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Fetching your journeys...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Trips</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal adventures and community shares.</p>
        </div>
        <Link to="/create-trip">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6 py-6 rounded-2xl">
            <Plus className="w-5 h-5 mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full lg:w-auto">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'all' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('public')}
            className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'public' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Shared
          </button>
          <button 
            onClick={() => setActiveFilter('private')}
            className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'private' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Private
          </button>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search trip, city, or activity..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[18px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 dark:text-white shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTrips.map((trip, idx) => (
            <motion.div
              key={trip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="group overflow-hidden flex flex-col h-full rounded-[32px] border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="relative h-56">
                  <img 
                    src={trip.cover_image_url || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop`} 
                    alt={trip.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {trip.is_public ? (
                      <span className="flex items-center gap-1.5 bg-green-500/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                        <Globe className="w-3 h-3" /> Shared
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-white/10">
                        Private
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteTrip(trip.id)}
                      className="p-2.5 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{trip.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900">
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                      {trip.stops?.length > 0 ? (
                        trip.stops.slice(0, 3).map((stop: any) => (
                          <span key={stop.id} className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                            <MapPin className="w-3 h-3 text-blue-500" /> {stop.city_name}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No cities added yet</p>
                      )}
                      {trip.stops?.length > 3 && <span className="text-xs text-slate-400 flex items-center">+{trip.stops.length - 3} more</span>}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
                       <span>Budget: <strong className="text-slate-900 dark:text-white">${trip.total_budget || 0}</strong></span>
                       <span>Members: <strong className="text-slate-900 dark:text-white">{trip.member_limit || 1}</strong></span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-[18px] text-sm py-5 border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => navigate(`/builder?trip_id=${trip.id}`)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Build
                    </Button>
                    <Button 
                      className={`rounded-[18px] text-sm py-5 shadow-lg transition-all ${trip.is_public ? 'bg-slate-900 hover:bg-black text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
                      onClick={() => togglePublic(trip.id, trip.is_public)}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> {trip.is_public ? 'Make Private' : 'Share'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTrips.length === 0 && !isLoading && (
          <div className="col-span-full py-32 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-800">
            <Search className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-400">No trips found matching your search</h3>
            <p className="text-slate-500 mt-2">Try searching for a different city or activity!</p>
          </div>
        )}
      </div>
    </div>
  );
}
