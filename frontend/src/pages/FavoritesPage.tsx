import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { DestinationCard } from '../components/ui/DestinationCard';
import { DESTINATIONS } from '../data/mockData';

export function FavoritesPage() {
  // Mock favorites - just taking some random ones from our mock data
  const favorites = DESTINATIONS.slice(1, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-pink-500/10 p-3 rounded-xl">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved Destinations</h1>
          <p className="text-slate-500 dark:text-slate-400">Places you've liked and want to visit in the future.</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((destination, idx) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              layout
            >
              <DestinationCard {...destination} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Start exploring and save the places you'd like to visit.</p>
        </div>
      )}
    </div>
  );
}
