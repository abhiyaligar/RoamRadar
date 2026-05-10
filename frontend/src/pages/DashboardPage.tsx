import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, CheckCircle2, Circle, MoreHorizontal, PlaneTakeoff, Hotel, Utensils, Loader2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function DashboardPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchTrips();
  }, []);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Travel Planner</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your itineraries and upcoming adventures.</p>
        </div>
        <Link to="/create-trip">
          <Button className="shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-500">
            <Plus className="w-5 h-5 mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Real Trips */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Journeys</h2>
              <span className="text-sm font-medium text-slate-400">{trips.length} Total Trips</span>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-500">Fetching your adventures...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      hoverEffect 
                      className="p-4 sm:p-5 flex flex-col sm:flex-row gap-6 cursor-pointer group"
                      onClick={() => navigate(`/builder?trip_id=${trip.id}`)}
                    >
                      <div className="relative w-full sm:w-44 h-44 sm:h-auto overflow-hidden rounded-2xl shrink-0 bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop`} 
                          alt={trip.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                {new Date(trip.start_date) > new Date() ? 'Upcoming' : 'Past'}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                              {trip.name}
                            </h3>
                            <div className="flex items-center gap-4 text-slate-500 text-sm mt-2">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(trip.start_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                <span>{trip.stops?.length || 0} Stops</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-blue-500 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="mt-6">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 font-medium italic">"{trip.description || 'No description added'}"</span>
                            <span className="text-slate-900 dark:text-white font-bold">₹{trip.total_budget || 0} Estimated</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((trip.stops?.length || 0) * 20, 100)}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlaneTakeoff className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No trips found</h3>
                <p className="text-slate-500 text-sm mb-6 px-6">You haven't planned any adventures yet. Start your first journey today!</p>
                <Link to="/create-trip">
                  <Button variant="primary">Create My First Trip</Button>
                </Link>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Updates</h2>
            <Card className="p-6">
              <div className="space-y-6">
                {[
                  { icon: PlaneTakeoff, title: 'Database connection established', time: 'Just now', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Hotel, title: 'Mapbox integration active', time: '10 mins ago', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { icon: Utensils, title: 'Itinerary builder online', time: '1 hour ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className={`mt-0.5 shrink-0 ${activity.bg} ${activity.color} p-2 rounded-full h-9 w-9 flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Toolkit */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Pre-trip Toolkit</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {[
                  { text: 'Set trip destination', done: true },
                  { text: 'Select travel dates', done: true },
                  { text: 'Add cities to itinerary', done: trips.length > 0 },
                  { text: 'Configure budget', done: false },
                  { text: 'Share public link', done: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${item.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Live Budget Status</h2>
            <Card className="p-6 border-t-4 border-blue-500">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-1 font-medium">Estimated Expenditure</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  ₹{trips.reduce((acc, curr) => acc + (curr.total_budget || 0), 0)}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">System Status</p>
                <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Backend Synchronized
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
