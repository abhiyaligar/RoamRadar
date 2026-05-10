import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Share2, Copy, Users, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function CommunityPage() {
  const [likedTrips, setLikedTrips] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedTrips(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const publicTrips = [
    { id: 1, title: 'Backpacking Southeast Asia', author: 'Emma Walker', avatar: 'https://i.pravatar.cc/100?img=1', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop', days: 14, likes: 342, copies: 89 },
    { id: 2, title: 'Swiss Alps Winter Retreat', author: 'David Chen', avatar: 'https://i.pravatar.cc/100?img=11', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', days: 7, likes: 856, copies: 214 },
    { id: 3, title: 'Tuscany Roadtrip', author: 'Sophia Rossi', avatar: 'https://i.pravatar.cc/100?img=5', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop', days: 10, likes: 512, copies: 145 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-blue-600 mb-12">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop" 
          alt="Community" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="relative z-10 p-10 md:p-16 text-center text-white">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Traveler Community</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Discover public itineraries shared by globetrotters. Copy their trips, get inspired, and plan your next adventure.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl shadow-blue-900/20">Explore Trips</Button>
            <Button variant="outline" className="border-white/30 hover:bg-white/10 text-white">Share Your Trip</Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Top Rated Itineraries
        </h2>
        <div className="flex gap-2">
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer">
            <option>Trending This Week</option>
            <option>Most Copied</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publicTrips.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hoverEffect className="overflow-hidden flex flex-col h-full group">
              <div className="relative h-56">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">
                  {trip.days} Days
                </div>
                <button 
                  onClick={() => toggleLike(trip.id)}
                  className={`absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-colors ${likedTrips.has(trip.id) ? 'text-pink-500' : 'hover:text-pink-500 text-slate-600 dark:text-slate-400'}`}
                >
                  <Heart className={`w-4 h-4 ${likedTrips.has(trip.id) ? 'fill-pink-500' : ''}`} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-1 group-hover:text-blue-500 transition-colors">{trip.title}</h3>
                
                <div className="flex items-center justify-between mt-auto mb-6">
                  <div className="flex items-center gap-2">
                    <img src={trip.avatar} alt={trip.author} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{trip.author}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Heart className={`w-4 h-4 text-pink-500 ${likedTrips.has(trip.id) ? 'fill-pink-500' : ''}`} /> {trip.likes + (likedTrips.has(trip.id) ? 1 : 0)}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {trip.copies}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="px-2 hover:text-blue-500">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30">
                      <Copy className="w-4 h-4 mr-1.5" /> Copy
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
