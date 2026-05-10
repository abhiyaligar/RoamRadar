import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, Download, Share2, Receipt } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const BUDGET_DATA = [
  { name: 'Flights', value: 850, color: '#3b82f6' },
  { name: 'Accommodation', value: 1200, color: '#a855f7' },
  { name: 'Activities', value: 450, color: '#f59e0b' },
  { name: 'Food', value: 600, color: '#10b981' },
  { name: 'Transport', value: 200, color: '#f43f5e' },
];

const DAILY_EXPENSES = [
  { day: 'Day 1', amount: 150 },
  { day: 'Day 2', amount: 200 },
  { day: 'Day 3', amount: 350 },
  { day: 'Day 4', amount: 120 },
  { day: 'Day 5', amount: 180 },
  { day: 'Day 6', amount: 250 },
  { day: 'Day 7', amount: 100 },
];

export function ItineraryViewPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget' | 'invoice'>('timeline');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
              <MapPin className="w-5 h-5" />
              <span>Japan Trip 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Tokyo to Kyoto Adventure</h1>
            <div className="flex items-center gap-6 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Oct 15 - Oct 22</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Total Est: $3,300</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'timeline', label: 'Timeline View' },
          { id: 'budget', label: 'Budget & Charts' },
          { id: 'invoice', label: 'Expense Invoice' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'timeline' | 'budget' | 'invoice')}
            className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pt-4">
        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-12 pb-8">
              {[1, 2, 3].map((day) => (
                <div key={day} className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-900" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Day {day}: Kyoto Arrival</h3>
                    <span className="text-sm font-medium text-slate-500">Oct {14 + day}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="p-5 flex gap-4 items-start group">
                      <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-3 rounded-xl shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Check-in at Ryokan</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Settle into the traditional Japanese inn and enjoy welcome tea.</p>
                        <div className="mt-3 flex gap-2">
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">14:00 PM</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-5 flex gap-4 items-start group">
                      <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Fushimi Inari Shrine</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Walk through the thousands of vermilion torii gates.</p>
                        <div className="mt-3 flex gap-2">
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">16:00 PM</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold">$0 (Free)</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={BUDGET_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {BUDGET_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {BUDGET_DATA.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400">{item.name}</p>
                      <p className="font-bold text-slate-900 dark:text-white">${item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Daily Spending</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DAILY_EXPENSES}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'invoice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-xl">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Invoice</h2>
                    <p className="text-sm text-slate-500">Ref: INV-JP2026-001</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl">Roam Radar Planner</h3>
                  <p className="text-slate-500 text-sm mt-1">Generated: Oct 1, 2026</p>
                </div>
              </div>

              <div className="w-full mb-12 overflow-x-auto pb-4">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                      <th className="pb-4 font-medium">Description</th>
                      <th className="pb-4 font-medium text-right">Category</th>
                      <th className="pb-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-900 dark:text-white">
                    {[
                      { desc: 'Roundtrip Flights (JAL)', cat: 'Transport', amt: 850 },
                      { desc: 'Ryokan Stay (3 Nights)', cat: 'Accommodation', amt: 600 },
                      { desc: 'Hotel Stay (4 Nights)', cat: 'Accommodation', amt: 600 },
                      { desc: 'JR Pass (7 Days)', cat: 'Transport', amt: 200 },
                      { desc: 'Universal Studios Pass', cat: 'Activities', amt: 120 },
                      { desc: 'Guided Temple Tour', cat: 'Activities', amt: 80 },
                      { desc: 'Food & Dining Allowance', cat: 'Food', amt: 600 },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                        <td className="py-4 font-medium pr-4">{item.desc}</td>
                        <td className="py-4 text-right text-slate-500 pr-4">{item.cat}</td>
                        <td className="py-4 text-right">${item.amt.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>$3,050.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax & Fees (8%)</span>
                    <span>$244.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Cost</span>
                    <span className="text-blue-500">$3,294.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-8">
                This is an estimated invoice based on your planned activities and budget allocations. Actual expenses may vary.
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
