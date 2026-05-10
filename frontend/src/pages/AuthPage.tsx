import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2,
  Phone, MapPin, Globe, ShieldCheck, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

type Step = 'auth' | 'otp' | 'forgot-password' | 'reset-password';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Other'
];

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<Step>('auth');
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ detail: 'Login failed' }));
          throw new Error(errData.detail || 'Invalid email or password');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      } else {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            mobile_number: mobile,
            city,
            country,
            additional_details: additionalDetails,
          }),

        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ detail: 'Registration failed' }));
          throw new Error(errData.detail || 'Registration failed');
        }

        setPendingEmail(email);
        setIsLogin(true);
        setSuccess('Registration successful! You can now log in with your credentials.');

      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp_code: otpCode }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Verification failed' }));
        throw new Error(errData.detail || 'Verification failed');
      }

      setSuccess('🎉 Email verified! You can now log in.');
      setTimeout(() => {
        setStep('auth');
        setIsLogin(true);
        setOtp(['', '', '', '', '', '']);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/resend-otp?email=${encodeURIComponent(pendingEmail)}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to resend OTP');
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Failed to send reset OTP' }));
        throw new Error(errData.detail || 'User not found.');
      }
      
      setPendingEmail(email);
      setStep('reset-password');
      setSuccess('Reset OTP sent! Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: pendingEmail, 
          otp_code: otpCode, 
          new_password: newPassword 
        }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Reset failed' }));
        throw new Error(errData.detail || 'Reset failed');
      }
      
      setSuccess('🎉 Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        setStep('auth');
        setIsLogin(true);
        setOtp(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-400/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 relative z-10">
        
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop"
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">RoamRadar</span>
          </div>

          <div className="relative z-10 space-y-4">
            <motion.h2
              key={step === 'otp' ? 'otp' : isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl font-black leading-tight tracking-tighter"
            >
              {step === 'otp'
                ? 'Almost there...'
                : step === 'forgot-password' || step === 'reset-password'
                ? 'Reset your password'
                : isLogin
                ? 'Welcome back, explorer.'
                : 'Start your journey today.'}
            </motion.h2>
            <p className="text-slate-400 text-base leading-relaxed">
              {step === 'otp'
                ? 'Check your inbox for the OTP we sent you.'
                : step === 'forgot-password'
                ? 'Enter your email to receive a reset code.'
                : step === 'reset-password'
                ? 'Use the 6-digit code to set a new password.'
                : 'The smartest way to plan, budget, and experience multi-city travel.'}
            </p>
            {step === 'otp' && (
              <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3 text-blue-300 text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>OTP sent to <strong className="text-white">{pendingEmail}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 flex flex-col justify-center overflow-y-auto max-h-screen">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <Compass className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">RoamRadar</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── OTP Step ── */}
            {step === 'otp' ? (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500/10 p-2.5 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verify Email</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Enter the 6-digit code sent to <span className="font-bold text-slate-700 dark:text-slate-300">{pendingEmail}</span>
                </p>

                {/* Alerts */}
                <AnimatePresence>
                  {(error || success) && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`mb-5 p-3 rounded-xl flex items-start gap-2 text-sm ${
                        success
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <p>{success || error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Boxes */}
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 dark:text-white transition-all"
                      />
                    ))}
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Verify & Activate
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <p className="text-sm text-slate-500">Didn't receive the code?</p>
                  <button
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="flex items-center gap-2 mx-auto text-blue-500 hover:text-blue-600 font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                    <button
                    onClick={() => { setStep('auth'); setError(null); setSuccess(null); }}
                    className="block mx-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ← Back to registration
                  </button>
                </div>
              </motion.div>
            ) : step === 'forgot-password' ? (
              /* ── Forgot Password Step ── */
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-2">
                   <div className="bg-blue-500/10 p-2.5 rounded-xl">
                      <RefreshCw className="w-6 h-6 text-blue-500" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Forgot Password</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Don't worry! Enter your email and we'll send you a code to reset your password.
                </p>

                <AnimatePresence>
                  {(error || success) && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`mb-5 p-3 rounded-xl flex items-start gap-2 text-sm ${
                        success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                       <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                       <p>{success || error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" placeholder="alex@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                     </div>
                   </div>
                   <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl" disabled={isLoading}>
                      {isLoading ? 'Sending Code...' : 'Send Reset OTP'}
                   </Button>
                </form>

                <button
                  onClick={() => { setStep('auth'); setError(null); setSuccess(null); }}
                  className="block mx-auto mt-6 text-sm font-bold text-blue-500 hover:text-blue-600"
                >
                  ← Back to Sign In
                </button>
              </motion.div>
            ) : step === 'reset-password' ? (
              /* ── Reset Password Step ── */
              <motion.div
                key="reset-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-2">
                   <div className="bg-blue-500/10 p-2.5 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-blue-500" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Set New Password</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Enter the 6-digit code and your new password.
                </p>

                <AnimatePresence>
                  {(error || success) && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`mb-5 p-3 rounded-xl flex items-start gap-2 text-sm ${
                        success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                       <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                       <p>{success || error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* OTP Boxes */}
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="password" placeholder="••••••••" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="password" placeholder="••••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </motion.div>
            ) : (
              /* ── Auth Step ── */
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
                  {isLogin ? 'Welcome back! Enter your credentials.' : 'Fill in the details below to get started.'}
                </p>

                {/* Alerts */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-4 p-3 rounded-xl flex items-start gap-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleAuth} className="space-y-3">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Alex Wander" required={!isLogin} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                          </div>
                        </div>

                        {/* Mobile */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" placeholder="+91 9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputClass} />
                          </div>
                        </div>

                        {/* City & Country */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">City</label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input type="text" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Country</label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass + " cursor-pointer"}>
                                <option value="">Select...</option>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Additional Details</label>
                          <div className="relative">
                            <ArrowRight className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <textarea 
                              placeholder="Tell us about your travel preferences..." 
                              value={additionalDetails} 
                              onChange={(e) => setAdditionalDetails(e.target.value)} 
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 text-sm min-h-[100px]"
                            />
                          </div>
                        </div>
                      </motion.div>

                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="alex@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                      {isLogin && (
                        <button 
                          type="button"
                          onClick={() => { setStep('forgot-password'); setError(null); setSuccess(null); }}
                          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl group" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isLogin ? 'Sign In' : 'Create Account & Send OTP'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={switchMode} className="text-blue-500 hover:text-blue-600 font-bold">
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
