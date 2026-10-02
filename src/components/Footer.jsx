import React from 'react';
import { useApp } from '../context/AppContext';

const SHOP_LINKS = [
  { label: 'Kasargod Turmeric Powder (മഞ്ഞൾപ്പൊടി)', cat: 'curry-powder' },
  { label: 'Stone-Ground Curry Powders', cat: 'curry-powder' },
  { label: 'Cold-Pounded Kashmiri Chilli', cat: 'curry-powder' },
  { label: 'Tellicherry Black Pepper', cat: 'curry-powder' },
  { label: 'Heritage Sambar & Rasam Podi', cat: 'curry-powder' },
];

const ABOUT_LINKS = [
  'Our Story',
  'Ingredient Standards',
  'Artisan Verification',
  'Sustainability',
  'Journal',
];

const POLICY_LINKS = [
  'Privacy Policy',
  'Terms of Service',
  'Artisan Guidelines',
  'FSSAI Compliance',
  'Returns & Refunds',
];

export default function Footer() {
  const { navigateToShop, setCurrentView } = useApp();

  return (
    <footer
      className="bg-[#171714] text-[#F5F1E8]"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* ── Main footer columns ───────────────────────────── */}
      <div className="container-editorial py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 overflow-hidden">
                <img src="/logo.png" alt="Ammikallu" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-xl text-white block leading-none">Ammikallu</span>
                <span className="label text-[9px] text-[#C99518]/70 block mt-0.5">Heritage Stone-Ground</span>
              </div>
            </div>
            <p className="text-sm text-[#F5F1E8]/50 leading-relaxed max-w-xs mb-8">
              Connecting food lovers with passionate local Kerala home bakers and food creators. Rooted in authentic recipes, stone-ground spices, and traditional kitchen heritage.
            </p>
            <div className="flex items-center gap-4 text-[#F5F1E8]/30">
              <span className="label text-[10px]">100% Homemade</span>
              <span className="text-[#F5F1E8]/15">·</span>
              <span className="label text-[10px]">FSSAI Verified</span>
              <span className="text-[#F5F1E8]/15">·</span>
              <span className="label text-[10px]">Kerala</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <span className="label text-[10px] text-[#F5F1E8]/30 block mb-6">Shop</span>
            <ul className="space-y-3">
              {SHOP_LINKS.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateToShop(link.cat)}
                    className="text-sm text-[#F5F1E8]/55 hover:text-[#F5F1E8] transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <span className="label text-[10px] text-[#F5F1E8]/30 block mb-6">About</span>
            <ul className="space-y-3">
              {ABOUT_LINKS.map(link => (
                <li key={link}>
                  <span className="text-sm text-[#F5F1E8]/55 hover:text-[#F5F1E8] transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="label text-[10px] text-[#F5F1E8]/30 block mb-6">Contact</span>
            <ul className="space-y-3 mb-8">
              <li>
                <span className="label text-[10px] text-[#F5F1E8]/30 block mb-1">Helpdesk</span>
                <a href="tel:+919846011223" className="text-sm text-[#F5F1E8]/55 hover:text-[#F5F1E8] transition-colors">
                  +91 98460 11223
                </a>
              </li>
              <li>
                <span className="label text-[10px] text-[#F5F1E8]/30 block mb-1">Email</span>
                <a href="mailto:ruchi@ammikkallu.in" className="text-sm text-[#F5F1E8]/55 hover:text-[#F5F1E8] transition-colors">
                  ruchi@ammikkallu.in
                </a>
              </li>
              <li>
                <span className="label text-[10px] text-[#F5F1E8]/30 block mb-2">Payment</span>
                <div className="flex items-center gap-2">
                  {['UPI', 'GPay', 'COD'].map(p => (
                    <span key={p} className="label text-[9px] text-[#F5F1E8]/40 border border-white/10 px-2 py-1">{p}</span>
                  ))}
                </div>
              </li>
            </ul>

            {/* Social */}
            <div>
              <span className="label text-[10px] text-[#F5F1E8]/30 block mb-3">Instagram</span>
              <a
                href="https://instagram.com/ammikkallu"
                target="_blank"
                rel="noopener noreferrer"
                className="label text-[11px] text-[#F5F1E8]/55 hover:text-[#F5F1E8] transition-colors"
              >
                @ammikkallu →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container-editorial py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="label text-[10px] text-[#F5F1E8]/30">
            © 2026 Ammikallu Heritage Foods. Handcrafted with pride in Kerala.
          </p>
          <div className="flex items-center gap-6">
            {POLICY_LINKS.slice(0, 3).map(link => (
              <span key={link} className="label text-[10px] text-[#F5F1E8]/30 hover:text-[#F5F1E8]/70 cursor-pointer transition-colors">
                {link}
              </span>
            ))}
            <button
              onClick={() => setCurrentView('auth')}
              className="label text-[10px] text-[#F5F1E8]/35 hover:text-[#C99518] cursor-pointer transition-colors"
            >
              Sign In / Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
