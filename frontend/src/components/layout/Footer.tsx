import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-1.5 rounded-lg text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Roam Radar
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Discover your next adventure with our premium travel planner. We make exploring the world effortless and beautiful.
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Instagram</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Github</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">Destinations</Link></li>
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">Tours</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Travel Planner</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Travel Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Safety Information</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest travel updates and offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-slate-900 border border-slate-700 text-white rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors font-medium"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Roam Radar. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
