import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import { ArrowRight, Plus, Sparkles, ShoppingBag, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
  const { categories, products, navigateToShop, addToCart, openProductDetail } = useApp();

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('prod-mulaku-podi');
  const [featuredWeightIdx, setFeaturedWeightIdx] = useState(3); // Default to 1 Kg (usually index 3)

  const approvedProducts = products.filter(p => p.status === 'approved');
  const curryPowderProducts = approvedProducts.filter(p => p.categoryId === 'curry-powder' || p.categoryId === 'spices');
  const flagshipProducts = curryPowderProducts.length > 0 ? curryPowderProducts : approvedProducts.slice(0, 2);
  const featuredProduct = flagshipProducts.find(p => p.id === selectedProductId) || flagshipProducts[0] || approvedProducts[0];
  const collectionProducts = approvedProducts.filter(p => p.featured).slice(0, 6);

  const [showScrollPopup, setShowScrollPopup] = useState(false);
  const [popupMinimized, setPopupMinimized] = useState(false);

  const isChilli = featuredProduct?.id === 'prod-mulaku-podi';
  const isKurumulaku = featuredProduct?.id === 'prod-kurumulaku-podi';
  const isCombo = featuredProduct?.id === 'prod-spices-combo';

  const featuredIdx = flagshipProducts.findIndex(p => p.id === featuredProduct?.id);
  const prevProduct = flagshipProducts[(featuredIdx - 1 + flagshipProducts.length) % flagshipProducts.length];
  const nextProduct = flagshipProducts[(featuredIdx + 1) % flagshipProducts.length];

  const getPopupImage = () => {
    if (featuredProduct?.id === 'prod-mulaku-podi') return "/mulaku-podi/select product-mulakupodi.png";
    if (featuredProduct?.id === 'prod-manjal-podi') return "/manjal podi/select product-manjalpodi.png";
    if (featuredProduct?.id === 'prod-spices-combo') return "/products-combo/combo-500g.png";
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
          <section className="py-0 border-b border-[#DDD7CA]" aria-labelledby="featured-heading">
            <div className="w-full">
              <div className="w-full h-full flex flex-col">

                {/* Apple-style Segmented Product Selector */}
                {flagshipProducts.length > 1 && (
                  <div className="w-full overflow-x-auto hide-scrollbar pt-8 pb-4 bg-white">
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
                          } else if (prod.id === 'prod-spices-combo') {
                            prodName = 'Combo Pack';
                            prodColor = 'bg-[#46513A]'; // distinct color
                          }

                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setFeaturedWeightIdx(Math.min(3, prod.weightOptions.length - 1)); // Default to highest or 1 Kg
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
                {/* Flagship Card: Edge-to-Edge Redesign */}
                <div className="relative bg-white border-none rounded-none overflow-hidden py-4 px-4 md:py-6 md:px-12 group/flagship flex flex-col justify-center">

                  {/* Ultra-minimal ambient glow (subtle) */}
                  <div
                    className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-radial ${isChilli ? 'from-[#A63D2F]/5' : isKurumulaku ? 'from-[#3A3831]/4' : 'from-[#C99518]/5'
                      } via-transparent to-transparent opacity-0 group-hover/flagship:opacity-100 transition-opacity duration-1000 pointer-events-none translate-x-1/3 -translate-y-1/3`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">

                    {/* Left Column: Pure Product Hero */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                      <div
                        className="relative flex flex-col items-center justify-center cursor-pointer group py-2 md:py-4"
                        onClick={() => openProductDetail(featuredProduct)}
                        title="Click to view full product details"
                      >
                        {/* Minimalist Floating Image */}
                        <div className="relative transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:-translate-y-2">
                          <img
                            key={featuredImg}
                            src={featuredImg}
                            alt={`${featuredProduct.name} - ${activeFeaturedOpt.weight}`}
                            className="max-h-[160px] md:max-h-[220px] w-auto max-w-full object-contain anim-pack-switch drop-shadow-2xl"
                            style={{ mixBlendMode: 'multiply' }}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Creative Minimal Typography */}
                    <div className="md:col-span-7 flex flex-col justify-center space-y-4 md:space-y-6 md:pl-8">

                      {/* Headline Area */}
                      <div className="relative">
                        <h2 id="featured-heading" className="text-3xl md:text-[42px] font-serif text-[#171714] tracking-tight leading-[1.05]">
                          {featuredProduct.name.split('(')[0].trim()}
                        </h2>
                        {featuredProduct.name.includes('(') && (
                          <span className="block text-lg md:text-2xl text-[#171714]/30 font-serif mt-1 italic tracking-wide">
                            {featuredProduct.name.split('(')[1].replace(')', '')}
                          </span>
                        )}
                        <p className="text-[11px] uppercase tracking-[0.15em] text-[#A63D2F] font-semibold mt-2">
                          {isCombo
                            ? 'Cold Stone-Ground • Kerala Heritage'
                            : isChilli
                              ? 'Cold Stone-Ground • Kasargod'
                              : isKurumulaku ? 'Cold Stone-Ground • Tellicherry' : 'Cold Stone-Ground • Alleppey'}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] md:text-[14px] text-[#524E46] leading-relaxed max-w-lg hidden sm:block">
                        {featuredProduct.shortDescription || featuredProduct.description?.slice(0, 100)}
                      </p>

                      {/* Minimal Segmented Size Selector */}
                      <div className="pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {featuredWeightOptions.map((wOpt, idx) => {
                            const isSelected = featuredWeightIdx === idx;
                            return (
                              <button
                                key={wOpt.weight}
                                type="button"
                                onClick={() => setFeaturedWeightIdx(idx)}
                                className={`py-1.5 px-4 rounded-full text-center transition-all duration-500 cursor-pointer border ${isSelected
                                  ? 'border-[#171714] bg-[#171714] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-[1.02]'
                                  : 'border-black/10 bg-transparent text-[#68645B] hover:border-black/30 hover:text-black'
                                  }`}
                                aria-label={`Select ${wOpt.weight} pack`}
                              >
                                <span className="font-mono text-[11px] font-bold tracking-tight">{wOpt.weight}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Price & Action (Creative alignment) */}
                      <div className="pt-3 mt-1 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-black/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-black/40 uppercase tracking-[0.2em] font-bold mb-1">Total</span>
                          <div className="flex items-baseline gap-2">
                            <span key={featuredCurrentPrice} className="font-serif text-[36px] md:text-[42px] text-[#171714] anim-price-flip leading-none tracking-tighter">
                              ₹{featuredCurrentPrice}
                            </span>
                            {featuredOriginalPrice && featuredOriginalPrice > featuredCurrentPrice && (
                              <span className="text-sm text-black/30 line-through font-serif italic">
                                ₹{featuredOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => addToCart(featuredProduct, 1, activeFeaturedOpt.weight, featuredCurrentPrice)}
                            className="flex-1 sm:flex-none bg-[#171714] text-white px-6 py-2.5 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all duration-500 cursor-pointer hover:bg-[#A63D2F] hover:shadow-[0_8px_16px_rgba(166,61,47,0.3)] hover:-translate-y-0.5 group/add flex items-center justify-center gap-2"
                            id="featured-add-cart-btn"
                          >
                            <span className="whitespace-nowrap">Add to Bag</span>
                            <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/add:scale-110" />
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
                  <span className="label text-[#68645B] block mb-3">Why Ammikallu</span>
                  <h2 id="makers-heading" className="display-md text-[#171714]">The Craft Behind Every Pack</h2>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <button
                  onClick={() => navigateToShop()}
                  className="btn-outline-dark"
                  id="makers-join-btn"
                >
                  Shop all products
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] border border-[#DDD7CA]">
              {[
                { icon: '🌿', title: 'Single-Origin', text: 'Every spice traced to one farm in Kasargod — no blended market lots, ever.' },
                { icon: '🪨', title: 'Stone-Ground', text: 'Slow-pounded on granite Ammikkallu at ambient temperature to protect essential oils.' },
                { icon: '☀️', title: 'Sun-Dried', text: '14-day natural sun-curing on reed mats — zero artificial colors or preservatives.' }
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 80} className="border-r border-[#DDD7CA] last:border-r-0">
                  <TiltCard className="h-full">
                    <div className="group bg-[#F5F1E8] hover:bg-white transition-colors duration-300 p-8 h-full">
                      <div className="w-14 h-14 bg-white border border-[#DDD7CA] flex items-center justify-center text-2xl mb-6">
                        {card.icon}
                      </div>
                      <h3 className="font-serif text-lg text-[#171714] mb-3">{card.title}</h3>
                      <p className="text-sm text-[#68645B] leading-relaxed">{card.text}</p>
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
