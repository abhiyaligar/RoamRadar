import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, DollarSign, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassContainer } from '../components/ui/GlassContainer';
import { DestinationCard } from '../components/ui/DestinationCard';
import { DESTINATIONS } from '../data/mockData';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const featuredDestinations = DESTINATIONS.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop" 
            alt="Travel Background" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-950"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm mb-6 border border-blue-500/30 backdrop-blur-md">
              Elevate Your Journey
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Discover Your <br />
              <span className="text-gradient">Next Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Experience the world with Roam Radar. Curated destinations, intelligent itineraries, and unforgettable memories waiting to be made.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/explore">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Now
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Trending Destinations
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto relative z-20"
          >
            <GlassContainer dark className="p-4 md:p-6 rounded-3xl flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
                <MapPin className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="bg-transparent border-none text-white focus:outline-none w-full placeholder-slate-400"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
                <Calendar className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="When?" 
                  className="bg-transparent border-none text-white focus:outline-none w-full placeholder-slate-400"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
                <DollarSign className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Budget" 
                  className="bg-transparent border-none text-white focus:outline-none w-full placeholder-slate-400"
                />
              </div>
              <Button size="lg" className="shrink-0 h-auto py-3">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </GlassContainer>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Trending Destinations
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                Explore our handpicked selection of the most breathtaking places on Earth, perfect for your next getaway.
              </p>
            </div>
            <Link to="/explore" className="hidden md:inline-flex items-center text-blue-500 hover:text-blue-600 font-medium group">
              View All Destinations
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DestinationCard {...destination} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/explore">
              <Button variant="outline" className="w-full">
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
            Travelers Love Roam Radar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[1, 2, 3].map((item, index) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative"
              >
                <div className="flex text-amber-500 mb-4">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                  "This platform completely transformed how I plan my trips. The recommendations were spot on and the itinerary builder saved me hours of research!"
                </p>
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${item * 10}`} alt="User" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                    <p className="text-sm text-slate-500">Global Explorer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
