import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordCard({ onSwitchTab, showToast }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Reset instructions sent to your inbox', 'success');
    }, 1200);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => onSwitchTab('login')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-800/70 hover:text-espresso-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Sign In</span>
      </button>

      {!isSubmitted ? (
        <>
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-espresso-900 font-bold tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs sm:text-sm text-espresso-800/70 mt-1">
              Enter the email associated with your account and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-900 mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-800/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm font-medium glass-input text-espresso-900 placeholder:text-espresso-900/40 ${
                    error ? 'border-rose-500 bg-rose-50/40' : ''
                  }`}
                />
              </div>
              {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-espresso-900 hover:bg-espresso-950 text-[#E5DAC8] font-medium text-xs sm:text-sm rounded-xl shadow-luxury transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5DAC8]" />
                  <span>Dispatching Link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Email</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">Check Your Inbox</h3>
          <p className="text-xs sm:text-sm text-espresso-800/70 mb-6 leading-relaxed max-w-sm mx-auto">
            We have sent password reset instructions to{' '}
            <span className="font-semibold text-espresso-900">{email}</span>.
          </p>

          <button
            onClick={() => onSwitchTab('login')}
            className="px-6 py-2.5 bg-espresso-900 text-[#E5DAC8] font-medium text-xs rounded-xl shadow-md hover:bg-espresso-950 transition-colors"
          >
            Return to Login
          </button>
        </div>
      )}
    </div>
  );
}
