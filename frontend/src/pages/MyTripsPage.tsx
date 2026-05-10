import { motion } from 'framer-motion';
import { Plus, MoreVertical, Calendar, MapPin, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { UPCOMING_TRIPS } from '../data/mockData';
import { Link } from 'react-router-dom';

export function MyTripsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Trips</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage all your planned adventures.</p>
        </div>
        <Link to="/create-trip">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" size="sm" className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200">Upcoming</Button>
          <Button variant="ghost" size="sm">Past</Button>
          <Button variant="ghost" size="sm">Drafts</Button>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search trips..." 
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {UPCOMING_TRIPS.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hoverEffect className="group overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <img 
                  src={trip.image} 
                  alt={trip.destination} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  {trip.status}
                </div>
                <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-md hover:bg-white/40 transition-colors">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{trip.destination}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{trip.date} (7 Days)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span>2 Cities, 8 Activities</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-3">
                  <Link to={`/itinerary/${trip.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm py-2">View Details</Button>
                  </Link>
                  <Link to="/builder" className="flex-1">
                    <Button className="w-full text-sm py-2 bg-blue-600 hover:bg-blue-700">Edit Plan</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Create New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <Link to="/create-trip" className="block h-full">
            <Card hoverEffect className="h-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create New Trip</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Start planning your next adventure from scratch.</p>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
