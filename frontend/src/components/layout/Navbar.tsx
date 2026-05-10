import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Planner', path: '/dashboard' },
    { name: 'Favorites', path: '/favorites' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled 
          ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 shadow-lg py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-2 rounded-xl text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              Roam Radar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-blue-400 relative py-2',
                      location.pathname === link.path ? 'text-blue-400' : 'text-slate-300'
                    )}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="hidden lg:flex">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 ml-2">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    location.pathname === link.path 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center mt-2 text-slate-400">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
