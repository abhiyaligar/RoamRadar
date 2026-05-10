import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Search, Loader2, ArrowRight, Plus, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function CommunityPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trips' | 'groups'>('trips');

  // Create Community Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tripsData, groupsData] = await Promise.all([
        api.get('/shared/community'),
        api.get('/communities')
      ]);
      setTrips(tripsData);
      setCommunities(groupsData);
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const community = await api.post('/communities', newCommunity);
      setCommunities([community, ...communities]);
      setIsModalOpen(false);
      setNewCommunity({ name: '', description: '', image_url: '' });
      setActiveTab('groups');
    } catch (err) {
      alert('Failed to create community');
    }
  };

  const handleAddToWishlist = async (item: any, type: 'CITY' | 'ACTIVITY') => {
    try {
      await api.post('/wishlist', {
        item_type: type,
        name: type === 'CITY' ? item.city_name : item.name,
        location: type === 'ACTIVITY' ? item.location : item.city_name,
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


  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.stops?.some((s: any) => s.city_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Connecting to community...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="text-center space-y-4 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">
          <Globe className="w-4 h-4" /> RoamRadar Social
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
          Explore & <span className="text-blue-600">Connect</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          Discover incredible itineraries or join a community of like-minded travelers.
        </p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('trips')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'trips' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl' : 'text-slate-500'}`}
          >
            Shared Trips
          </button>
          <button 
            onClick={() => setActiveTab('groups')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'groups' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl' : 'text-slate-500'}`}
          >
            Groups
          </button>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder={activeTab === 'trips' ? "Search itineraries..." : "Search groups..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {activeTab === 'groups' && (
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6">
              <Plus className="w-5 h-5 mr-2" /> Create
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeTab === 'trips' ? (
          filteredTrips.map((trip, idx) => (
            <motion.div key={trip.id || `trip-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="overflow-hidden group h-full flex flex-col rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900">
                <div className="relative h-64 overflow-hidden">
                  <img src={trip.cover_image_url || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={trip.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (trip.stops && trip.stops.length > 0) {
                        trip.stops.forEach((stop: any) => handleAddToWishlist(stop, 'CITY'));
                      }
                    }}
                    className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-red-500 transition-all group/heart"
                  >
                    <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{trip.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {trip.stops?.slice(0, 2).map((stop: any, sIdx: number) => (
                        <span key={stop.id || sIdx} className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-1 rounded-md tracking-wider">{stop.city_name}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 italic">"{trip.description || 'Exploring the hidden gems and local culture of these incredible cities.'}"</p>
                  <Button 
                    onClick={() => trip.public_link_id && navigate(`/share/${trip.public_link_id}`)} 
                    disabled={!trip.public_link_id}
                    className="w-full bg-slate-900 dark:bg-white dark:text-black py-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {trip.public_link_id ? 'View Itinerary' : 'Link Unavailable'} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          filteredCommunities.map((community, idx) => (
            <motion.div key={community.id || `community-${idx}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
              <Card className="p-8 rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900 flex flex-col h-full group">
                <div className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-500">
                  <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{community.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow">{community.description || 'A growing community of passionate travelers sharing their best experiences.'}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-xs font-bold text-slate-400">ADMIN: YOU</span>
                   <Button variant="outline" className="rounded-full px-6">Join Group</Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start a Community">
        <form onSubmit={handleCreateCommunity} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Community Name</label>
            <input 
              type="text" required
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              placeholder="e.g. Budget Backpackers"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea 
              rows={3}
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              placeholder="What is this community about?"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Launch Community</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
