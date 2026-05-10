import { Star, MapPin, Clock } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  rating: number;
  reviews: number;
  budget: string;
  image: string;
  tags?: string[];
  bestTime?: string;
}

export function DestinationCard({ 
  id, name, country, rating, reviews, budget, image, tags = [], bestTime
}: DestinationCardProps) {
  return (
    <Card hoverEffect className="group flex flex-col h-full">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={image} 
          alt={`${name}, ${country}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{rating}</span>
          <span className="text-xs text-slate-500">({reviews})</span>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
          {tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{country}</span>
            </div>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-sm">
            {budget}
          </span>
        </div>
        
        {bestTime && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Best time: {bestTime}</span>
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to={`/destination/${id}`} className="block w-full">
            <Button variant="outline" className="w-full justify-between group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all">
              View Details
              <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
