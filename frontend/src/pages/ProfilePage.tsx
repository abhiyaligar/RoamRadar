import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Award, Edit2, Shield, Settings, Bell, Heart, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { USER_PROFILE } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">User Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Settings Navigation */}
        <div className="space-y-6">
          <Card className="p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-sky-400"></div>
            
            <div className="relative mt-8 mb-4">
              <img 
                src={USER_PROFILE.avatar} 
                alt={USER_PROFILE.name} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 mx-auto object-cover relative z-10"
              />
              <button className="absolute bottom-0 right-[50%] translate-x-[45px] z-20 bg-blue-500 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{USER_PROFILE.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{USER_PROFILE.username}</p>
            
            <div className="flex justify-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{USER_PROFILE.stats.countries}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Countries</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{USER_PROFILE.stats.trips}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Trips</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{USER_PROFILE.stats.photos}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Photos</span>
              </div>
            </div>
            
            <div className="pt-6">
              <Button 
                variant={isEditing ? "outline" : "primary"} 
                className="w-full"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <nav className="space-y-1">
              {[
                { icon: Settings, label: 'General Settings', active: true },
                { icon: Shield, label: 'Privacy & Security', active: false },
                { icon: Bell, label: 'Notifications', active: false },
                { icon: Heart, label: 'Saved Preferences', active: false },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={idx}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </nav>
          </Card>
        </div>

        {/* Right Column: Details & Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {USER_PROFILE.badges.map((badge, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50 px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span className="font-semibold text-amber-800 dark:text-amber-400 text-sm">{badge}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Personal Information Form */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.name}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.username}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex.wander@example.com"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      defaultValue="San Francisco, CA"
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                <textarea 
                  rows={4}
                  disabled={!isEditing}
                  defaultValue="Adventure seeker, photography enthusiast, and lover of distinct cultures. Always looking for the next hidden gem."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white resize-none"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
