import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Plus, Sparkles, ShoppingBag, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Animated section wrapper ──────────────────────────────── */
function Reveal({ children, delay = 0, className = '', type = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = type === 'clip' ? 'reveal-clip' : type === 'fade' ? 'reveal-fade' : 'reveal-up';

  return (
    <div
      ref={ref}
      className={`${cls} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Count-up number hook ──────────────────────────────────── */
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

/* ── Tilt card on mouse hover ──────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) scale(1.01)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ── Stat pillar with count-up ──────────────────────────────── */
function StatPillar({ fact, delay = 0 }) {
  const [count, ref] = useCountUp(fact.target);
  const display = fact.divisor && fact.divisor > 1
    ? (count / fact.divisor).toFixed(1)
    : count;
  return (
    <Reveal delay={delay} className="p-8 bg-[#F5F1E8] border-r border-[#DDD7CA] last:border-r-0">
      <span className="font-serif text-4xl text-[#171714] block mb-1" ref={ref}>
        {fact.prefix}{display}{fact.suffix}
      </span>
      <span className="label text-[10px] text-[#68645B] block mb-3">{fact.unit}</span>
      <p className="text-sm text-[#68645B] leading-relaxed">{fact.desc}</p>
    </Reveal>
  );
}

/* ── Dark Stat pillar with count-up ────────────────────────── */
function DarkStatPillar({ target, prefix = '', suffix = '', divisor = 1, label, color }) {
  const [count, ref] = useCountUp(target);
  const display = divisor && divisor > 1 ? (count / divisor).toFixed(1) : count;
  return (
    <div>
      <span className="font-serif text-3xl block mb-1" style={{ color }} ref={ref}>
        {prefix}{display}{suffix}
      </span>
      <span className="label text-[9px] text-[#F5F1E8]/40">{label}</span>
    </div>
  );
}

/* ── Section divider ───────────────────────────────────────── */
function SectionDivider() {

  return <div className="section-rule" aria-hidden="true" />;
}

/* ── Ingredient data ────────────────────────────────────────── */
const INGREDIENTS = [
  {
    name: 'Turmeric',
    origin: 'Kasargod, Kerala',
    desc: 'Single-origin Kasargod turmeric with curcumin content exceeding 5.6%. Sun-dried on reed mats, cold stone-ground at ambient temperature to preserve every volatile oil.',
    color: '#C99518',
    img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&q=90',
  },
  {
    name: 'Kashmiri Chilli',
    origin: 'Stone-ground in Kerala',
    desc: 'Vibrant Kashmiri chillies prized for their deep crimson colour and moderate heat. Stone-pounded slowly to release natural resins without destroying the delicate capsaicin structure.',
    color: '#A63D2F',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=90',
  },
  {
    name: 'Black Pepper',
    origin: 'Tellicherry, Kerala',
    desc: 'Tellicherry black pepper — the world\'s most revered variety. Harvested fully mature for maximum piperine content, then slow-ground on granite for an aroma that fills the room.',
    color: '#46513A',
    img: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1200&q=90',
  },
  {
    name: 'Cardamom',
    origin: 'Idukki, Kerala',
    desc: 'Green cardamom from Idukki\'s misty highlands. Each pod hand-sorted and stone-ground just before packing to capture the ephemeral floral esters that evaporate within hours of grinding.',
    color: '#46513A',
    img: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=1200&q=90',
  },
  {
    name: 'Cinnamon',
    origin: 'True Ceylon, Kerala processed',
    desc: 'True Ceylon cinnamon — not the impostor cassia. Paper-thin bark layers of delicate sweetness, cold-ground to a fine powder that dissolves into food rather than sitting atop it.',
    color: '#8B5E3C',
    img: 'https://images.unsplash.com/photo-1526369513998-4daeae2b6c0a?w=1200&q=90',
  },
];

/* ── Testimonials ───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "The turmeric genuinely changed the colour and aroma of everything I cooked. No supermarket powder comes close.",
    name: "Priya M.",
    location: "Bengaluru",
  },
  {
    quote: "I grew up in Kerala. This is the first time anything I ordered online actually tastes like home.",
    name: "Arun K.",
    location: "Dubai",
  },
  {
    quote: "The freshness is immediate the moment you open the packet. Stone-grinding really does make a difference.",
    name: "Meera R.",
    location: "Kochi",
  },
];

/* ════════════════════════════════════════════════════════════ */
export default function CustomerHome() {
  const { categories, products, sellers, navigateToShop, switchRole, addToCart, openProductDetail } = useApp();

  const [activeIngredient, setActiveIngredient] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('prod-mulaku-podi');
  const [featuredWeightIdx, setFeaturedWeightIdx] = useState(3); // Default to 1 Kg (usually index 3)
  const ingredientRef = useRef(null);

  const approvedProducts = products.filter(p => p.status === 'approved');
  const curryPowderProducts = approvedProducts.filter(p => p.categoryId === 'curry-powder' || p.categoryId === 'spices');
  const flagshipProducts = curryPowderProducts.length > 0 ? curryPowderProducts : approvedProducts.slice(0, 2);
  const featuredProduct = flagshipProducts.find(p => p.id === selectedProductId) || flagshipProducts[0] || approvedProducts[0];
  const collectionProducts = approvedProducts.filter(p => p.featured).slice(0, 6);
  const approvedSellers = sellers.filter(s => s.status === 'approved').slice(0, 3);

  const [showScrollPopup, setShowScrollPopup] = useState(false);
  const [popupMinimized, setPopupMinimized] = useState(false);

  const isChilli = featuredProduct?.id === 'prod-mulaku-podi';
  const isKurumulaku = featuredProduct?.id === 'prod-kurumulaku-podi';

  const featuredIdx = flagshipProducts.findIndex(p => p.id === featuredProduct?.id);
  const prevProduct = flagshipProducts[(featuredIdx - 1 + flagshipProducts.length) % flagshipProducts.length];
  const nextProduct = flagshipProducts[(featuredIdx + 1) % flagshipProducts.length];

  const getPopupImage = () => {
    if (featuredProduct?.id === 'prod-mulaku-podi') return "/mulaku-podi/select product-mulakupodi.png";
    if (featuredProduct?.id === 'prod-manjal-podi') return "/manjal podi/select product-manjalpodi.png";
    return "/kurumulaku podi/250g.png";
  };

  const featuredWeightOptions = featuredProduct?.weightOptions || [
    { weight: featuredProduct?.weight, price: featuredProduct?.price, salePrice: featuredProduct?.salePrice, image: featuredProduct?.image }
  ];
  const activeFeaturedOpt = featuredWeightOptions[featuredWeightIdx] || featuredWeightOptions[0];
  const featuredImg = activeFeaturedOpt?.image || featuredProduct?.image;
  const featuredCurrentPrice = activeFeaturedOpt?.salePrice || activeFeaturedOpt?.price;
  const featuredOriginalPrice = activeFeaturedOpt?.price;

  /* Scroll-triggered popup and product scrubbing */
  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById('philosophy-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      
      // Calculate progress through the section (0 = top reached, 1 = bottom reached)
      const scrollableDistance = rect.height - vh;
      if (scrollableDistance <= 0) return;
      
      const scrollProgress = -rect.top / scrollableDistance;

      // Show popup between 10% and 95% of the section's scroll
      if (scrollProgress > 0.1 && scrollProgress <= 0.95) {
        if (!popupMinimized) {
          setShowScrollPopup(true);
          
          // Scrub products based on scroll progress over the active window
          const scrubProgress = (scrollProgress - 0.1) / 0.85;
          
          let targetIndex = 0;
          if (scrubProgress > 0.33 && scrubProgress <= 0.66) {
            targetIndex = 1;
          } else if (scrubProgress > 0.66) {
            targetIndex = 2;
          }
          
          if (flagshipProducts[targetIndex]) {
            setSelectedProductId((prev) => {
              const nextId = flagshipProducts[targetIndex].id;
              return prev !== nextId ? nextId : prev;
            });
          }
        }
      } else {
        setShowScrollPopup(false);
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [popupMinimized, flagshipProducts]);

  /* Ingredient scroll section */
  useEffect(() => {
    const el = ingredientRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollH = el.offsetHeight - window.innerHeight;
      if (scrollH <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollH));
      setActiveIngredient(Math.min(INGREDIENTS.length - 1, Math.floor(p * INGREDIENTS.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#171714]">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── POST-HERO OVERLAP PANEL ──────────────────────────── */}
      <div
        className="relative z-[100] bg-[#F5F1E8]"
        style={{
          borderRadius: '28px 28px 0 0',
          marginTop: '-6rem',
          boxShadow: '0 -8px 40px -4px rgba(23,23,20,0.18)',
        }}
      >

        {/* Marquee strip — top of overlap panel */}
        <Marquee
          items={['Stone Ground', 'Single Origin', 'Kasargod Kerala', 'Zero Adulteration', 'Cold Processed', 'Heritage Craft', 'Authentic Flavours', 'Home Kitchens']}
          speed={35}
          className="py-4 border-b border-[#DDD7CA] text-[#68645B]"
        />

        {/* ── 2. BRAND STATEMENT (Sticky Container for Popup Scrubbing) ──────────────────────────────── */}
        <section className="relative w-full" style={{ height: '320vh' }} id="philosophy-section">
          <div className="sticky top-0 w-full h-[100svh] flex flex-col justify-center py-24 md:py-32 border-b border-[#DDD7CA] bg-[#F5F1E8]">
            <div className="container-editorial">
              <div className="max-w-3xl">
                <Reveal>
                  <span className="label text-[#68645B]">The Ammikallu Philosophy</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2
                    id="brand-statement"
                    className="display-lg text-[#171714] mt-6 mb-8"
                  >
                    "Slow speeds. Natural granite friction. Unburned volatile oils. Purity you can smell before you taste."
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="body-text max-w-xl">
                    Single-origin Kasargod turmeric, stone-pounded Kashmiri chilli, Tellicherry black pepper, and artisanal home bakes delivered directly from verified Kerala home chefs.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED PRODUCT (Apple/Nike Ultra-Minimalist Flagship Showcase) ───────────── */}
        {featuredProduct && (
          <section className="py-12 md:py-16 border-b border-[#DDD7CA]" aria-labelledby="featured-heading">
            <div className="container-editorial">
              <div className="max-w-4xl mx-auto">

                {/* Apple-style Segmented Product Selector */}
                {flagshipProducts.length > 1 && (
                  <div className="w-full overflow-x-auto hide-scrollbar pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center md:justify-center w-max md:w-auto mx-auto">
                      <div className="bg-[#EBE7DF]/80 backdrop-blur-sm p-1 rounded-full flex gap-1 shadow-inner border border-black/5">
                        {flagshipProducts.map((prod) => {
                          const isSelected = featuredProduct.id === prod.id;
                          let prodName = 'Manjal Podi';
                          let prodColor = 'bg-[#C99518]';
                          if (prod.id === 'prod-mulaku-podi') {
                            prodName = 'Mulaku Podi';
                            prodColor = 'bg-[#A63D2F]';
                          } else if (prod.id === 'prod-kurumulaku-podi') {
                            prodName = 'Kurumulaku Podi';
                            prodColor = 'bg-[#3A3831]';
                          }

                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setFeaturedWeightIdx(3); // Default to 1 Kg
                              }}
                              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium tracking-tight transition-all duration-300 cursor-pointer ${isSelected
                                ? 'bg-white text-[#171714] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/5'
                                : 'text-[#68645B] hover:text-[#171714] hover:bg-black/5'
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${prodColor}`}
                              />
                              <span>{prodName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {/* Flagship Card: Unified White Canvas with Luxury Ambient Depth */}
                <div className="relative bg-white rounded-2xl md:rounded-[32px] border-none shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden p-6 sm:p-8 md:p-12 transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)]">

                  {/* Subtle luxury ambient glow */}
                  <div
                    className={`absolute -top-24 -left-24 w-72 h-72 rounded-full bg-radial ${isChilli ? 'from-[#A63D2F]/10' : isKurumulaku ? 'from-[#3A3831]/8' : 'from-[#C99518]/8'
                      } via-transparent to-transparent pointer-events-none transition-colors duration-700`}
                  />
                  <div
                    className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-radial ${isChilli ? 'from-[#C99518]/6' : isKurumulaku ? 'from-[#3A3831]/5' : 'from-[#A63D2F]/5'
                      } via-transparent to-transparent pointer-events-none transition-colors duration-700`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">

                    {/* Left Column: Pure Product Hero (Floating on White Stage with Distortion FX) */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center relative">

                      {/* SVG Fluid Turbulence Distortion Filter */}
                      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
                        <defs>
                          <filter id="packWarpDistort" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.06 0.12" numOctaves="2" result="warpNoise" />
                            <feDisplacementMap in="SourceGraphic" in2="warpNoise" scale="22" xChannelSelector="R" yChannelSelector="G" />
                          </filter>
                        </defs>
                      </svg>

                      <div
                        className="relative flex flex-col items-center justify-center cursor-pointer group py-4"
                        onClick={() => openProductDetail(featuredProduct)}
                        title="Click to view full product details"
                      >
                        {/* Product Pouch with 90fps cinematic slow smooth float */}
                        <div className="relative transform transition-transform duration-700 ease-out group-hover:-translate-y-1.5 overflow-hidden">
                          <img
                            key={featuredImg}
                            src={featuredImg}
                            alt={`${featuredProduct.name} - ${activeFeaturedOpt.weight}`}
                            className="max-h-[230px] md:max-h-[270px] w-auto max-w-full object-contain anim-pack-switch"
                            style={{ mixBlendMode: 'multiply' }}
                            loading="lazy"
                          />

                          {/* Silky Glass Specular Light Sweep */}
                          <div
                            key={`flare-${featuredImg}`}
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent anim-flash-sweep"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Minimal Flagship Tech/Luxury Typography */}
                    <div className="md:col-span-7 flex flex-col justify-center space-y-6 md:pl-6">

                      {/* Live Status & Quick Switch */}
                      <div className="flex items-center justify-between pb-2 border-b border-black/5">
                        {nextProduct ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductId(nextProduct.id);
                              setFeaturedWeightIdx(3); // Default to 1 Kg
                            }}
                            className="text-[12px] font-mono text-[#68645B] hover:text-[#171714] flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <span>Next: {nextProduct.id === 'prod-mulaku-podi' ? 'Mulaku Podi' : nextProduct.id === 'prod-kurumulaku-podi' ? 'Kurumulaku Podi' : 'Manjal Podi'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}

                        <span className="text-[12px] font-mono text-[#46513A] font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#46513A]" />
                          In Stock • Fresh Batch
                        </span>
                      </div>

                      {/* Headline */}
                      <div>
                        <h2 id="featured-heading" className="text-3xl md:text-[40px] font-serif text-[#171714] tracking-tight leading-[1.1] font-medium">
                          {featuredProduct.name.split('(')[0].trim()}
                          {featuredProduct.name.includes('(') && (
                            <span className="block text-2xl md:text-[34px] text-[#171714] mt-1.5 opacity-90">
                              ({featuredProduct.name.split('(')[1]}
                            </span>
                          )}
                        </h2>
                        <p className="text-sm text-[#68645B] mt-3 font-serif italic">
                          {isChilli
                            ? 'കാസർഗോഡൻ തനത് മുളകുപൊടി • Cold Stone-Ground'
                            : isKurumulaku ? 'കാസർഗോഡൻ തനത് കുരുമുളകുപൊടി • Cold Stone-Ground' : 'കാസർഗോഡൻ തനത് മഞ്ഞൾപ്പൊടി • Cold Stone-Ground'}
                        </p>
                      </div>

                      {/* Brief description */}
                      <p className="text-sm md:text-[15px] text-[#524E46] leading-relaxed">
                        {featuredProduct.shortDescription || featuredProduct.description?.slice(0, 140)}
                      </p>

                      {/* Apple-style Segmented Size Selector */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[11px] font-mono text-[#68645B] uppercase tracking-[0.15em] font-semibold">
                            Select Size
                          </span>
                        </div>

                        {/* Pill track */}
                        <div className="bg-[#F5F2EB] p-1.5 rounded-full flex gap-1 items-center">
                          {featuredWeightOptions.map((wOpt, idx) => {
                            const isSelected = featuredWeightIdx === idx;
                            return (
                              <button
                                key={wOpt.weight}
                                type="button"
                                onClick={() => setFeaturedWeightIdx(idx)}
                                className={`flex-1 py-3 px-2 rounded-full text-center transition-all duration-300 relative cursor-pointer ${isSelected
                                  ? 'bg-[#171714] text-white shadow-md scale-[1.02]'
                                  : 'text-[#68645B] hover:text-[#171714] hover:bg-white/60'
                                  }`}
                                aria-label={`Select ${wOpt.weight} pack`}
                              >
                                <div className="font-mono text-[13px] font-bold leading-tight">{wOpt.weight}</div>
                                <div className={`text-[11px] font-medium mt-1 ${isSelected
                                  ? 'text-[#C99518]'
                                  : 'text-[#8C887E]'
                                  }`}>
                                  ₹{wOpt.salePrice || wOpt.price}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Price & Primary CTA */}
                      <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-t border-black/5 mt-4">
                        <div className="flex items-baseline gap-2.5">
                          <span key={featuredCurrentPrice} className="font-serif text-[40px] md:text-[42px] text-[#171714] anim-price-flip tracking-tight leading-none">
                            ₹{featuredCurrentPrice}
                          </span>
                          {featuredOriginalPrice && featuredOriginalPrice > featuredCurrentPrice && (
                            <span className="text-lg text-[#8C887E] line-through font-serif opacity-70">
                              ₹{featuredOriginalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => addToCart(featuredProduct, 1, activeFeaturedOpt.weight, featuredCurrentPrice)}
                            className="flex-1 sm:flex-none bg-[#171714] hover:bg-[#A63D2F] text-white px-5 sm:px-7 py-3.5 rounded-[16px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(166,61,47,0.3)] hover:-translate-y-1"
                            id="featured-add-cart-btn"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="whitespace-nowrap">Add to Bag</span>
                          </button>

                          <button
                            onClick={() => openProductDetail(featuredProduct)}
                            className="text-[13px] text-[#171714] hover:text-[#A63D2F] font-semibold transition-colors cursor-pointer py-2 flex items-center justify-center gap-1.5 group shrink-0"
                          >
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>
          </section>
        )}

        {/* ── 4. CURRY POWDERS COLLECTION CATALOG ───────────────────────── */}
        <section className="py-24 border-b border-[#DDD7CA]" aria-labelledby="curry-powder-heading">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12">
              <Reveal>
                <div>
                  <span className="label text-[#68645B] block mb-3">Pure Kerala Stone-Ground</span>
                  <h2 id="curry-powder-heading" className="display-md text-[#171714]">Curry Powders</h2>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <button
                  onClick={() => navigateToShop('curry-powder')}
                  className="btn-outline-dark"
                  id="curry-powders-view-all-btn"
                >
                  View all curry powders
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </Reveal>
            </div>

            {curryPowderProducts.length > 0 ? (
              <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] border border-[#DDD7CA]">
                {curryPowderProducts.map((prod, i) => (
                  <Reveal key={prod.id} delay={i * 60} className="border-r border-[#DDD7CA] last:border-r-0">
                    <ProductCard product={prod} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center border border-[#DDD7CA] bg-white my-2">
                <span className="label text-[10px] text-[#A63D2F] block mb-2">Pantry Awaiting Harvest</span>
                <p className="font-serif text-2xl text-[#171714]">Fresh stone-ground batches are currently being prepared</p>
                <p className="body-text text-xs mt-2 max-w-md mx-auto">
                  Use the Seller Portal or Admin Console to publish freshly harvested produce.
                </p>
              </div>
            )}

            {/* 3-pillar facts — count-up */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] border border-t-0 border-[#DDD7CA] mt-[1px]">
              {[
                { target: 56, suffix: '%+', prefix: '>', unit: 'Curcumin', desc: '14-day sun-cured whole roots. Highest curcumin yield of any commercial turmeric.', divisor: 10 },
                { target: 28, suffix: '°C', unit: 'Stone Temp', desc: 'Cold-ground at ambient room temperature. No heat. No oxidised oils.', divisor: 1 },
                { target: 100, suffix: '%', unit: 'Single Origin', desc: 'Zero blending. Zero added starch, color or spent-spice waste.', divisor: 1 },
              ].map((fact, i) => <StatPillar key={i} fact={fact} delay={i * 80} />)}
            </div>
          </div>
        </section>

        {/* ── 6. DARK EDITORIAL — Granite Stone Craft ─────────── */}
        <section className="bg-[#171714] py-24 md:py-32 border-b border-[#DDD7CA]" aria-labelledby="craft-heading">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 xl:col-span-7 order-2 lg:order-1">
                <Reveal>
                  <span className="label text-[#C99518]/80 block mb-6">Traditional Heritage</span>
                </Reveal>
                <Reveal delay={80}>
                  <h2 id="craft-heading" className="display-lg text-[#F5F1E8] mb-8">
                    Granite Stone.<br />
                    Natural Rhythm.<br />
                    Zero Heat Damage.
                  </h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="text-[#F5F1E8]/60 max-w-md mb-10 leading-relaxed">
                    In Kerala's heritage homes, the Ammikkallu was the altar of flavour. When turmeric and chillies are ground by heavy granite friction at ambient room temperature, the natural moisture and essential volatile resins are locked inside rather than vaporised.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                    <DarkStatPillar target={56} prefix=">" suffix="%+" divisor={10} label="Curcumin" color="#C99518" />
                    <DarkStatPillar target={28} suffix="°C" label="Cold Stone" color="#F5F1E8" />
                    <DarkStatPillar target={100} suffix="%" label="Single Origin" color="#A63D2F" />
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-6 xl:col-span-5 order-1 lg:order-2">
                <Reveal delay={120}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&q=90"
                      alt="Cold Stone-Pounded Spices"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="label text-[10px] text-white/50 block mb-1">Ground on Order</span>
                      <p className="text-sm text-white/80">Small 5kg batches for maximum aromatic intensity.</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Marquee Ribbon */}
        <Marquee
          items={['Hand-Harvested Kasargod Roots', 'Ambient Temperature Granite Friction', 'Zero Chemical Bleaching', 'Preserved Volatile Essential Oils', 'Pounded in Small 5kg Batches', 'Direct from Kerala Family Farms']}
          speed={38}
          reverse={true}
          className="py-4 bg-[#11110F] text-[#F5F1E8]/70 border-b border-white/10"
        />

        {/* ── 7. INGREDIENT STORY (Sticky scroll) ─────────────── */}
        <section
          id="ingredient-story"
          ref={ingredientRef}
          className="relative"
          style={{ height: `${INGREDIENTS.length * 100}vh` }}
          aria-label="Ingredient stories"
        >
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* Background images */}
            {INGREDIENTS.map((ing, i) => (
              <div
                key={ing.name}
                className={`ingredient-panel ${i === activeIngredient ? 'active' : ''}`}
                aria-hidden={i !== activeIngredient}
              >
                <img
                  src={ing.img}
                  alt={ing.name}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className="hero-overlay absolute inset-0" />
              </div>
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="container-editorial pb-16 md:pb-24 w-full">
                <div className="max-w-xl">
                  <span className="label text-[10px] text-white/40 block mb-4">
                    0{activeIngredient + 1} / 0{INGREDIENTS.length} — Ingredients
                  </span>
                  <h2
                    key={activeIngredient}
                    className="display-lg text-white mb-4 animate-fade-in-up"
                  >
                    {INGREDIENTS[activeIngredient].name}
                  </h2>
                  <span className="label text-[10px] text-white/50 block mb-5">
                    {INGREDIENTS[activeIngredient].origin}
                  </span>
                  <p
                    key={`desc-${activeIngredient}`}
                    className="body-text text-white/65 max-w-sm animate-fade-in-up"
                    style={{ animationDelay: '100ms' }}
                  >
                    {INGREDIENTS[activeIngredient].desc}
                  </p>
                </div>

                {/* Ingredient tab selector */}
                <div className="flex items-center gap-5 md:gap-6 mt-8 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                  {INGREDIENTS.map((ing, i) => (
                    <button
                      key={ing.name}
                      onClick={() => setActiveIngredient(i)}
                      className={`label text-[10px] cursor-pointer transition-all duration-300 whitespace-nowrap ${i === activeIngredient ? 'text-white' : 'text-white/30 hover:text-white/60'
                        }`}
                    >
                      {ing.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. KERALA STORY ─────────────────────────────────── */}
        <section id="kerala-story" className="py-24 md:py-32 border-b border-[#DDD7CA] bg-[#F5F1E8]" aria-labelledby="kerala-heading">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div>
                  <span className="label text-[#68645B] block mb-6">From the Land. With Respect.</span>
                  <h2 id="kerala-heading" className="display-lg text-[#171714] mb-8">
                    Tradition, Refined<br />for Today.
                  </h2>
                  <p className="body-text mb-6 max-w-md">
                    Every product begins in the fertile farms of Kasargod, the backwaters of Kottayam, or the heritage kitchens of Kozhikode. We work directly with farmers who have been cultivating these lands for generations.
                  </p>
                  <p className="body-text mb-10 max-w-md">
                    No middlemen. No industrial processing. Just honest produce, brought directly to your kitchen with integrity.
                  </p>
                  <button
                    onClick={() => switchRole('seller')}
                    className="btn-outline-dark"
                    id="story-become-seller-btn"
                  >
                    Join as a home maker
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
                  'https://images.unsplash.com/photo-1515224526135-56a73e655e0f?w=600&q=80',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
                  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&q=80',
                ].map((src, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className={`overflow-hidden ${i % 2 === 1 ? 'mt-6' : ''}`}>
                      <img
                        src={src}
                        alt={`Kerala story ${i + 1}`}
                        className="w-full object-cover aspect-[3/4] hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        loading="lazy"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. COLLECTION SHOWCASE ──────────────────────────── */}
        {collectionProducts.length > 0 && (
          <section className="py-24 border-b border-[#DDD7CA]" aria-labelledby="collection-heading">
            <div className="container-editorial">
              <div className="flex items-end justify-between mb-12">
                <Reveal>
                  <h2 id="collection-heading" className="display-md text-[#171714]">Handcrafted<br />Range</h2>
                </Reveal>
                <Reveal delay={100}>
                  <button
                    onClick={() => navigateToShop()}
                    className="btn-outline-dark"
                    id="collection-view-all-btn"
                  >
                    View all
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </Reveal>
              </div>

              {/* Asymmetric grid */}
              <div className="grid grid-cols-12 gap-[1px] border border-[#DDD7CA]">
                {collectionProducts.slice(0, 1).map(prod => (
                  <Reveal key={prod.id} className="col-span-12 md:col-span-5 border-r border-[#DDD7CA]">
                    <ProductCard product={prod} size="large" />
                  </Reveal>
                ))}
                <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-[1px]">
                  {collectionProducts.slice(1, 5).map((prod, i) => (
                    <Reveal key={prod.id} delay={i * 50} className="border-b border-r border-[#DDD7CA]">
                      <ProductCard product={prod} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 10. HOW IT WORKS ────────────────────────────────── */}
        <section className="py-24 border-b border-[#DDD7CA]" aria-labelledby="process-heading">
          <div className="container-editorial">
            <Reveal>
              <span className="label text-[#68645B] block mb-12">How It Works</span>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#DDD7CA]">
              {[
                { n: '01', title: 'Choose Home Kitchens', body: 'Order stone-ground spices and fresh home-baked treats directly from local Kerala home cooks.' },
                { n: '02', title: 'Freshly Ground on Order', body: 'Spices are ground in small batches. Snacks are baked fresh without industrial preservatives.' },
                { n: '03', title: 'Aroma-Sealed Packing', body: 'Packed in airtight aroma pouches and eco-friendly boxes to protect freshness and natural crunch.' },
                { n: '04', title: 'Delivered to Your Door', body: 'Express doorstep delivery across Kerala with live tracking and instant UPI payment options.' },
              ].map((step, i) => (
                <Reveal key={i} delay={i * 80} className="border-r border-[#DDD7CA] last:border-r-0 p-8">
                  <span className="label text-[10px] text-[#DDD7CA] block mb-6">{step.n}</span>
                  <h3 className="font-serif text-xl text-[#171714] mb-4 leading-tight">{step.title}</h3>
                  <p className="text-sm text-[#68645B] leading-relaxed">{step.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. TESTIMONIALS ────────────────────────────────── */}
        <section className="py-24 border-b border-[#DDD7CA]" aria-labelledby="testimonials-heading">
          <div className="container-editorial">
            <div className="max-w-3xl mx-auto text-center">
              <Reveal>
                <span className="label text-[#68645B] block mb-12">What our customers say</span>
              </Reveal>
              <div className="relative min-h-[140px] flex items-center justify-center">
                {TESTIMONIALS.map((t, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === activeTestimonial ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    aria-hidden={i !== activeTestimonial}
                  >
                    <p className="font-serif text-2xl md:text-3xl text-[#171714] mb-6 leading-snug">
                      "{t.quote}"
                    </p>
                    <span className="label text-[10px] text-[#68645B]">{t.name} — {t.location}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`transition-all duration-300 cursor-pointer ${i === activeTestimonial ? 'w-6 h-[2px] bg-[#171714]' : 'w-2 h-[2px] bg-[#DDD7CA]'
                      }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. MAKERS (Artisans) ───────────────────────────── */}
        <section className="py-24 border-b border-[#DDD7CA]" aria-labelledby="makers-heading">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12">
              <Reveal>
                <div>
                  <span className="label text-[#68645B] block mb-3">Verified Home Creators</span>
                  <h2 id="makers-heading" className="display-md text-[#171714]">Meet the Artisans</h2>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <button
                  onClick={() => switchRole('seller')}
                  className="btn-outline-dark"
                  id="makers-join-btn"
                >
                  Join as maker
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] border border-[#DDD7CA]">
              {approvedSellers.map((seller, i) => (
                <Reveal key={seller.id} delay={i * 80} className="border-r border-[#DDD7CA] last:border-r-0">
                  <TiltCard className="h-full">
                    <div className="group bg-[#F5F1E8] hover:bg-white transition-colors duration-300 p-8 h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 overflow-hidden bg-[#EEEBE3] shrink-0">
                          <img src={seller.image} alt={seller.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-[#171714]">{seller.name}</h3>
                          <span className="label text-[10px] text-[#68645B]">{seller.district}, Kerala</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#68645B] leading-relaxed line-clamp-3 mb-6">{seller.specialty || seller.description?.slice(0, 120)}</p>
                      <div className="flex items-center gap-3 border-t border-[#DDD7CA] pt-4">
                        <span className="font-serif text-sm text-[#C99518]">★ {seller.rating}</span>
                        <span className="label text-[10px] text-[#68645B]">{seller.reviewsCount} reviews</span>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Artisanal Heritage Ribbon */}
        <Marquee
          items={['Kasargod Turmeric', 'Kashmiri Chilli', 'Tellicherry Black Pepper', 'Idukki Cardamom', 'Ceylon Cinnamon', 'Kozhikode Halwa', 'Clay-Pot Pickles', 'Hand-Rolled Rusks']}
          speed={42}
          className="py-4 border-b border-[#DDD7CA] text-[#68645B]"
        />

        {/* ── 13. BRAND PROMISE CLOSE ─────────────────────────── */}
        <section className="py-24 md:py-36" aria-labelledby="promise-heading">
          <div className="container-editorial text-center">
            <Reveal>
              <span className="label text-[#68645B] block mb-8">A globally premium brand with a distinctly Kerala soul.</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 id="promise-heading" className="display-lg text-[#171714] max-w-2xl mx-auto mb-12">
                From the Land.<br />With Respect.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <button
                onClick={() => navigateToShop()}
                className="btn-primary mx-auto"
                id="promise-explore-btn"
              >
                Explore the Collection
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </Reveal>
          </div>
        </section>

      </div> {/* end overlap panel */}

      {/* ── 14. SCROLL-TRIGGERED INTERACTIVE PRODUCT POPUP ─── */}
      {showScrollPopup && !popupMinimized && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center animate-fade-in backdrop-blur-2xl transition-colors duration-1000 ease-in-out"
          style={{ 
            backgroundColor: featuredProduct?.id === 'prod-manjal-podi' ? 'rgba(201, 149, 24, 0.25)' : 
                             featuredProduct?.id === 'prod-kurumulaku-podi' ? 'rgba(70, 81, 58, 0.3)' : 
                             'rgba(166, 61, 47, 0.25)' 
          }}
        >

          {/* Reduced Size Image Slide */}
          <div
            className="absolute inset-8 md:inset-16 z-0 flex items-center justify-center cursor-pointer"
            onClick={() => {
              openProductDetail(featuredProduct);
              setPopupMinimized(true);
            }}
            title="Click to view details"
          >
            {flagshipProducts.slice(0, 3).map((p) => {
              const isActive = p.id === featuredProduct?.id;
              
              const imgUrl = p.id === 'prod-mulaku-podi' ? "/mulaku-podi/select product-mulakupodi.png" : 
                            p.id === 'prod-manjal-podi' ? "/manjal podi/select product-manjalpodi.png" : 
                            "/kurumulaku podi/250g.png";

              return (
                <img
                  key={p.id}
                  src={imgUrl}
                  alt={p.name}
                  className={`absolute max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-[1.08] transition-transform duration-700
                    ${isActive ? 'animate-product-in z-10' : 'animate-product-out z-0'}
                  `}
                  style={{ display: isActive ? 'block' : undefined }} // Optional: keep it around for the animation to play out
                />
              )
            })}
          </div>



        </div>
      )}

    </div>
  );
}
