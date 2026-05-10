import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Plus, Trash2, Box, Briefcase, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function PackingChecklistPage() {
  const [items, setItems] = useState([
    { id: 1, text: 'Passport & Visas', category: 'Documents', packed: true },
    { id: 2, text: 'Travel Insurance', category: 'Documents', packed: false },
    { id: 3, text: 'T-Shirts & Tops', category: 'Clothing', packed: true },
    { id: 4, text: 'Light Jacket', category: 'Clothing', packed: false },
    { id: 5, text: 'Camera & Lenses', category: 'Electronics', packed: false },
    { id: 6, text: 'Power Bank', category: 'Electronics', packed: true },
    { id: 7, text: 'Universal Adapter', category: 'Electronics', packed: false },
  ]);

  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing');

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), text: newItem, category: newCategory, packed: false }]);
    setNewItem('');
  };

  const categories = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Miscellaneous'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Documents': return <Briefcase className="w-5 h-5 text-amber-500" />;
      case 'Electronics': return <Camera className="w-5 h-5 text-blue-500" />;
      default: return <Box className="w-5 h-5 text-purple-500" />;
    }
  };

  const progress = Math.round((items.filter(i => i.packed).length / items.length) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Packing Checklist</h1>
        <p className="text-slate-500 dark:text-slate-400">Keep track of everything you need for your trip.</p>
      </div>

      <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-blue-500 to-sky-400 text-white border-none shadow-xl shadow-blue-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-2">Packing Progress</h2>
            <div className="flex justify-between text-sm font-medium text-blue-100 mb-2">
              <span>{items.filter(i => i.packed).length} of {items.length} items packed</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-blue-900/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
          <div className="text-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
            <div className="text-4xl font-extrabold">{items.length - items.filter(i => i.packed).length}</div>
            <div className="text-sm font-medium text-blue-100 mt-1">Items Left</div>
          </div>
        </div>
      </Card>

      <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input 
          type="text" 
          placeholder="Add new item..." 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
        <select 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white cursor-pointer"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button type="submit" className="shrink-0 h-auto">
          <Plus className="w-5 h-5" />
        </Button>
      </form>

      <div className="space-y-8">
        {categories.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                {getCategoryIcon(category)}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{category}</h3>
                <span className="text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                  {categoryItems.filter(i => i.packed).length}/{categoryItems.length}
                </span>
              </div>
              <Card className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {categoryItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    layout
                    className={`flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${item.packed ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
                  >
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-6 h-6 text-blue-500 shrink-0" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span className={`font-medium ${item.packed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.text}
                      </span>
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
