import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Plus, Trash2, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function TripNotesPage() {
  const [notes] = useState([
    { id: 1, title: 'Kyoto Temple Route', content: 'Start early at Fushimi Inari to beat the crowds. Then head to Kiyomizu-dera. Dont forget to try the matcha ice cream on the walk up!', date: 'Oct 14, 2026', location: 'Kyoto, Japan' },
    { id: 2, title: 'Best Ramen Spots', content: 'Ichiran is good for the experience, but want to find a hidden local spot in Shinjuku. Ask the hotel concierge.', date: 'Oct 12, 2026', location: 'Tokyo, Japan' },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trip Journal & Notes</h1>
          <p className="text-slate-500 dark:text-slate-400">Jot down memories, recommendations, and important details.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" /> New Note</>}
        </Button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          className="mb-8"
        >
          <Card className="p-6 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10">
            <input 
              type="text" 
              placeholder="Note Title" 
              className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none text-slate-900 dark:text-white mb-4 placeholder-slate-300 dark:placeholder-slate-700"
            />
            <textarea 
              rows={5}
              placeholder="Start writing your thoughts here..." 
              className="w-full bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-300 resize-none mb-4 placeholder-slate-400 dark:placeholder-slate-600"
            />
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-500"><MapPin className="w-4 h-4 mr-1" /> Add Location</Button>
                <Button variant="ghost" size="sm" className="text-slate-500"><ImageIcon className="w-4 h-4 mr-1" /> Add Image</Button>
              </div>
              <Button onClick={() => setIsAdding(false)}>Save Note</Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note, idx) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pr-8">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                  <button className="p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-slate-800 rounded shadow-sm"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded shadow-sm"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow leading-relaxed">
                {note.content}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {note.date}
                </div>
                {note.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {note.location}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Empty State / Add New Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: notes.length * 0.1 }}
          className="h-full"
        >
          <Card 
            className="h-full min-h-[200px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsAdding(true)}
          >
            <div className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <Edit3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Write a memory</h3>
            <p className="text-xs text-slate-500 mt-1">Capture your travel experiences</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
