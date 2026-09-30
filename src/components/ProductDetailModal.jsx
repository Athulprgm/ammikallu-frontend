import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Heart,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  ArrowRight,
  Leaf
} from 'lucide-react';

export default function ProductDetailModal() {
  const {
    selectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    sellers,
    reviews,
    addToCart,
    toggleWishlist,
    wishlist,
    addReview,
    navigateToSellerStore
  } = useApp();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);

  const scrollRef = useRef(null);

  // Lock background scroll and trap wheel events inside modal
  useEffect(() => {
    if (!isProductModalOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    const trapWheel = (e) => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
      if (atTop || atBottom) e.preventDefault();
      e.stopPropagation();
    };

    const modalEl = scrollRef.current;
    if (modalEl) modalEl.addEventListener('wheel', trapWheel, { passive: false });

    return () => {
      const sy = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, sy);
      if (modalEl) modalEl.removeEventListener('wheel', trapWheel);
    };
  }, [isProductModalOpen]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const seller = sellers.find(s => s.id === selectedProduct.sellerId);
  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);
  const isWishlisted = wishlist.includes(selectedProduct.id);

  const weightOptions = selectedProduct.weightOptions || [
    { weight: selectedProduct.weight, price: selectedProduct.price, salePrice: selectedProduct.salePrice }
  ];

  const activeOption = weightOptions[selectedWeightIndex] || weightOptions[0];
  const displayPrice = activeOption.price;
  const displaySalePrice = activeOption.salePrice || displayPrice;
  const discount = displayPrice > displaySalePrice
    ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100)
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    addReview(selectedProduct.id, {
      userName: reviewerName || 'Verified Patron',
      rating: newReviewRating,
      comment: newReviewComment
    });
    setNewReviewComment('');
    setReviewerName('');
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, activeOption.weight, displaySalePrice);
    setIsProductModalOpen(false);
  };

  const activeImage = activeOption.image || selectedProduct.gallery?.[selectedImageIndex] || selectedProduct.image;

  return (
    <>
      <style>{`
        @keyframes pdm-float {
          0%, 100% { transform: translateY(0px); filter: drop-shadow(0 20px 40px rgba(0,0,0,0.12)); }
          50%       { transform: translateY(-14px); filter: drop-shadow(0 36px 56px rgba(0,0,0,0.18)); }
        }
        @keyframes pdm-in {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pdm-float { animation: pdm-float 7s ease-in-out infinite; }
        .pdm-in    { animation: pdm-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .pdm-scroll::-webkit-scrollbar { width: 3px; }
        .pdm-scroll::-webkit-scrollbar-track { background: transparent; }
        .pdm-scroll::-webkit-scrollbar-thumb { background: #DDD7CA; border-radius: 99px; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-10"
        style={{ background: 'rgba(23,23,20,0.55)', backdropFilter: 'blur(12px)' }}
        onClick={() => setIsProductModalOpen(false)}
      >
        {/* Modal */}
        <div
          className="pdm-in bg-[#F5F1E8] w-full max-w-[1100px] h-[92vh] md:h-[88vh] flex flex-col md:flex-row overflow-hidden border border-[#DDD7CA]"
          style={{ borderRadius: 0, boxShadow: '0 40px 80px -16px rgba(23,23,20,0.4)' }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── LEFT: Image Panel ─────────────────────────── */}
          <div className="w-full md:w-[42%] h-[40vh] md:h-full bg-[#F5F1E8] relative flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#DDD7CA] shrink-0 overflow-hidden">

            {/* Faint watermark text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span
                className="font-serif font-black text-[#171714] -rotate-[18deg] tracking-tighter leading-none"
                style={{ fontSize: 'clamp(72px, 12vw, 160px)', opacity: 0.025 }}
              >
                {selectedProduct.name.split(' ')[0].toUpperCase()}
              </span>
            </div>

            {/* Category label — top left */}
            <div className="absolute top-5 left-5 z-10">
              <span className="label text-[9px] text-[#68645B]">
                {selectedProduct.categoryId === 'curry-powder' || selectedProduct.categoryId === 'spices'
                  ? 'Cold Stone-Ground'
                  : 'Artisanal Blend'}
              </span>
            </div>

            {/* Product image */}
            <img
              key={activeImage}
              src={activeImage}
              alt={selectedProduct.name}
              className="pdm-float relative z-10 w-[62%] md:w-[68%] h-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Gallery thumbnails — bottom */}
            {selectedProduct.gallery?.length > 1 && (
              <div className="absolute bottom-5 left-0 w-full flex justify-center gap-2.5 z-20 px-4">
                {selectedProduct.gallery.map((img, idx) => {
                  const active = activeImage === img;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        const wi = weightOptions.findIndex(w => w.image === img);
                        if (wi >= 0) setSelectedWeightIndex(wi);
                      }}
                      className={`w-12 h-12 border transition-all duration-200 cursor-pointer bg-white flex items-center justify-center p-1.5 ${
                        active
                          ? 'border-[#171714]'
                          : 'border-[#DDD7CA] opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: Scrollable Content ─────────────────── */}
          <div
            ref={scrollRef}
            className="flex-1 h-full overflow-y-auto pdm-scroll bg-white"
          >
            {/* Close button — top right */}
            <div className="sticky top-0 z-30 flex justify-end bg-white border-b border-[#DDD7CA] px-6 py-3">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="flex items-center gap-1.5 text-[#68645B] hover:text-[#171714] transition-colors cursor-pointer group"
                aria-label="Close"
              >
                <span className="label text-[9px]">Close</span>
                <X className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2} />
              </button>
            </div>

            <div className="px-7 md:px-10 lg:px-14 py-10 space-y-10">

              {/* ── Header ─────────────────────────────── */}
              <div className="space-y-5">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label text-[#A63D2F] text-[10px]">
                    {selectedProduct.categoryId === 'curry-powder' || selectedProduct.categoryId === 'spices'
                      ? 'Cold Stone-Ground'
                      : 'Artisanal Blend'}
                  </span>
                  {seller && (
                    <>
                      <span className="text-[#DDD7CA]">·</span>
                      <button
                        onClick={() => { setIsProductModalOpen(false); navigateToSellerStore(seller.id); }}
                        className="label text-[10px] text-[#46513A] hover:text-[#171714] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {seller.name} <CheckCircle2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="font-serif text-3xl md:text-[40px] lg:text-[48px] text-[#171714] leading-[1.06] tracking-tight">
                    {selectedProduct.name.split('(')[0].trim()}
                  </h1>
                  {selectedProduct.name.includes('(') && (
                    <span className="block font-serif italic text-xl md:text-2xl text-[#171714]/25 mt-1 tracking-wide">
                      {selectedProduct.name.split('(')[1].replace(')', '')}
                    </span>
                  )}
                </div>

                {/* Rating + stock */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-[#C99518] text-[#C99518]' : 'text-[#DDD7CA]'}`} />
                    ))}
                    <span className="text-[13px] font-semibold text-[#171714] ml-1">{selectedProduct.rating}</span>
                    <span className="text-[13px] text-[#68645B]">({selectedProduct.reviewsCount})</span>
                  </div>
                  <span className="w-px h-3 bg-[#DDD7CA]" />
                  <span className="label text-[10px] text-[#46513A]">
                    {selectedProduct.stock} in stock
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="body-text text-[#68645B] leading-relaxed border-t border-[#DDD7CA] pt-8">
                {selectedProduct.description}
              </p>

              {/* ── Size Selector ──────────────────────── */}
              <div className="border-t border-[#DDD7CA] pt-8 space-y-4">
                <span className="label text-[10px] text-[#68645B] block">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {weightOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedWeightIndex(idx);
                        if (selectedProduct.gallery && opt.image) {
                          const gi = selectedProduct.gallery.findIndex(g => g === opt.image);
                          if (gi >= 0) setSelectedImageIndex(gi);
                        }
                      }}
                      className={`relative py-2 px-5 border text-center transition-all duration-300 cursor-pointer ${
                        selectedWeightIndex === idx
                          ? 'border-[#171714] bg-[#171714] text-white'
                          : 'border-[#DDD7CA] bg-transparent text-[#68645B] hover:border-[#171714] hover:text-[#171714]'
                      }`}
                    >
                      <span className="font-mono text-[12px] font-bold">{opt.weight}</span>
                      {opt.salePrice && opt.price > opt.salePrice && (
                        <span className="absolute -top-2 -right-2 text-[8px] font-black bg-[#A63D2F] text-white px-1.5 py-0.5 leading-none">
                          -{Math.round(((opt.price - opt.salePrice) / opt.price) * 100)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price + CTA ─────────────────────────── */}
              <div className="border border-[#DDD7CA] p-6 space-y-6 bg-[#F5F1E8]">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="label text-[9px] text-[#68645B] block mb-1">Total</span>
                    <div className="flex items-baseline gap-3">
                      <span key={displaySalePrice} className="font-serif text-[42px] md:text-[52px] text-[#171714] leading-none tracking-tight">
                        ₹{(displaySalePrice * quantity).toLocaleString('en-IN')}
                      </span>
                      {displayPrice > displaySalePrice && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-[#68645B] line-through font-serif">₹{(displayPrice * quantity).toLocaleString('en-IN')}</span>
                          <span className="label text-[9px] text-[#A63D2F]">{discount}% OFF</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="label text-[9px] text-[#68645B]">Qty</span>
                    <div className="flex items-center border border-[#DDD7CA] bg-white">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-lg font-mono text-[#171714] hover:bg-[#F5F1E8] transition-colors cursor-pointer border-r border-[#DDD7CA]">−</button>
                      <span className="w-10 text-center text-[14px] font-bold font-mono text-[#171714]">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-lg font-mono text-[#171714] hover:bg-[#F5F1E8] transition-colors cursor-pointer border-l border-[#DDD7CA]">+</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#171714] text-white flex items-center justify-center gap-2.5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer hover:bg-[#A63D2F] group/cta"
                  >
                    <ShoppingBag className="w-4 h-4 transition-transform group-hover/cta:scale-110" />
                    Add to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-14 h-14 flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#A63D2F] border-[#A63D2F] text-white'
                        : 'bg-white border-[#DDD7CA] text-[#171714] hover:border-[#171714]'
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* ── Info Strip ──────────────────────────── */}
              <div className="grid grid-cols-2 border border-[#DDD7CA]">
                <div className="p-5 border-r border-[#DDD7CA]">
                  <span className="label text-[9px] text-[#68645B] block mb-1.5">Processing</span>
                  <span className="text-[13px] font-medium text-[#171714] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C99518]" />
                    {selectedProduct.preparationTime}
                  </span>
                </div>
                <div className="p-5">
                  <span className="label text-[9px] text-[#68645B] block mb-1.5">Shelf Life</span>
                  <span className="text-[13px] font-medium text-[#171714] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#46513A]" />
                    {selectedProduct.shelfLife}
                  </span>
                </div>
              </div>

              {/* ── Purity Notes ─────────────────────────── */}
              {selectedProduct.purityNotes?.length > 0 && (
                <div className="border border-[#DDD7CA]">
                  <div className="px-5 py-3 border-b border-[#DDD7CA] bg-[#F5F1E8] flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#C99518]" />
                    <span className="label text-[9px] text-[#68645B]">Purity & Origin Assurance</span>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.purityNotes.map((note, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[13px] text-[#68645B]">
                        <span className="text-[#46513A] font-bold text-[11px] mt-0.5">✓</span>
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Section Label ────────────────────────── */}
              <div className="border-t border-[#DDD7CA] pt-10">
                <span className="label text-[#68645B] text-[10px] block mb-8">Culinary Profile</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="label text-[10px] text-[#46513A] flex items-center gap-1.5">
                      <Leaf className="w-3 h-3" /> Pure Ingredients
                    </span>
                    <p className="body-text text-[#68645B] text-[13px]">{selectedProduct.ingredients}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="label text-[10px] text-[#A63D2F] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" /> Allergen Advisory
                    </span>
                    <p className="body-text text-[#68645B] text-[13px]">{selectedProduct.allergenInformation}</p>
                  </div>
                </div>
              </div>

              {/* ── Reviews ──────────────────────────────── */}
              <div className="border-t border-[#DDD7CA] pt-10 space-y-6">
                <div className="flex items-baseline justify-between">
                  <span className="label text-[#68645B] text-[10px]">Patron Reviews</span>
                  <span className="label text-[10px] text-[#68645B]">{productReviews.length} verified</span>
                </div>

                {productReviews.length > 0 ? (
                  <div className="space-y-px border border-[#DDD7CA]">
                    {productReviews.map((rev, i) => (
                      <div key={rev.id} className={`p-6 bg-white ${i !== productReviews.length - 1 ? 'border-b border-[#DDD7CA]' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < rev.rating ? 'text-[#C99518]' : 'text-[#DDD7CA]'}`}>★</span>
                            ))}
                          </div>
                          <span className="label text-[9px] text-[#68645B]">{rev.date}</span>
                        </div>
                        <p className="text-[14px] text-[#171714] leading-relaxed mb-4">"{rev.comment}"</p>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-[15px] text-[#171714]">{rev.userName}</span>
                          <span className="label text-[9px] text-[#46513A] px-2 py-1 bg-[#F5F1E8]">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="body-text text-[13px] text-[#68645B] italic">No reviews yet — be the first to share your experience.</p>
                )}
              </div>

              {/* ── Review Form ───────────────────────────── */}
              <div className="border border-[#DDD7CA] bg-[#F5F1E8]">
                <div className="px-6 py-4 border-b border-[#DDD7CA]">
                  <span className="label text-[10px] text-[#68645B]">Submit an Authentic Review</span>
                </div>
                <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-[#DDD7CA] text-[13px] text-[#171714] placeholder:text-[#68645B] focus:outline-none focus:border-[#171714] transition-colors"
                  />
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-white border border-[#DDD7CA]">
                    <span className="label text-[9px] text-[#68645B]">Rating</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setNewReviewRating(star)}
                          className={`text-xl transition-transform hover:scale-110 cursor-pointer ${star <= newReviewRating ? 'text-[#C99518]' : 'text-[#DDD7CA]'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience — aroma, grind texture, cooking result…"
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-white border border-[#DDD7CA] text-[13px] text-[#171714] placeholder:text-[#68645B] focus:outline-none focus:border-[#171714] resize-none transition-colors"
                    style={{ minHeight: 100 }}
                  />
                  <button
                    type="submit"
                    disabled={!newReviewComment.trim()}
                    className="bg-[#171714] text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] flex items-center gap-2.5 cursor-pointer hover:bg-[#A63D2F] transition-colors duration-300 disabled:opacity-40 disabled:hover:bg-[#171714]"
                  >
                    Publish Review
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
