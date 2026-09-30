import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-[#526B3A] text-white',
    error: 'bg-[#B85C38] text-white',
    warning: 'bg-[#C99A2E] text-white',
    info: 'bg-[#171714] text-[#F7F2E8]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-medium ${
          bgColors[toast.type] || bgColors.info
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />}
        {toast.type === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-amber-200" />}
        {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#C99A2E]" />}

        <span>{toast.message}</span>

        <button
          onClick={onClose}
          className="ml-2 hover:opacity-75 p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
