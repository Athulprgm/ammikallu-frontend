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
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-black/5 text-[#A63D2F] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
          New Patron
        </span>
        <h2 className="font-serif text-3xl sm:text-[40px] text-[#171714] font-medium tracking-tight leading-none mb-2">
          Create Account
        </h2>
        <p className="text-sm text-[#68645B]">
          Join to discover authentic heritage spices and home bakes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#171714] mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/30" strokeWidth={1.5} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meera Nair"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium bg-[#F9F9F9] border ${
                errors.name ? 'border-[#A63D2F] bg-red-50/40' : 'border-black/5 focus:border-[#171714] focus:bg-white'
              } text-[#171714] placeholder:text-black/30 transition-all outline-none shadow-inner`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-[#A63D2F] font-semibold mt-1.5">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#171714] mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/30" strokeWidth={1.5} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="meera@example.com"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium bg-[#F9F9F9] border ${
                errors.email ? 'border-[#A63D2F] bg-red-50/40' : 'border-black/5 focus:border-[#171714] focus:bg-white'
              } text-[#171714] placeholder:text-black/30 transition-all outline-none shadow-inner`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-[#A63D2F] font-semibold mt-1.5">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#171714] mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/30" strokeWidth={1.5} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`w-full pl-11 pr-11 py-3.5 rounded-xl text-sm font-medium bg-[#F9F9F9] border ${
                errors.password ? 'border-[#A63D2F] bg-red-50/40' : 'border-black/5 focus:border-[#171714] focus:bg-white'
              } text-[#171714] placeholder:text-black/30 transition-all outline-none shadow-inner`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#171714] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#68645B] mb-2">
                <span>Strength: {strengthLabels[strength - 1] || 'Too short'}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-colors duration-300 ${
                      step <= strength 
                        ? step === 1 ? 'bg-[#A63D2F]' 
                        : step === 2 ? 'bg-[#C99518]' 
                        : step === 3 ? 'bg-[#46513A]' 
                        : 'bg-[#171714]'
                        : 'bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}
          {errors.password && <p className="text-[11px] text-[#A63D2F] font-semibold mt-1.5">{errors.password}</p>}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              agreed ? 'bg-[#171714] border-[#171714]' : 'border-black/20 group-hover:border-black/40 bg-transparent'
            }`}>
              {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <span className="text-xs text-[#68645B] leading-snug">
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="underline text-[#171714] font-semibold">
                Terms of Service
              </a>{' '}
              and Privacy Policy.
            </span>
          </label>
          {errors.agreed && <p className="text-[11px] text-[#A63D2F] font-semibold mt-1.5 pl-7">{errors.agreed}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-[#171714] hover:bg-[#A63D2F] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(166,61,47,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 mt-6 cursor-pointer disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center text-xs text-[#68645B]">
        Already have an account?{' '}
        <button
          onClick={() => onSwitchTab('login')}
          className="font-bold text-[#171714] hover:text-[#A63D2F] underline underline-offset-4 transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
