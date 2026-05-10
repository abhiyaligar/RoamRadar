import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DestinationCard } from '../components/ui/DestinationCard';
import { DESTINATIONS } from '../data/mockData';

export function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDestinations = DESTINATIONS.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Explore <span className="text-gradient">Destinations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl"
          >
            Find your perfect getaway. From tropical paradises to bustling metropolitan cities, your next adventure awaits.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-slate-900 dark:text-white"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </motion.div>
      </div>

      {/* Grid */}
      {filteredDestinations.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredDestinations.map((destination, idx) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <DestinationCard {...destination} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <Compass className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No destinations found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </Button>
        </div>
      )}
      
      {/* Pagination / Load More */}
      {filteredDestinations.length > 0 && (
        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Load More Destinations
          </Button>
        </div>
      )}
    </div>
  );
}
