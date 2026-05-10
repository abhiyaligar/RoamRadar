import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, IndianRupee, Clock, Heart, Share2, Map, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DESTINATIONS } from '../data/mockData';

export function DestinationDetailsPage() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  
  // Find destination or use a default one for the placeholder
  const destination = DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0];
  
  const similarDestinations = DESTINATIONS.filter(d => d.id !== destination.id).slice(0, 3);

  return (
    <div className="pb-24">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-6 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-4 font-medium">
              <MapPin className="w-5 h-5" />
              <span>{destination.country}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {destination.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-white/60">({destination.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <IndianRupee className="w-5 h-5" />
                <span className="font-semibold">Budget: {destination.budget}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{destination.bestTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute top-24 right-4 md:right-10 flex gap-3">
          <Button variant="glass" size="icon" className="rounded-full h-12 w-12">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            onClick={() => setIsLiked(!isLiked)}
            className={`rounded-full h-12 w-12 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors ${isLiked ? 'text-pink-500 border-pink-500 bg-pink-500/20' : 'text-slate-300'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {destination.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Travel Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Interactive Itinerary</h2>
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
                {[1, 2, 3].map((day) => (
                  <div key={day} className="relative pl-8">
                    <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900"></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Day {day}: Arrival & Exploration</h3>
                    <Card className="p-5 mt-4">
                      <p className="text-slate-600 dark:text-slate-400">Morning walk through the city center, followed by a guided tour of the main historical sites. Enjoy a traditional lunch at a local restaurant.</p>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Plan Your Trip</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Ready to experience {destination.name}? Start planning your itinerary now.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Select Dates</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <IndianRupee className="w-5 h-5 text-blue-500" />
                    <span>Est. {destination.budget === '₹' ? '₹40,000' : destination.budget === '₹₹' ? '₹96,000' : '₹2,00,000+'} per person</span>
                  </div>
                </div>
                <Button size="lg" className="w-full">
                  Start Planning
                </Button>
              </Card>
              
              <Card className="p-1 h-64 overflow-hidden relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover rounded-xl opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors rounded-xl">
                  <div className="bg-white text-slate-900 p-3 rounded-full shadow-lg">
                    <Map className="w-6 h-6" />
                  </div>
                  <span className="text-white font-semibold shadow-sm">View on Map</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Destinations */}
      <div className="container mx-auto px-4 md:px-6 mt-24">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Similar Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarDestinations.map(dest => (
            <Link key={dest.id} to={`/destination/${dest.id}`} className="block group">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.country}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
