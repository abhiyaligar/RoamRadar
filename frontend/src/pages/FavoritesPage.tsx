import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Trash2, Loader2, Compass } from 'lucide-react';
import { api } from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function FavoritesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/wishlist');
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  const cities = items.filter(i => i.item_type === 'CITY');
  const activities = items.filter(i => i.item_type === 'ACTIVITY');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-500/20">
            <Heart className="w-3 h-3 fill-current" /> My Wishlist
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Saved <span className="text-pink-500">Adventures</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">
            "Every traveler has a home in their heart for the places they've yet to see."
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 dark:bg-slate-900 rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-6 animate-pulse" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Your wishlist is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 font-medium">Explore the community and save some cities or activities for your next journey!</p>
          <Button onClick={() => window.location.href = '/community'} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 py-6 font-bold shadow-xl shadow-blue-500/20">
            Discover Now
          </Button>
        </div>
      ) : (
        <div className="space-y-16">
          {cities.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <MapPin className="text-blue-500 w-6 h-6" /> Cities to Explore
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city, idx) => (
                  <motion.div key={city.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card className="p-6 rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900 group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{city.name}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{city.location || 'New Destination'}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemove(city.id)}
                          className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {activities.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Clock className="text-green-500 w-6 h-6" /> Planned Activities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, idx) => (
                  <motion.div key={activity.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                    <Card className="p-8 rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                          <Clock className="w-6 h-6" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemove(activity.id)}
                          className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      <h3 className="text-xl font-black mb-2 tracking-tight">{activity.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-md tracking-wider">
                          {activity.category || 'General'}
                        </span>
                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {activity.location}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
