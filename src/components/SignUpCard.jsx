import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

export default function SignUpCard({ onSwitchTab, onLoginSuccess, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate password strength score 0-4
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-600'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!agreed) newErrors.agreed = 'You must accept the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete all required fields', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Account created successfully!', 'success');
      onLoginSuccess({ email, name });
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          New Membership
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso-900 font-bold tracking-tight">
          Create Aura Account
        </h2>
        <p className="text-xs sm:text-sm text-espresso-800/70 mt-1">
          Join thousands of designers & creators building with luxury aesthetic apps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Victoria Sterling"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                errors.name ? 'border-rose-500 bg-rose-50/40' : ''
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="victoria@luxury.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                errors.email ? 'border-rose-500 bg-rose-50/40' : ''
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                errors.password ? 'border-rose-500 bg-rose-50/40' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50 hover:text-espresso-900"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-espresso-800/80 mb-1">
                <span>Strength: {strengthLabels[strength - 1] || 'Too short'}</span>
                <span>{strength * 25}%</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-sand-dark/30 rounded-full overflow-hidden">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-colors duration-300 ${
                      step <= strength ? strengthColors[strength - 1] : 'bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}
          {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-espresso-900 border-sand-dark accent-espresso-900"
            />
            <span className="text-xs text-espresso-800/80 leading-snug">
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="underline text-espresso-900 font-medium">
                Terms of Service
              </a>{' '}
              and Privacy Policy.
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-rose-600 mt-0.5">{errors.agreed}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-espresso-900 hover:bg-espresso-950 text-[#E5DAC8] font-medium text-xs sm:text-sm rounded-xl shadow-luxury transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E5DAC8]" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs text-espresso-800/70">
        Already have an account?{' '}
        <button
          onClick={() => onSwitchTab('login')}
          className="font-semibold text-espresso-900 underline underline-offset-4 hover:text-terracotta-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
