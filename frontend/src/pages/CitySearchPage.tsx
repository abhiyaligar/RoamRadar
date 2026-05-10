import { useState } from 'react';
import { Search, MapPin, TrendingUp, Plus, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DESTINATIONS } from '../data/mockData';
import { motion } from 'framer-motion';

export function CitySearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addedCities, setAddedCities] = useState<string[]>([]);

  const toggleCity = (cityId: string) => {
    if (addedCities.includes(cityId)) {
      setAddedCities(addedCities.filter(id => id !== cityId));
    } else {
      setAddedCities([...addedCities, cityId]);
    }
  };

  const filteredCities = DESTINATIONS.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Search Cities & Activities</h1>
        <p className="text-slate-500 dark:text-slate-400">Find the best stops to add to your itinerary.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        <input 
          type="text" 
          placeholder="Where do you want to go?" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-slate-900 dark:text-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer hidden md:block">
            <option>All Regions</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>Americas</option>
          </select>
          <Button size="sm">Search</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Stops</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city, idx) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="flex items-center p-3 gap-4 group">
              <img 
                src={city.image} 
                alt={city.name} 
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{city.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  {city.country}
                </div>
                <div className="flex gap-1 mt-2">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                    {city.budget}
                  </span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md flex items-center">
                    ★ {city.rating}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => toggleCity(city.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  addedCities.includes(city.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-blue-500 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500'
                }`}
              >
                {addedCities.includes(city.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Bar */}
      {addedCities.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50"
        >
          <div className="font-medium">
            <span className="font-bold text-blue-400 dark:text-blue-600">{addedCities.length}</span> cities selected
          </div>
          <Button variant="primary" className="dark:bg-blue-600 dark:hover:bg-blue-700">
            Add to Itinerary
          </Button>
        </motion.div>
      )}
    </div>
  );
}
