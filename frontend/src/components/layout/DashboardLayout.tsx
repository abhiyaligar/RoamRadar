import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LayoutDashboard, Compass, Heart, Settings, Map, LogOut, CheckSquare, BookOpen, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Trips', icon: Map, path: '/trips' },
    { name: 'Explore Cities', icon: Compass, path: '/explore' },
    { name: 'Community', icon: Globe, path: '/community' },
    { name: 'Saved Trips', icon: Heart, path: '/favorites' },
    { name: 'Checklist', icon: CheckSquare, path: '/checklist' },
    { name: 'Journal', icon: BookOpen, path: '/notes' },
    { name: 'Settings', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      
      <div className="flex flex-grow pt-20 h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Travel Planner</h2>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full lg:max-w-[calc(100vw-16rem)] overflow-y-auto bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-0">
          <div className="p-4 md:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 safe-area-pb">
        <nav className="flex justify-around items-center">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
            { name: 'Trips', icon: Map, path: '/trips' },
            { name: 'Explore', icon: Compass, path: '/explore' },
            { name: 'Profile', icon: Settings, path: '/profile' },
          ].map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-xl transition-all',
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-2" : "stroke-[1.5]")} />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
