import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail, Lock, Eye, EyeOff, User as UserIcon, ShieldCheck, ArrowRight,
  Loader2, AlertCircle, BadgeCheck
} from 'lucide-react';

/**
 * Flipkart/Amazon-style split auth screen.
 * Left: brand pitch panel. Right: tabbed login / signup / admin sign-in form.
 * Single fixed admin account; users self-register.
 */
export default function AuthScreen() {
  const { login, signup } = useApp();
  const [mode, setMode] = useState('user'); // 'user' | 'admin'
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const setField = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'admin') {
      if (!form.email.trim() || !form.password) {
        setError('Enter admin email and password');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        login(form.email, form.password); // context shows error toast on failure
      }, 500);
      return;
    }

    // User flow validation
    if (tab === 'signup' && !form.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (tab === 'signup') {
        signup(form.name.trim(), form.email, form.password);
      } else {
        login(form.email, form.password);
      }
    }, 500);
  };

  const switchTab = (next) => {
    setTab(next);
    setError('');
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const fillAdmin = () => {
    setForm({ name: '', email: 'admin@ammikallu.com', password: 'admin123' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white shadow-sm flex flex-col md:flex-row min-h-[560px]">

        {/* Left brand panel (Flipkart-style) */}
        <div className="md:w-[38%] bg-[#A63D2F] text-[#F5F1E8] p-8 md:p-10 flex flex-col">
          <h1 className="font-serif text-3xl md:text-4xl leading-tight">
            Login
          </h1>
          <p className="text-sm mt-4 leading-relaxed text-white/85">
            Get access to your Orders, Wishlist and Recommendations — authentic
            Kerala spices &amp; home-baked snacks, delivered fresh.
          </p>

          <div className="mt-auto pt-10 hidden md:block space-y-4">
            {[
              '100% stone-ground, single-origin spices',
              'Free delivery across Kerala on ₹600+',
              'Cash on Delivery available'
            ].map(line => (
              <div key={line} className="flex items-start gap-2.5 text-xs text-white/80">
                <BadgeCheck className="w-4 h-4 text-[#C99518] shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">

          {/* User / Admin segmented toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F3F6] mb-8" role="tablist" aria-label="Account type">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'user'}
              onClick={() => switchMode('user')}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'user'
                  ? 'bg-white text-[#171714] shadow-sm'
                  : 'text-[#68645B] hover:text-[#171714]'
              }`}
            >
              <UserIcon className="w-4 h-4" strokeWidth={1.5} />
              Customer
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'admin'}
              onClick={() => switchMode('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'admin'
                  ? 'bg-white text-[#171714] shadow-sm'
                  : 'text-[#68645B] hover:text-[#171714]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              Admin
            </button>
          </div>

          {mode === 'user' ? (
            <>
              {/* User tabs */}
              <div className="flex gap-6 mb-6 border-b border-[#EEEBE3]">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px ${
                    tab === 'login'
                      ? 'text-[#A63D2F] border-[#A63D2F]'
                      : 'text-[#68645B] border-transparent hover:text-[#171714]'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px ${
                    tab === 'signup'
                      ? 'text-[#A63D2F] border-[#A63D2F]'
                      : 'text-[#68645B] border-transparent hover:text-[#171714]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </>
          ) : (
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-[#171714]">Admin Sign In</h2>
              <p className="text-xs text-[#68645B] mt-1">
                Single platform administrator console access.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {mode === 'user' && tab === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-semibold uppercase tracking-wider text-[#68645B] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BFB2]" />
                  <input
                    id="auth-name"
                    type="text"
                    value={form.name}
                    onChange={setField('name')}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-[#DDD7CA] text-sm text-[#171714] outline-none focus:border-[#A63D2F] focus:bg-white transition-colors placeholder:text-[#C4BFB2]"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold uppercase tracking-wider text-[#68645B] mb-1.5">
                {mode === 'admin' ? 'Admin Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BFB2]" />
                <input
                  id="auth-email"
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  placeholder={mode === 'admin' ? 'admin@ammikallu.com' : 'name@example.com'}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-[#DDD7CA] text-sm text-[#171714] outline-none focus:border-[#A63D2F] focus:bg-white transition-colors placeholder:text-[#C4BFB2]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold uppercase tracking-wider text-[#68645B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BFB2]" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={setField('password')}
                  placeholder="Minimum 6 characters"
                  autoComplete={mode === 'user' && tab === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-10 py-3 bg-[#FAFAFA] border border-[#DDD7CA] text-sm text-[#171714] outline-none focus:border-[#A63D2F] focus:bg-white transition-colors placeholder:text-[#C4BFB2]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4BFB2] hover:text-[#171714] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-[#A63D2F] bg-[#A63D2F]/5 border border-[#A63D2F]/20 px-3 py-2.5" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#A63D2F] hover:bg-[#8F3326] disabled:opacity-70 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'admin'
                      ? 'Sign in to Admin Console'
                      : tab === 'signup'
                        ? 'Create Account'
                        : 'Login'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'user' ? (
            <p className="mt-6 text-xs text-[#68645B] text-center">
              {tab === 'login' ? "New to Ammikallu? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
                className="font-semibold text-[#A63D2F] hover:underline cursor-pointer"
              >
                {tab === 'login' ? 'Create an account' : 'Login instead'}
              </button>
            </p>
          ) : (
            <div className="mt-6 flex items-center justify-between text-xs">
              <span className="text-[#68645B] font-mono">admin@ammikallu.com / admin123</span>
              <button
                type="button"
                onClick={fillAdmin}
                className="font-semibold text-[#A63D2F] hover:underline cursor-pointer"
              >
                Fill credentials
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
