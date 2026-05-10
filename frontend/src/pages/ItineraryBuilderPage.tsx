import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, GripVertical, Calendar, Clock, Plus, Trash2, MapPin, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function ItineraryBuilderPage() {
  // Mock internal state for the builder
  const [stops, setStops] = useState([
    { id: '1', city: 'Kyoto', country: 'Japan', days: 3, cost: 850 },
    { id: '2', city: 'Tokyo', country: 'Japan', days: 4, cost: 1200 },
  ]);

  const moveStop = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stops.length - 1)) return;
    
    const newStops = [...stops];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStops[index], newStops[swapIndex]] = [newStops[swapIndex], newStops[index]];
    setStops(newStops);
  };

  const removeStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Panel: Builder List */}
      <div className="w-full lg:w-1/2 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Builder</h1>
            <p className="text-sm text-slate-500">Plan your stops and activities</p>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Stop
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-0 overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-colors">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center gap-1 mr-3">
                    <button 
                      onClick={() => moveStop(index, 'up')}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-500'}`}
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveStop(index, 'down')}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${index === stops.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-500'}`}
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {stop.city}, {stop.country}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Est. Cost</p>
                      <p className="font-bold text-slate-900 dark:text-white">${stop.cost}</p>
                    </div>
                    <button onClick={() => removeStop(stop.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{stop.days} Days</span>
                      <div className="flex gap-1 ml-2">
                        <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-blue-500">-</button>
                        <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-blue-500">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Activities</div>
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg relative group">
                      <GripVertical className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab" />
                      <div className="pl-4 flex-1">
                        <p className="text-slate-900 dark:text-white font-medium text-sm">Visit Historic Temples</p>
                        <div className="flex gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 4 hrs</span>
                          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> $25</span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 mt-2">
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel: Interactive Map Placeholder */}
      <div className="hidden lg:block w-1/2 h-[calc(100vh-8rem)] sticky top-24 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
          alt="Map Interface Placeholder" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white inline-block max-w-sm">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Map className="w-5 h-5" /> Interactive Map View
            </h3>
            <p className="text-sm text-white/80">Connects with Mapbox or Leaflet to visualize your route, display city markers, and estimate travel times between stops.</p>
          </div>
        </div>
        
        {/* Mock Map Markers & Route Line */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-10" />
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-10" />
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md" style={{ zIndex: 5 }}>
          <path d="M 25% 33% C 35% 40%, 45% 45%, 50% 50%" stroke="white" strokeWidth="3" strokeDasharray="6 6" fill="none" />
        </svg>
      </div>
    </div>
  );
}
