import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

export default function TwoFactorCard({ onSwitchTab, onLoginSuccess, showToast }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      showToast('Please enter all 6 digits', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('2FA Authenticated Successfully!', 'success');
      onLoginSuccess({ email: 'alexander.v@aura.io', name: 'Alexander Vance' });
    }, 1200);
  };

  const handleResend = () => {
    showToast('New 6-digit code sent to your device', 'info');
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

      <div className="mb-6">
        <div className="w-12 h-12 rounded-full bg-terracotta-500/10 text-terracotta-600 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso-900 font-bold tracking-tight">
          Two-Factor Authentication
        </h2>
        <p className="text-xs sm:text-sm text-espresso-800/70 mt-1">
          Enter the 6-digit security code sent to your registered authenticator app or phone ending in <span className="font-semibold text-espresso-900">•4821</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6 Digit PIN Boxes */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl rounded-xl glass-input text-espresso-900 focus:scale-105 transition-all shadow-sm"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-espresso-900 hover:bg-espresso-950 text-[#E5DAC8] font-medium text-xs sm:text-sm rounded-xl shadow-luxury transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E5DAC8]" />
              <span>Verifying Token...</span>
            </>
          ) : (
            <span>Verify & Access Portal</span>
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-xs text-espresso-800/70">
        <span>Didn't receive code?</span>
        <button
          type="button"
          onClick={handleResend}
          className="font-semibold text-espresso-900 hover:text-terracotta-600 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resend Code</span>
        </button>
      </div>
    </div>
  );
}
