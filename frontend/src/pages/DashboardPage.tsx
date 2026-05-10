import { motion } from 'framer-motion';
import { Plus, Calendar, CheckCircle2, Circle, MoreHorizontal, PlaneTakeoff, Hotel, Utensils } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { UPCOMING_TRIPS } from '../data/mockData';

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Travel Planner</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your itineraries and upcoming adventures.</p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Trips */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Upcoming Journeys</h2>
            <div className="space-y-4">
              {UPCOMING_TRIPS.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card hoverEffect className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    <img 
                      src={trip.image} 
                      alt={trip.destination} 
                      className="w-full sm:w-40 h-40 sm:h-auto object-cover rounded-xl"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-500 mb-1">
                            <span className="bg-blue-500/10 px-2.5 py-0.5 rounded-full">{trip.status}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{trip.destination}</h3>
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{trip.date}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Planning Progress</span>
                          <span className="text-slate-900 dark:text-white font-bold">{trip.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${trip.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Activity Timeline</h2>
            <Card className="p-6">
              <div className="space-y-6">
                {[
                  { icon: PlaneTakeoff, title: 'Flight to Santorini booked', time: '2 days ago', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Hotel, title: 'Accommodation reserved for 7 nights', time: '5 days ago', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { icon: Utensils, title: 'Dinner at Oia recommended restaurant added', time: '1 week ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className={`mt-0.5 shrink-0 ${activity.bg} ${activity.color} p-2 rounded-full h-9 w-9 flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Checklist & Budget */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Pre-trip Checklist</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {[
                  { text: 'Book flights', done: true },
                  { text: 'Reserve accommodation', done: true },
                  { text: 'Get travel insurance', done: false },
                  { text: 'Pack bags', done: false },
                  { text: 'Check visa requirements', done: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${item.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Budget Tracker</h2>
            <Card className="p-6">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">$3,500</p>
              </div>
              
              <div className="space-y-5">
                {[
                  { category: 'Flights', amount: 850, total: 1000, color: 'bg-blue-500' },
                  { category: 'Accommodation', amount: 1200, total: 1500, color: 'bg-purple-500' },
                  { category: 'Activities', amount: 300, total: 600, color: 'bg-amber-500' },
                  { category: 'Food', amount: 150, total: 400, color: 'bg-green-500' },
                ].map((budget, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{budget.category}</span>
                      <span className="text-slate-500">${budget.amount} / ${budget.total}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${budget.color} rounded-full`}
                        style={{ width: `${(budget.amount / budget.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
