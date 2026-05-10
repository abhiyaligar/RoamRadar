import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Calendar, Clock, Plus, Trash2, MapPin, CreditCard, Loader2, ArrowLeft, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ItineraryMap } from '../components/map/ItineraryMap';
import { CitySearch } from '../components/map/CitySearch';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function ItineraryBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tripId = searchParams.get('trip_id');

  const [trip, setTrip] = useState<any>(null);
  const [stops, setStops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'Sightseeing',
    cost_amount: 0
  });

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    total_budget: 0,
    member_limit: 1,
    is_public: false
  });

  useEffect(() => {
    if (!tripId) {
      navigate('/dashboard');
      return;
    }

    const fetchTripData = async () => {
      try {
        const data = await api.get(`/trips/${tripId}`);
        setTrip(data);
        setStops(data.stops || []);
        setSettingsData({
          total_budget: data.total_budget || 0,
          member_limit: data.member_limit || 1,
          is_public: data.is_public || false
        });
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, navigate]);

  const updateSettings = async () => {
    setIsSaving(true);
    try {
      const updatedTrip = await api.put(`/trips/${tripId}`, settingsData);
      setTrip(updatedTrip);
      setIsSettingsOpen(false);
    } catch (err) {
      alert('Failed to update trip settings');
    } finally {
      setIsSaving(false);
    }
  };

  const copyPublicLink = () => {
    if (!trip?.public_link_id) return;
    const link = `${window.location.origin}/share/${trip.public_link_id}`;
    navigator.clipboard.writeText(link);
    alert('Public link copied to clipboard!');
  };

  const addCity = async (city: any) => {
    if (!tripId) return;
    
    setIsSaving(true);
    try {
      const newStop = await api.post(`/trips/${tripId}/stops`, {
        city_name: city.name,
        country: city.country,
        latitude: city.coordinates[1],
        longitude: city.coordinates[0],
        arrival_date: trip.start_date,
        departure_date: trip.end_date,
        order_index: stops.length
      });
      
      setStops([...stops, newStop]);
    } catch (err) {
      alert('Failed to add city to database');
    } finally {
      setIsSaving(false);
    }
  };

  const removeStop = async (stopId: string) => {
    if (!confirm('Are you sure you want to remove this city and all its activities?')) return;
    setIsSaving(true);
    try {
      await api.delete(`/trips/${tripId}/stops/${stopId}`);
      setStops(stops.filter(s => s.id !== stopId));
    } catch (err) {
      alert('Failed to delete stop');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStopId) return;

    setIsSaving(true);
    try {
      const activity = await api.post(`/stops/${activeStopId}/activities`, {
        ...newActivity,
        scheduled_time: null
      });
      
      setStops(stops.map(s => 
        s.id === activeStopId 
          ? { ...s, activities: [...(s.activities || []), activity] } 
          : s
      ));
      setIsModalOpen(false);
      setNewActivity({ name: '', category: 'Sightseeing', cost_amount: 0 });
    } catch (err) {
      alert('Failed to add activity');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteActivity = async (stopId: string, activityId: string) => {
    setIsSaving(true);
    try {
      await api.delete(`/stops/${stopId}/activities/${activityId}`);
      setStops(stops.map(s => 
        s.id === stopId 
          ? { ...s, activities: s.activities.filter((a: any) => a.id !== activityId) } 
          : s
      ));
    } catch (err) {
      alert('Failed to delete activity');
    } finally {
      setIsSaving(false);
    }
  };

  const moveStop = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stops.length - 1)) return;
    const newStops = [...stops];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStops[index], newStops[swapIndex]] = [newStops[swapIndex], newStops[index]];
    setStops(newStops.map((s, i) => ({ ...s, order_index: i })));
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Loading your adventure...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Panel: Builder List */}
      <div className="w-full lg:w-1/2 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{trip?.name}</h1>
              <p className="text-sm text-slate-500">Itinerary Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
              Share & Settings
            </Button>
            {isSaving && (
              <div className="flex items-center gap-2 text-xs text-blue-500 font-medium bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            )}
          </div>
        </div>

        {/* New City Search Component */}
        <div className="z-50">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add a new destination</label>
          <CitySearch onSelect={addCity} placeholder="Search for a city to add..." />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[60vh] lg:max-h-none">
          {stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-0 overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-colors shadow-sm">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center gap-1 mr-3">
                    <button onClick={() => moveStop(index, 'up')} className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-500'}`}>▲</button>
                    <button onClick={() => moveStop(index, 'down')} className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${index === stops.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-500'}`}>▼</button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {stop.city_name}, {stop.country}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeStop(stop.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(stop.arrival_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Activities</div>
                    {stop.activities?.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg group/activity">
                        <div className="flex-1">
                          <p className="text-slate-900 dark:text-white font-medium text-sm">{activity.name}</p>
                          <div className="flex gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold text-blue-500/80">{activity.category}</span>
                            <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> ₹{activity.cost_amount}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteActivity(stop.id, activity.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md opacity-0 group-hover/activity:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setActiveStopId(stop.id); setIsModalOpen(true); }}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full lg:w-1/2 sticky top-24 h-[500px] lg:h-[calc(100vh-8rem)]">
        <ItineraryMap stops={stops} />
      </div>

      {/* Activity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Activity">
        <form onSubmit={handleAddActivity} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Activity Name</label>
            <input 
              type="text" 
              required
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              placeholder="e.g. Visit Eiffel Tower"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select 
                value={newActivity.category}
                onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food">Food</option>
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Transit">Transit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cost (₹)</label>
              <input 
                type="number" 
                value={newActivity.cost_amount}
                onChange={(e) => setNewActivity({ ...newActivity, cost_amount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">Add to Plan</Button>
          </div>
        </form>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Trip Settings & Sharing">
        <div className="space-y-8">
          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Public Sharing</h4>
              <p className="text-xs text-slate-500">Allow anyone with the link to view this trip</p>
            </div>
            <button 
              onClick={() => setSettingsData({ ...settingsData, is_public: !settingsData.is_public })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settingsData.is_public ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsData.is_public ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Public Link Display */}
          {settingsData.is_public && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shareable Link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={trip?.public_link_id ? `${window.location.origin}/share/${trip.public_link_id}` : 'Generating...'} 
                  className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 outline-none"
                />
                <Button size="sm" onClick={copyPublicLink}>Copy</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trip Budget (₹)</label>
              <input 
                type="number" 
                value={settingsData.total_budget}
                onChange={(e) => setSettingsData({ ...settingsData, total_budget: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Member Limit</label>
              <input 
                type="number" 
                min="1"
                value={settingsData.member_limit}
                onChange={(e) => setSettingsData({ ...settingsData, member_limit: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" className="flex-1" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={updateSettings}>Save Settings</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
