import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, Download, Share2, Receipt, Loader2, User, Heart, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

export function ItineraryViewPage() {
  const { id, public_link_id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget' | 'invoice'>('timeline');
  
  const handleAddToWishlist = async (item: any, type: 'CITY' | 'ACTIVITY', locationName?: string) => {
    try {
      await api.post('/wishlist', {
        item_type: type,
        name: type === 'CITY' ? item.city_name : item.name,
        location: type === 'ACTIVITY' ? (locationName || 'Unknown') : item.city_name,
        category: item.category || null,
        image_url: item.image_url || null
      });
      alert(`${type === 'CITY' ? item.city_name : item.name} added to wishlist!`);
    } catch (err: any) {
      if (err.message === 'Item already in wishlist') {
        alert('This item is already in your wishlist');
      } else {
        alert('Failed to add to wishlist');
      }
    }
  };


  useEffect(() => {
    const fetchTripData = async () => {
      if (public_link_id === 'undefined' || (!id && !public_link_id)) {
        setIsLoading(false);
        return;
      }
      try {
        let data;
        if (public_link_id) {
          data = await api.get(`/shared/${public_link_id}`);
        } else if (id) {
          data = await api.get(`/trips/${id}`);
        }
        setTrip(data);
      } catch (err) {
        console.error('Failed to fetch trip:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTripData();
  }, [id, public_link_id]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Fetching itinerary details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
        <p className="text-slate-500 max-w-sm">This trip may have been removed or made private by the owner.</p>
      </div>
    );
  }

  const budgetData = [
    { name: 'Food', value: 30, color: '#3b82f6' },
    { name: 'Activities', value: 40, color: '#10b981' },
    { name: 'Transport', value: 30, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-xs">
              <Globe className="w-4 h-4" />
              <span>{public_link_id ? 'Public Itinerary' : 'Private View'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span>Budget: ${trip.total_budget || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                <span>{trip.member_limit || 1} Traveler(s)</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white rounded-2xl px-6 py-6">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 shadow-xl shadow-blue-500/20">
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-fit overflow-x-auto">
        {[
          { id: 'timeline', label: 'Timeline' },
          { id: 'budget', label: 'Budget Analysis' },
          { id: 'invoice', label: 'Receipts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pt-4">
        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {trip.stops?.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-16 pb-8">
                {trip.stops.map((stop: any, idx: number) => (
                  <div key={stop.id} className="relative pl-10">
                    <div className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-900 shadow-lg shadow-blue-500/30" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-2">
                      <div>
                        <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Day {idx + 1}</span>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stop.city_name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAddToWishlist(stop, 'CITY')}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 rounded-full transition-all"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-500">
                          <MapPin className="w-3.5 h-3.5" /> Stop #{idx + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stop.activities?.map((activity: any) => (
                        <Card key={activity.id} className="p-6 rounded-[28px] border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px]">
                          <div className="flex gap-5 items-start">
                            <div className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 p-4 rounded-2xl">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{activity.name}</h4>
                                <button 
                                  onClick={() => handleAddToWishlist(activity, 'ACTIVITY', stop.city_name)}
                                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">{activity.category || 'General Activity'}</p>
                              <div className="mt-4 flex items-center gap-3">
                                <span className="bg-green-500/10 text-green-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-green-500/20">
                                  ${activity.cost_amount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {(!stop.activities || stop.activities.length === 0) && (
                        <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[28px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm italic">
                          No activities planned for this city yet.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800">
                 <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-400">Your itinerary is empty</h3>
                 <p className="text-slate-500 mt-2">Go to the builder to add some cities!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 rounded-[32px] border-none shadow-xl">
              <h3 className="text-2xl font-bold mb-8 tracking-tight">Expense Distribution</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value">
                      {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {budgetData.map(item => (
                  <div key={item.name} className="text-center space-y-1">
                    <div className="w-full h-1.5 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{item.name}</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{item.value}%</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 rounded-[32px] border-none shadow-xl flex flex-col items-center justify-center text-center">
               <DollarSign className="w-16 h-16 text-green-500 mb-6 bg-green-500/10 p-4 rounded-full" />
               <h3 className="text-2xl font-bold mb-2 tracking-tight">Financial Health</h3>
               <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs font-medium">Your current spending is perfectly aligned with your ${trip.total_budget} target.</p>
               <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[70%] shadow-[0_0_15px_#22c55e]" />
               </div>
               <div className="flex justify-between w-full mt-4 text-xs font-black uppercase text-slate-400 tracking-tighter">
                  <span>Current: $2,100</span>
                  <span>Goal: ${trip.total_budget}</span>
               </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'invoice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
             <Card className="p-10 md:p-16 rounded-[48px] shadow-2xl border-none relative overflow-hidden bg-white dark:bg-slate-900">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -mr-16 -mt-16 rounded-full" />
                <div className="flex justify-between items-start mb-16">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Itinerary Summary</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Generated for {trip.name}</p>
                  </div>
                  <Receipt className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                </div>

                <div className="space-y-8">
                  {trip.stops?.map((stop: any) => (
                    <div key={stop.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.4em]">{stop.city_name}</span>
                        <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800" />
                      </div>
                      <div className="space-y-3">
                        {stop.activities?.map((activity: any) => (
                          <div key={activity.id} className="flex justify-between items-center py-2">
                             <span className="font-bold text-slate-700 dark:text-slate-300">{activity.name}</span>
                             <span className="font-black text-slate-900 dark:text-white">${activity.cost_amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-10 border-t-4 border-double border-slate-100 dark:border-slate-800">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Grand Total</p>
                        <p className="text-5xl font-black text-blue-600">${trip.total_budget || 0}</p>
                      </div>
                      <Button className="bg-slate-900 dark:bg-white dark:text-black rounded-2xl px-10 py-6 font-bold shadow-xl">
                        Print Receipt
                      </Button>
                   </div>
                </div>
             </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
