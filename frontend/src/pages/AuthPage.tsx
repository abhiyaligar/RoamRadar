import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

    try {
      if (isLogin) {
        // Login: POST /api/v1/auth/token using OAuth2PasswordRequestForm
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const errData = JSON.parse(text);
            throw new Error(errData.detail || 'Invalid email or password');
          } catch (e) {
            throw new Error('Server unavailable or failed to connect.', { cause: e });
          }
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');

      } else {
        // Registration: POST /api/v1/auth/register
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const errData = JSON.parse(text);
            throw new Error(errData.detail || 'Registration failed');
          } catch (e) {
            throw new Error('Server unavailable or failed to connect.', { cause: e });
          }
        }

        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-400/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 relative z-10">
        
        {/* Left Side: Animated Brand/Image Panel */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop" 
            alt="Travel Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Roam Radar</span>
          </div>

          <div className="relative z-10">
            <motion.h2 
              key={isLogin ? 'login-text' : 'signup-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold leading-tight mb-4"
            >
              {isLogin ? "Welcome back to your adventures." : "Start your journey with us today."}
            </motion.h2>
            <p className="text-slate-300 text-lg">
              The smartest way to plan, budget, and experience your multi-city travels.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Compass className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Roam Radar</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center md:text-left">
            {isLogin ? 'Sign In' : 'Create an Account'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-center md:text-left">
            {isLogin ? 'Enter your details to access your trips.' : 'Enter your details to get started.'}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  error.includes('successful') 
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Alex Wander" 
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="alex@example.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && <a href="#" className="text-xs text-blue-500 hover:text-blue-600 font-medium">Forgot Password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-6 group" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center w-full">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="w-full">
                Continue with Github
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
