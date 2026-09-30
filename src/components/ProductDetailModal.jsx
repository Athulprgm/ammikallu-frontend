import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Heart,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  Check
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

  // Determine displayed image: prioritize weight-selected pack image
  const activeImage = activeOption.image || selectedProduct.gallery?.[selectedImageIndex] || selectedProduct.image;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="bg-white w-full max-w-[960px] rounded-[24px] md:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] relative flex flex-col max-h-[95vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-5 md:px-10 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 border-b border-black/5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A63D2F]">
              {selectedProduct.categoryId === 'curry-powder' || selectedProduct.categoryId === 'spices' ? 'Cold Stone-Ground' : 'Artisanal Blend'}
            </span>
            {selectedProduct.isVegetarian && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#46513A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#46513A]"></span>
                100% Veg
              </span>
            )}
            {selectedProduct.stoneGround && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#C99518]">
                <Sparkles className="w-3.5 h-3.5" />
                Granite Friction
              </span>
            )}
          </div>
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#171714] hover:bg-[#EBE7DF] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 md:p-10 overflow-y-auto space-y-10 hide-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Image Gallery with Creative Transition */}
            <div className="md:col-span-6 space-y-6">
              <div className="aspect-[4/5] w-full bg-[#F9F9F9] rounded-[24px] overflow-hidden relative flex flex-col items-center justify-center p-8 group">
                <style>{`
                  @keyframes productModalFloat {
                    0% { transform: scale(1) translateY(0); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1)); }
                    50% { transform: scale(1.06) translateY(-12px); filter: drop-shadow(0 25px 35px rgba(0,0,0,0.2)); }
                    100% { transform: scale(1) translateY(0); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1)); }
                  }
                  .anim-modal-product {
                    animation: productModalFloat 6s ease-in-out infinite;
                  }
                `}</style>
                
                {/* Giant watermark text behind */}
                <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none select-none">
                  <span className="font-serif text-[18vw] md:text-[9vw] font-black text-[#EFEFEF] whitespace-nowrap opacity-80 -rotate-[10deg] scale-[1.3] tracking-tighter mix-blend-multiply">
                    {selectedProduct.name.split('(')[0].trim().toUpperCase()}
                  </span>
                </div>

                <img
                  key={activeImage}
                  src={activeImage}
                  alt={`${selectedProduct.name} - ${activeOption.weight}`}
                  className="max-h-[85%] w-auto max-w-full object-contain anim-modal-product relative z-10 anim-pack-switch"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              {/* Gallery Thumbnail Strip */}
              {selectedProduct.gallery?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
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
                        className={`w-[72px] h-[72px] rounded-2xl transition-all duration-300 cursor-pointer bg-[#F9F9F9] p-2 shrink-0 flex items-center justify-center ${
                          isSelectedThumb ? 'ring-2 ring-black shadow-md bg-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Purity Guarantee */}
              {selectedProduct.purityNotes && selectedProduct.purityNotes.length > 0 && (
                <div className="bg-[#F9F9F9] p-6 rounded-[24px] space-y-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171714] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C99518]" />
                    Purity & Origin Assurance
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {selectedProduct.purityNotes.map((note, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#171714]">
                        <Check className="w-4 h-4 text-[#46513A] shrink-0" />
                        <span className="text-[#68645B] leading-tight">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Key Details & Purchasing */}
            <div className="md:col-span-6 flex flex-col space-y-8">
              <div>
                {/* Seller Attribution */}
                {seller && (
                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-black/5">
                    <button
                      onClick={() => {
                        setIsProductModalOpen(false);
                        navigateToSellerStore(seller.id);
                      }}
                      className="text-[12px] font-medium text-[#46513A] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {seller.name} • {seller.district}, Kerala
                    </button>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#68645B]">
                      Verified Artisan
                    </span>
                  </div>
                )}

                {/* Product Title */}
                <h2 className="font-serif text-3xl md:text-[44px] text-[#171714] leading-[1.05] tracking-tight mb-4">
                  {selectedProduct.name.split('(')[0].trim()}
                  {selectedProduct.name.includes('(') && (
                    <span className="block text-2xl md:text-3xl text-[#68645B] mt-1 opacity-80">
                      ({selectedProduct.name.split('(')[1]}
                    </span>
                  )}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
                  <div className="flex items-center gap-1.5 text-[#C99518] font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-[#68645B] ml-1">({selectedProduct.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-[#DDD7CA]">|</span>
                  <span className="text-[#46513A] font-medium">
                    In Stock <span className="opacity-70">({selectedProduct.stock} Available)</span>
                  </span>
                </div>

                {/* Weight Options with Creative Switch */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171714]">
                      Select Size
                    </span>
                  </div>

                  <div className="bg-[#F9F9F9] p-1.5 rounded-2xl flex flex-wrap gap-1">
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
                        className={`flex-1 min-w-[28%] py-3 px-3 rounded-xl transition-all duration-300 cursor-pointer text-center ${
                          selectedWeightIndex === idx
                            ? 'bg-white text-[#171714] shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.02]'
                            : 'bg-transparent text-[#68645B] hover:bg-black/5 hover:text-[#171714]'
                        }`}
                        title={`Select ${opt.weight} package`}
                      >
                        <div className="font-mono text-[13px] font-semibold">{opt.weight}</div>
                        <div className="text-[11px] opacity-60 font-medium">₹{opt.salePrice || opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                  {/* Pricing Display */}
                  <div className="flex items-end justify-between mb-8 pb-8 border-b border-black/5">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68645B] block mb-1">Total Amount</span>
                      <div className="flex items-baseline gap-2">
                        <span key={displaySalePrice} className="font-serif text-[44px] text-[#171714] leading-none anim-price-flip tracking-tight">
                          ₹{displaySalePrice}
                        </span>
                        {displayPrice > displaySalePrice && (
                          <span className="text-[#68645B] line-through text-xl font-serif opacity-70">₹{displayPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#F9F9F9] p-5 rounded-2xl">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#68645B] block mb-2">Processing</span>
                      <span className="text-[13px] font-medium text-[#171714] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C99518]" />
                        {selectedProduct.preparationTime}
                      </span>
                    </div>
                    <div className="bg-[#F9F9F9] p-5 rounded-2xl">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#68645B] block mb-2">Shelf Life</span>
                      <span className="text-[13px] font-medium text-[#171714] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#46513A]" />
                        {selectedProduct.shelfLife}
                      </span>
                    </div>
                  </div>

                {/* Description */}
                <p className="body-text text-sm leading-relaxed mb-5">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Quantity Controls & Add to Cart */}
              <div className="space-y-6 pt-6 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68645B]">Quantity</span>
                    <div className="flex items-center bg-[#F9F9F9] rounded-xl p-1 border border-black/5">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg text-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer flex items-center justify-center text-[#171714]"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-[13px] font-mono text-[#171714] font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="w-8 h-8 rounded-lg text-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer flex items-center justify-center text-[#171714]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#171714] hover:bg-[#A63D2F] text-white rounded-[16px] py-4 flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(166,61,47,0.3)] hover:-translate-y-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-semibold tracking-wide">Add to Cart • ₹{displaySalePrice * quantity}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-14 h-14 rounded-[16px] flex items-center justify-center transition-all cursor-pointer border ${
                      isWishlisted
                        ? 'bg-[#A63D2F] border-[#A63D2F] text-white shadow-[0_8px_16px_rgba(166,61,47,0.2)]'
                        : 'bg-[#F9F9F9] border-black/5 text-[#171714] hover:bg-white hover:border-black/10'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Full Ingredients & Allergen Advisory */}
          <div className="bg-[#F9F9F9] p-8 md:p-10 rounded-[24px] space-y-6">
            <h3 className="font-serif text-2xl text-[#171714]">
              Ingredients & Culinary Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#46513A] block">Pure Ingredients</span>
                <p className="text-[#68645B] leading-relaxed">{selectedProduct.ingredients}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A63D2F] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Allergen Advisory
                </span>
                <p className="body-text text-sm leading-relaxed">{selectedProduct.allergenInformation}</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#F9F9F9] p-8 md:p-10 rounded-[24px] space-y-8">
            <div className="flex items-center justify-between border-b border-black/5 pb-5">
              <h3 className="font-serif text-2xl text-[#171714] flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#A63D2F]" strokeWidth={1.5} />
                Patron Reviews ({productReviews.length})
              </h3>
            </div>

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="space-y-6">
                {productReviews.map(rev => (
                  <div key={rev.id} className="p-6 bg-white rounded-[16px] border border-black/5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg text-[#171714]">{rev.userName}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#46513A] px-2 py-1 bg-[#F5F5F7] rounded-full">
                          Verified Patron
                        </span>
                      </div>
                      <div className="flex text-[#C99518] text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#68645B] leading-relaxed italic text-[14px]">
                      "{rev.comment}"
                    </p>
                    <span className="text-[11px] font-medium text-[#68645B] block font-mono">{rev.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#68645B] italic text-[14px]">No reviews yet for this product. Be the first to share your experience!</p>
            )}

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-8 border-t border-black/5 space-y-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68645B] block">
                Submit an Authentic Review
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Meera Nair)"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="bg-white px-5 py-3.5 border border-black/10 text-sm focus:outline-none focus:border-[#171714] transition-colors rounded-[12px]"
                />
                <div className="flex items-center gap-3 bg-white px-5 py-3.5 border border-black/10 rounded-[12px]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68645B]">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className={`cursor-pointer text-lg transition-colors ${star <= newReviewRating ? 'text-[#C99518]' : 'text-gray-300 hover:text-gray-400'}`}
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
                rows={3}
                className="w-full bg-white px-5 py-3.5 border border-black/10 text-sm focus:outline-none focus:border-[#171714] min-h-[100px] resize-y transition-colors rounded-[12px]"
              />
              <button
                type="submit"
                disabled={!newReviewComment.trim()}
                className="bg-[#171714] text-white px-8 py-3.5 rounded-[12px] hover:bg-[#A63D2F] transition-all disabled:opacity-50 disabled:hover:bg-[#171714] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer w-auto"
              >
                <Send className="w-4 h-4" />
                Publish Feedback
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
