import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Heart,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Award,
  Check,
  ArrowRight
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isProductModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    <div 
      className="fixed inset-0 z-[1000] bg-[#171714]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in overscroll-contain" 
      style={{ overscrollBehavior: 'contain' }}
      onClick={() => setIsProductModalOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-[1200px] h-[95vh] md:h-[90vh] rounded-[32px] md:rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative flex flex-col md:flex-row overflow-hidden border border-white/20 ring-1 ring-black/5"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Floating Close Button */}
        <button
          onClick={() => setIsProductModalOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-black/5 flex items-center justify-center text-[#171714] hover:bg-[#A63D2F] hover:text-white transition-all duration-300 cursor-pointer z-[1050] group"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
        </button>

        {/* Left Column: Immersive Image */}
        <div className="w-full md:w-[45%] h-[40vh] md:h-full bg-[#F5F2EB]/60 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden shrink-0 border-r border-black/5">
          <style>{`
            @keyframes productModalFloat {
              0% { transform: translateY(0); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1)); }
              50% { transform: translateY(-15px); filter: drop-shadow(0 35px 45px rgba(0,0,0,0.15)); }
              100% { transform: translateY(0); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1)); }
            }
            .anim-modal-product {
              animation: productModalFloat 7s ease-in-out infinite;
            }
          `}</style>
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none select-none">
            <span className="font-serif text-[25vw] md:text-[12vw] font-black text-black/[0.03] whitespace-nowrap -rotate-[15deg] scale-[1.3] tracking-tighter mix-blend-multiply">
              {selectedProduct.categoryId === 'curry-powder' ? 'PURE' : 'FRESH'}
            </span>
          </div>

        <img
          key={activeImage}
          src={activeImage}
          alt={`${selectedProduct.name} - ${activeOption.weight}`}
          className="w-full h-full object-contain anim-modal-product relative z-10 drop-shadow-2xl transition-transform duration-1000 hover:scale-105"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Gallery Thumbnail Strip Overlay */}
        {selectedProduct.gallery?.length > 1 && (
          <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3 px-4 z-20">
            {selectedProduct.gallery.map((img, idx) => {
              const isSelectedThumb = activeImage === img;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    const matchingWeightIdx = weightOptions.findIndex(w => w.image === img);
                    if (matchingWeightIdx >= 0) setSelectedWeightIndex(matchingWeightIdx);
                  }}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-[14px] transition-all duration-300 cursor-pointer bg-[#F9F9F9]/90 backdrop-blur-md p-1.5 shadow-sm ${
                    isSelectedThumb ? 'ring-2 ring-black bg-white scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Scrollable Content */}
      <div className="flex-1 md:flex-none md:w-[55%] h-full overflow-y-auto bg-white relative hide-scrollbar overscroll-contain" style={{ overscrollBehavior: 'contain' }}>
        <div className="p-6 md:p-10 lg:p-12 xl:p-14 space-y-12">
          
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A63D2F]">
                {selectedProduct.categoryId === 'curry-powder' || selectedProduct.categoryId === 'spices' ? 'Cold Stone-Ground' : 'Artisanal Blend'}
              </span>
              {seller && (
                <>
                  <span className="text-black/20">•</span>
                  <button
                    onClick={() => {
                      setIsProductModalOpen(false);
                      navigateToSellerStore(seller.id);
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#46513A] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    By {seller.name}
                    <CheckCircle2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>

            <div className="relative">
              <h1 className="font-serif text-4xl md:text-[56px] lg:text-[72px] text-[#171714] leading-[1.05] tracking-tighter">
                {selectedProduct.name.split('(')[0].trim()}
              </h1>
              {selectedProduct.name.includes('(') && (
                <span className="block text-2xl md:text-[36px] text-black/30 font-serif mt-2 italic tracking-wide">
                  {selectedProduct.name.split('(')[1].replace(')', '')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[14px] font-medium pt-2">
              <div className="flex items-center gap-1.5 text-[#171714]">
                <Star className="w-4 h-4 fill-[#C99518] text-[#C99518]" />
                <span className="text-lg">{selectedProduct.rating}</span>
                <span className="text-black/40">({selectedProduct.reviewsCount} reviews)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-black/10"></span>
              <span className="text-[#46513A] uppercase tracking-[0.1em] text-[11px] font-bold">
                {selectedProduct.stock} Available
              </span>
            </div>
          </div>

          <p className="text-base md:text-lg text-[#524E46] leading-relaxed max-w-2xl border-b border-black/5 pb-10">
            {selectedProduct.description}
          </p>

          {/* Size & Purchasing Section */}
          <div className="space-y-12">
            <div>
              <span className="text-[11px] text-black/40 uppercase tracking-[0.2em] font-bold block mb-4">
                Select Your Size
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {weightOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedWeightIndex(idx);
                      if (selectedProduct.gallery && opt.image) {
                        const gIdx = selectedProduct.gallery.findIndex(g => g === opt.image);
                        if (gIdx >= 0) setSelectedImageIndex(gIdx);
                      }
                    }}
                    className={`py-3.5 px-8 rounded-full text-center transition-all duration-500 cursor-pointer border ${
                      selectedWeightIndex === idx
                        ? 'border-[#171714] bg-[#171714] text-white shadow-[0_12px_24px_rgba(0,0,0,0.15)] scale-[1.02]'
                        : 'border-black/10 bg-transparent text-[#68645B] hover:border-black/30 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <span className="font-mono text-[14px] font-bold tracking-tight">{opt.weight}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-black/40 uppercase tracking-[0.2em] font-bold mb-2">Total Amount</span>
                <div className="flex items-baseline gap-4">
                  <span key={displaySalePrice} className="font-serif text-[56px] md:text-[72px] text-[#171714] anim-price-flip leading-none tracking-tighter">
                    ₹{displaySalePrice * quantity}
                  </span>
                  {displayPrice > displaySalePrice && (
                    <span className="text-2xl text-black/30 line-through font-serif italic">
                      ₹{displayPrice * quantity}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5 w-full xl:w-auto">
                <div className="flex items-center justify-start xl:justify-end gap-4 pr-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/40">Quantity</span>
                  <div className="flex items-center bg-[#F5F2EB] rounded-full p-1.5 shadow-inner border border-black/5">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all cursor-pointer text-xl font-mono">-</button>
                    <span className="w-12 text-center text-[15px] font-bold font-mono">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all cursor-pointer text-xl font-mono">+</button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 xl:flex-none bg-[#171714] text-white px-10 py-5 rounded-full text-[13px] uppercase tracking-[0.15em] font-bold transition-all duration-500 cursor-pointer hover:bg-[#A63D2F] hover:shadow-[0_16px_32px_rgba(166,61,47,0.3)] hover:-translate-y-1 group/add flex items-center justify-center gap-4"
                  >
                    <span className="whitespace-nowrap">Add to Bag</span>
                    <ShoppingBag className="w-5 h-5 transition-transform group-hover/add:scale-110" />
                  </button>
                  
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer border ${
                      isWishlisted
                        ? 'bg-[#A63D2F] border-[#A63D2F] text-white shadow-[0_8px_16px_rgba(166,61,47,0.2)]'
                        : 'bg-white border-black/10 text-[#171714] hover:border-black/30 hover:bg-black/5'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Info Cards & Purity Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 border-t border-black/5">
            <div className="border border-black/5 p-5 rounded-[24px] bg-[#F9F9F9] flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68645B] block mb-2">Processing</span>
              <span className="text-[14px] font-medium text-[#171714] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C99518]" />
                {selectedProduct.preparationTime}
              </span>
            </div>
            <div className="border border-black/5 p-5 rounded-[24px] bg-[#F9F9F9] flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68645B] block mb-2">Shelf Life</span>
              <span className="text-[14px] font-medium text-[#171714] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#46513A]" />
                {selectedProduct.shelfLife}
              </span>
            </div>
            {selectedProduct.purityNotes && selectedProduct.purityNotes.length > 0 && (
              <div className="border border-[#C99518]/20 p-5 rounded-[24px] bg-[#C99518]/5 flex flex-col justify-center sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C99518] block mb-2">Guarantee</span>
                <span className="text-[14px] font-medium text-[#171714] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C99518]" />
                  Purity Assured
                </span>
              </div>
            )}
          </div>

          {/* Culinary Profile */}
          <div className="pt-16 space-y-10">
            <h3 className="font-serif text-3xl md:text-5xl text-[#171714] tracking-tight">
              Culinary Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#46513A] block">Pure Ingredients</span>
                <p className="text-base text-[#524E46] leading-relaxed">{selectedProduct.ingredients}</p>
              </div>
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A63D2F] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Allergen Advisory
                </span>
                <p className="text-base text-[#524E46] leading-relaxed">{selectedProduct.allergenInformation}</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-16 pb-20 space-y-12 border-t border-black/5 mt-16">
            <div>
              <h3 className="font-serif text-3xl md:text-5xl text-[#171714] tracking-tight">
                Patron Reviews
              </h3>
              <p className="text-[#68645B] mt-4 text-lg">Based on {productReviews.length} authentic experiences</p>
            </div>

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {productReviews.map(rev => (
                  <div key={rev.id} className="p-8 md:p-10 border border-black/10 rounded-[32px] space-y-6 bg-white/50 hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#C99518] text-lg gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171714]/40">{rev.date}</span>
                    </div>
                    <p className="text-[#171714] text-lg leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-black/5">
                      <span className="font-serif text-xl text-[#171714]">{rev.userName}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#46513A] px-3 py-1.5 bg-[#F5F2EB] rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#68645B] italic text-lg">No reviews yet for this product. Be the first to share your experience!</p>
            )}

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-12 space-y-8 max-w-2xl bg-[#F9F9F9] p-8 md:p-10 rounded-[32px]">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#171714] block">
                Submit an Authentic Review
              </span>
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Meera Nair)"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="bg-white px-6 py-5 border border-black/5 text-[14px] font-medium focus:outline-none focus:border-[#171714] transition-all rounded-[20px] shadow-sm w-full"
                />
                <div className="flex items-center gap-4 bg-white px-6 py-5 border border-black/5 rounded-[20px] shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171714]/60">Rating:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className={`cursor-pointer text-2xl transition-all hover:scale-110 ${star <= newReviewRating ? 'text-[#C99518]' : 'text-gray-200'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Share your experience regarding aroma, grind texture, and cooking flavor..."
                value={newReviewComment}
                onChange={e => setNewReviewComment(e.target.value)}
                rows={4}
                className="w-full bg-white px-6 py-5 border border-black/5 text-[14px] font-medium focus:outline-none focus:border-[#171714] min-h-[140px] resize-y transition-all rounded-[20px] shadow-sm"
              />
              <button
                type="submit"
                disabled={!newReviewComment.trim()}
                className="bg-[#171714] text-white px-10 py-5 rounded-full hover:bg-[#A63D2F] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#171714] hover:shadow-[0_12px_24px_rgba(166,61,47,0.3)] hover:-translate-y-1 text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-4 cursor-pointer w-full sm:w-auto"
              >
                Publish Feedback
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}
