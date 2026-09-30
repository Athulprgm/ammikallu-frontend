import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function LoginCard({ onSwitchTab, onLoginSuccess, showToast }) {
  const [email, setEmail] = useState('alexander.v@aura.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate authentication API call
    setTimeout(() => {
      setIsLoading(false);
      showToast('Logged in successfully!', 'success');
      onLoginSuccess({ email, name: 'Alexander Vance' });
    }, 1400);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Connected with ${provider}`, 'success');
      onLoginSuccess({ email: `user@${provider.toLowerCase()}.com`, name: 'Aura Member' });
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Card Header */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-terracotta-500/10 text-terracotta-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          Secure Portal
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso-900 font-bold tracking-tight">
          Sign In to Aura
        </h2>
        <p className="text-xs sm:text-sm text-espresso-800/70 mt-1">
          Welcome back! Enter your credentials to access your dashboard.
        </p>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/70 hover:bg-white border border-sand-dark/60 rounded-xl text-xs font-medium text-espresso-900 transition-all duration-200 hover:shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span className="hidden sm:inline">Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('Apple')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/70 hover:bg-white border border-sand-dark/60 rounded-xl text-xs font-medium text-espresso-900 transition-all duration-200 hover:shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.63-.77 1.06-1.84.94-2.92-.91.04-2.03.61-2.68 1.37-.58.67-1.09 1.77-.95 2.82 1.02.08 2.06-.5 2.69-1.27z"/>
          </svg>
          <span className="hidden sm:inline">Apple</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/70 hover:bg-white border border-sand-dark/60 rounded-xl text-xs font-medium text-espresso-900 transition-all duration-200 hover:shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-sand-dark/50 w-full"></div>
        <span className="bg-[#FAF7F2] px-3 text-[11px] uppercase tracking-wider text-espresso-800/60 font-semibold absolute">
          Or continue with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                errors.email ? 'border-rose-500 bg-rose-50/40' : ''
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900">
              Password
            </label>
            <button
              type="button"
              onClick={() => onSwitchTab('forgot')}
              className="text-xs font-medium text-terracotta-600 hover:text-terracotta-500 hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                errors.password ? 'border-rose-500 bg-rose-50/40' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50 hover:text-espresso-900 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>}
        </div>

        {/* Remember me & 2FA shortcut */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-espresso-900 focus:ring-espresso-900 border-sand-dark cursor-pointer accent-espresso-900"
            />
            <span className="text-xs font-medium text-espresso-800/80">Remember this device</span>
          </label>

          <button
            type="button"
            onClick={() => onSwitchTab('2fa')}
            className="flex items-center gap-1 text-xs text-espresso-800/60 hover:text-espresso-900 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-terracotta-500" />
            <span>2FA Code</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-espresso-900 hover:bg-espresso-950 text-[#E5DAC8] font-medium text-xs sm:text-sm rounded-xl shadow-luxury transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E5DAC8]" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs text-espresso-800/70">
        Don't have an account?{' '}
        <button
          onClick={() => onSwitchTab('signup')}
          className="font-semibold text-espresso-900 underline underline-offset-4 hover:text-terracotta-600 transition-colors"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
