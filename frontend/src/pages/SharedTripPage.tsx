import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Clock, DollarSign, Globe, Loader2,
  AlertTriangle, ArrowRight, Heart, Share2, Copy, Check, Compass
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { api } from '../utils/api';

const CATEGORY_COLORS: Record<string, string> = {
  Flight: 'bg-sky-100 dark:bg-sky-500/10 text-sky-600',
  Hotel: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600',
  Food: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600',
  Sightseeing: 'bg-green-100 dark:bg-green-500/10 text-green-600',
  Transit: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600',
  Other: 'bg-slate-100 dark:bg-slate-800 text-slate-600',
};

export function SharedTripPage() {
  const { public_link_id } = useParams<{ public_link_id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeStop, setActiveStop] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!public_link_id || public_link_id === 'undefined') {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.get(`/shared/${public_link_id}`);
        setTrip(data);
      } catch (err) {
        console.error('Failed to fetch shared trip:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [public_link_id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip?.name} — RoamRadar`,
          text: `Check out this itinerary on RoamRadar!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Loading itinerary...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Trip Not Found</h1>
        <p className="text-slate-500 max-w-sm mb-8">
          This itinerary may have been made private or removed by its owner.
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 shadow-xl">
            Go to RoamRadar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const stops = trip.stops || [];
  const totalDays = stops.length;
  const totalActivities = stops.reduce((acc: number, s: any) => acc + (s.activities?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Minimal Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white tracking-tight">RoamRadar</span>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1">Read Only</span>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 dark:border-slate-700 gap-2 text-sm px-4 py-2 h-auto"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Link to="/login">
              <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-auto text-sm shadow-lg shadow-blue-500/20">
                Plan Your Trip <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero */}
        <div className="relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900 to-slate-900" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[120px] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                <Globe className="w-3 h-3" /> Public Itinerary
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                {trip.name}
              </h1>

              {trip.description && (
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed italic">"{trip.description}"</p>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 pt-2">
                {trip.start_date && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} — {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span>{totalDays} {totalDays === 1 ? 'City' : 'Cities'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{totalActivities} Activities</span>
                </div>
                {trip.total_budget && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span>Budget: ${trip.total_budget}</span>
                  </div>
                )}
              </div>

              {/* City Pills */}
              {stops.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {stops.map((stop: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStop(idx)}
                      className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                        activeStop === idx
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                          : 'bg-white/5 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {stop.city_name}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {stops.length === 0 ? (
            <div className="py-20 text-center">
              <MapPin className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No cities added yet</h3>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Timeline */}
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-16 pb-8">
                {stops.map((stop: any, idx: number) => (
                  <motion.div
                    key={idx}
                    id={`stop-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-10"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-[13px] top-1 h-6 w-6 rounded-full border-4 border-slate-50 dark:border-slate-950 shadow-lg transition-all ${
                      activeStop === idx ? 'bg-blue-600 shadow-blue-500/30' : 'bg-slate-300 dark:bg-slate-600'
                    }`} />

                    {/* Stop Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-3">
                      <div>
                        <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Stop {idx + 1}</span>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stop.city_name}</h2>
                        {stop.country && (
                          <p className="text-slate-500 text-sm font-medium flex items-center gap-1 mt-1">
                            <Globe className="w-3.5 h-3.5" /> {stop.country}
                          </p>
                        )}
                      </div>
                      {(stop.arrival_date || stop.departure_date) && (
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-500 self-start">
                          <Calendar className="w-3.5 h-3.5" />
                          {stop.arrival_date} → {stop.departure_date}
                        </div>
                      )}
                    </div>

                    {/* Activities Grid */}
                    {stop.activities?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {stop.activities.map((activity: any, aIdx: number) => {
                          const colorClass = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.Other;
                          return (
                            <Card
                              key={aIdx}
                              className="p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-slate-900"
                            >
                              <div className="flex gap-4 items-start">
                                <div className={`p-3 rounded-2xl shrink-0 ${colorClass}`}>
                                  <Clock className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight truncate">{activity.name}</h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${colorClass}`}>
                                      {activity.category || 'General'}
                                    </span>
                                    {activity.cost_amount !== undefined && (
                                      <span className="text-[10px] font-black uppercase bg-green-50 dark:bg-green-500/10 text-green-600 px-2.5 py-1 rounded-lg border border-green-200/50 dark:border-green-500/20">
                                        ${activity.cost_amount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm italic">
                        No activities listed for this city.
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Footer */}
        <div className="bg-slate-900 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
              <Heart className="w-3 h-3 fill-current" /> Inspired by this trip?
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Plan your own adventure</h2>
            <p className="text-slate-400 text-lg">
              Create personalized multi-city itineraries, track budgets, and share them with the world — for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 py-6 text-base font-bold shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all">
                  Start Planning Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-slate-700 bg-white/5 text-white hover:bg-white/10 rounded-2xl px-10 py-6 text-base font-bold"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 mr-2" /> Share This Trip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
