import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, ShieldCheck, Store } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Shop', action: 'shop' },
  { label: 'Our Story', action: 'story' },
  { label: 'Ingredients', action: 'ingredients' },
  { label: 'Journal', action: 'journal' },
];

export default function Navbar() {
  const {
    currentRole, switchRole, currentView, setCurrentView,
    cart, setIsCartOpen, searchQuery, setSearchQuery,
    navigateToShop, products, openProductDetail, categories,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const isHero = currentView === 'home';

  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleNavAction = (action) => {
    setMobileOpen(false);
    if (action === 'shop') navigateToShop();
    else if (action === 'story') { setCurrentView('home'); setTimeout(() => { (document.getElementById('philosophy-section') || document.getElementById('collection-heading'))?.scrollIntoView({ behavior: 'smooth' }); }, 100); }
    else if (action === 'ingredients') { setCurrentView('home'); setTimeout(() => { document.getElementById('ingredient-story')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }
    else navigateToShop();
  };

  const transparent = isHero && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          transparent ? 'nav-transparent' : 'nav-solid'
        }`}
        style={{ height: scrolled ? '60px' : '72px' }}
      >
        <div className="container-editorial h-full flex items-center justify-between gap-6">

          {/* LOGO */}
          <button
            onClick={() => { setCurrentView('home'); if (currentRole !== 'customer') switchRole('customer'); }}
            className="flex items-center gap-3 shrink-0 group cursor-pointer"
            aria-label="Ammikallu Home"
          >
            <div className={`transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`}>
              <img src="/logo.png" alt="Ammikallu" className="w-auto h-full object-contain" />
            </div>
            <div className={`transition-all duration-300 ${transparent ? 'text-white' : 'text-[#171714]'}`}>
              <span className={`font-serif block leading-none transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                Ammikallu
              </span>
              <span className={`label block mt-0.5 transition-all duration-300 ${
                transparent ? 'text-white/60' : 'text-[#68645B]'
              } ${scrolled ? 'text-[9px]' : 'text-[10px]'}`}>
                Heritage Stone-Ground
              </span>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavAction(item.action)}
                className={`label cursor-pointer transition-colors duration-300 hover:opacity-100 ${
                  transparent ? 'text-white/75 hover:text-white' : 'text-[#68645B] hover:text-[#171714]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 cursor-pointer transition-colors duration-300 ${
                transparent ? 'text-white/80 hover:text-white' : 'text-[#68645B] hover:text-[#171714]'
              }`}
              aria-label="Search"
              id="nav-search-btn"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            {/* Account */}
            <button
              onClick={() => currentRole === 'customer' ? setCurrentView('account') : setCurrentView('seller-dashboard')}
              className={`p-2.5 cursor-pointer transition-colors duration-300 ${
                transparent ? 'text-white/80 hover:text-white' : 'text-[#68645B] hover:text-[#171714]'
              }`}
              aria-label="Account"
              id="nav-account-btn"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            {/* Cart */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-300 ${
                  transparent
                    ? 'border border-white/40 text-white hover:bg-white/10'
                    : 'border border-[#DDD7CA] text-[#171714] hover:bg-[#171714] hover:text-white hover:border-[#171714]'
                }`}
                aria-label={`Cart (${cartCount} items)`}
                id="nav-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                <span className="label text-[10px] hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A63D2F] text-white text-[10px] font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Role switcher (dev tool) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setRoleDropOpen(!roleDropOpen)}
                className={`flex items-center gap-1.5 p-2 cursor-pointer transition-colors duration-300 ${
                  transparent ? 'text-white/50 hover:text-white/80' : 'text-[#DDD7CA] hover:text-[#68645B]'
                }`}
                title="Switch role"
              >
                <span className="label text-[9px]">{currentRole}</span>
                <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
              </button>
              {roleDropOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-[#171714] border border-white/10 shadow-warm-xl z-50 py-2 animate-fade-in"
                  onMouseLeave={() => setRoleDropOpen(false)}
                >
                  {[
                    { role: 'customer', label: 'Customer View', icon: '🛍️' },
                    { role: 'seller', label: 'Seller Studio', icon: '👩‍🍳' },
                    { role: 'admin', label: 'Admin Console', icon: '⚙️' },
                  ].map(r => (
                    <button
                      key={r.role}
                      onClick={() => { switchRole(r.role); setRoleDropOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors cursor-pointer ${
                        currentRole === r.role ? 'text-[#C99518]' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span className="label text-[10px]">{r.label}</span>
                      {currentRole === r.role && <span className="ml-auto text-[9px] text-[#C99518]/60">active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 cursor-pointer transition-colors duration-300 ${
                transparent ? 'text-white' : 'text-[#171714]'
              }`}
              aria-label="Menu"
              id="nav-mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* SEARCH BAR — full width dropdown */}
        <div
          className={`absolute left-0 right-0 bg-[#F5F1E8] border-t border-[#DDD7CA] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            searchOpen ? 'top-full opacity-100 pointer-events-auto' : 'top-full opacity-0 pointer-events-none -translate-y-2'
          }`}
        >
          <div className="container-editorial py-5">
            <div className="relative flex items-center gap-4">
              <Search className="w-4 h-4 text-[#68645B] shrink-0" strokeWidth={1.5} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search turmeric, chilli, pepper, rusks..."
                className="flex-1 bg-transparent text-[#171714] text-base outline-none placeholder:text-[#DDD7CA]"
                aria-label="Search products"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-[#68645B] hover:text-[#171714] cursor-pointer">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 border-t border-[#DDD7CA] pt-4 grid gap-3">
                {searchResults.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => { openProductDetail(prod); setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-4 text-left group cursor-pointer"
                  >
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#171714] truncate group-hover:text-[#A63D2F] transition-colors">{prod.name}</p>
                      <p className="label text-[10px] text-[#68645B] mt-0.5">₹{prod.salePrice || prod.price}</p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => { navigateToShop(); setSearchOpen(false); setSearchQuery(''); }}
                  className="label text-[10px] text-[#A63D2F] pt-2 border-t border-[#DDD7CA] text-left cursor-pointer hover:text-[#171714] transition-colors"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-[#F5F1E8] border-l border-[#DDD7CA] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDD7CA]">
              <span className="font-serif text-xl">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 cursor-pointer"><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <nav className="flex-1 px-6 py-8 flex flex-col gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNavAction(item.action)}
                  className="text-left py-3 border-b border-[#DDD7CA]/50 font-serif text-2xl text-[#171714] hover:text-[#A63D2F] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="px-6 pb-8 space-y-3">
              <button
                onClick={() => { switchRole('seller'); setMobileOpen(false); }}
                className="w-full btn-outline-dark text-center justify-center"
              >
                Sell with us
              </button>
              <div className="flex gap-2">
                {['customer','seller','admin'].map(r => (
                  <button key={r} onClick={() => { switchRole(r); setMobileOpen(false); }}
                    className={`flex-1 py-2 label text-[10px] border cursor-pointer transition-colors ${
                      currentRole === r ? 'bg-[#171714] text-white border-[#171714]' : 'border-[#DDD7CA] text-[#68645B] hover:border-[#171714]'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
