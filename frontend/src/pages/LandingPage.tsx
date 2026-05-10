import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Globe, Star, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-4 md:px-6 pt-4 pb-16">
        <div className="relative min-h-[80vh] rounded-[40px] flex items-center justify-center overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop" 
              alt="Travel Background" 
              className="w-full h-full object-cover scale-105 animate-[pulse_30s_ease-in-out_infinite_alternate]"
            />
            {/* Subtle gradient overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900/60 mix-blend-multiply"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center mt-12">
            {/* Social Proof Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full py-1.5 px-4 mb-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-6 h-6 rounded-full border-2 border-slate-800" alt="user" />
                ))}
              </div>
              <span className="text-white text-xs font-bold tracking-wider">OVER 1M+ CLIENTS SERVED</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium text-white mb-6 leading-[1.1] tracking-tight drop-shadow-md">
                Travel planning; <br/><span className="italic">made easy</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-100/90 mb-12 font-medium drop-shadow">
                Fast, smart, and reliable itineraries.
              </p>
            </motion.div>

            {/* Search Bar - Single Input Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-xl mx-auto relative z-20"
            >
              <div className="bg-white/15 backdrop-blur-xl border border-white/30 p-2 rounded-full flex items-center shadow-2xl transition-all focus-within:bg-white/20 focus-within:border-white/50">
                <div className="flex-1 px-6">
                  <input 
                    type="text" 
                    placeholder="Where are you traveling?" 
                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder-white/70 text-lg font-medium"
                  />
                </div>
                <Link to="/explore">
                  <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-500 w-12 h-12 shrink-0 border-none shadow-md text-white transition-transform hover:scale-105">
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery Section Header */}
      <section className="pt-8 pb-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl mb-14">
          <h2 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white mb-8 tracking-tight">
            Your ticket to the world; simple and fast travel planning.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['ALL', 'BEACH', 'CITY', 'NATURE', 'CULTURE'].map((filter, i) => (
              <button 
                key={filter}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
                  i === 0 
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Destination Cards Grid */}
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'INDIA', price: '$45/DAY', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop' },
              { id: 2, name: 'CHINA', price: '$50/DAY', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop' },
              { id: 3, name: 'UNITED STATES', price: '$125/DAY', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop' },
              { id: 4, name: 'JAPAN', price: '$90/DAY', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop' },
            ].map((dest, i) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative h-72 lg:h-80 rounded-[32px] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300"
              >
                <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl py-3 px-5 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-slate-900 dark:text-white tracking-wide">{dest.name}</span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">{dest.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison & Reviews Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Comparison Cards */}
            <div className="lg:col-span-5 relative py-6">
              {/* Underlying Traditional Background Container */}
              <div className="hidden md:block absolute inset-y-0 left-[15%] right-[-2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-sm z-0"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-stretch">
                {/* RoamRadar+ Dark Card */}
                <div className="bg-[#1A1C23] text-white rounded-[32px] p-8 shadow-2xl w-full md:w-[55%] shrink-0">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2 tracking-wide">
                    <Globe className="w-5 h-5 text-blue-500" /> RoamRadar+
                  </h3>
                  <p className="text-slate-400 text-xs mb-8">Skip the endless research. Get your itinerary the easy way.</p>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      'Instant smart itineraries',
                      'Real-time budget tracking',
                      'Interactive map routes',
                      'Collaborate with friends',
                      'Personalized AI recommendations'
                    ].map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/dashboard" className="block w-full mt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-xl text-sm font-semibold tracking-wide transition-colors">
                      Start your journey
                    </Button>
                  </Link>
                </div>

                {/* Traditional Text Content (Side by Side) */}
                <div className="hidden md:flex flex-col justify-center w-[45%] pl-8 pr-2 py-8 shrink-0">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Traditional</h3>
                  <p className="text-slate-500 text-xs mb-6">Clunky spreadsheets.<br/>Endless guesswork.</p>
                  
                  <ul className="space-y-5">
                    {[
                      'Takes 45+ hours',
                      'No price validation',
                      'No live collaboration',
                      'Generic recommendations'
                    ].map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Reviews & Logos */}
            <div className="lg:col-span-7 space-y-12 lg:pl-12">
              <div>
                <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                  A seamless trip available <br className="hidden md:block" /> without resistance.
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-4">
                  <span className="font-semibold text-slate-900 dark:text-white">Rated 4.9 / 5</span>
                  <span>based on</span>
                  <span className="font-semibold text-slate-900 dark:text-white underline decoration-slate-300 underline-offset-4">4,505 reviews.</span>
                  <span>Showing our 4 & 5 star reviews.</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" /> Trustpilot
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Excellent customer support</h4>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                    "I had a few questions during my application, and their team responded quickly and clearly each time. It felt like they genuinely cared about helping me."
                  </p>
                  <div className="flex gap-1 text-green-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Smooth experience from start</h4>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                    "Applying online was easier than I expected. Their platform is user-friendly, the steps are clear, and I got regular updates. I never felt lost."
                  </p>
                  <div className="flex gap-1 text-green-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">So easy and affordable</h4>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                    "Their prices were competitive, and the process was super simple. No hidden fees or confusing requirements—just a quick, professional service."
                  </p>
                  <div className="flex gap-1 text-green-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Reliable and professional service</h4>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                    "I felt confident trusting them with my application. Communications were professional, my information was handled securely, and my itinerary arrived."
                  </p>
                  <div className="flex gap-1 text-green-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col items-center lg:items-start gap-4">
                <p className="text-xs font-semibold text-slate-400">As seen on</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-10 opacity-60 dark:opacity-40 grayscale">
                  <span className="text-xl font-bold tracking-tight">TechCrunch</span>
                  <span className="text-xl font-bold">Bloomberg</span>
                  <span className="text-xl font-black tracking-tighter">GIZMODO</span>
                  <span className="text-xl font-bold font-serif italic">Forbes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
