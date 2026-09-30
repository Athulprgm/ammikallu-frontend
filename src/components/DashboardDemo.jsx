import React from 'react';
import { UserCheck, LogOut, RotateCcw, Shield, CheckCircle2, Key, Bell } from 'lucide-react';

export default function DashboardDemo({ user, onLogout, onTriggerLoading }) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-6 shadow-luxury border border-white/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sand-dark/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-espresso-900 text-[#E5DAC8] flex items-center justify-center font-bold text-xl shadow-md">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
                  Welcome, {user.name || 'Member'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Authenticated
                </span>
              </div>
              <p className="text-xs sm:text-sm text-espresso-800/70 mt-0.5 font-mono">
                {user.email || 'alexander.v@aura.io'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerLoading}
              className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#FAF6F0] text-espresso-900 rounded-xl text-xs font-semibold border border-sand-dark/60 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Test #E5DAC8 Loader</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-espresso-900 hover:bg-espresso-950 text-[#E5DAC8] rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-terracotta-500/10 text-terracotta-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-espresso-800/60 uppercase">Security Score</div>
              <div className="text-base font-bold text-espresso-900">98% — Excellent</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gold-500/10 text-gold-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-espresso-800/60 uppercase">2FA Status</div>
              <div className="text-base font-bold text-espresso-900">Hardware Key Active</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-espresso-800/60 uppercase">Active Session</div>
              <div className="text-base font-bold text-espresso-900">Windows · Chrome</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-panel rounded-2xl p-5 border border-white/80 text-xs text-espresso-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-terracotta-500 shrink-0" />
          <span>
            You have successfully tested the React + Tailwind login workflow built over the <strong className="text-espresso-900">#E5DAC8</strong> sand color baseline.
          </span>
        </div>
        <button
          onClick={onLogout}
          className="text-espresso-900 font-semibold underline underline-offset-2 shrink-0 hover:text-terracotta-600"
        >
          Return to Login Section
        </button>
      </div>
    </div>
  );
}
