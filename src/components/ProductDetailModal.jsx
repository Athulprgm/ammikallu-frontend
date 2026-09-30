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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="bg-[#F5F1E8] w-full max-w-4xl border border-[#DDD7CA] shadow-2xl relative flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#DDD7CA] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="label text-[10px] text-[#A63D2F]">
              {selectedProduct.categoryId === 'curry-powder' || selectedProduct.categoryId === 'spices' ? 'Cold Stone-Ground Curry Powder' : 'Artisanal Blend'}
            </span>
            {selectedProduct.isVegetarian && (
              <span className="label text-[10px] text-[#46513A] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#46513A]"></span>
                100% Veg
              </span>
            )}
            {selectedProduct.stoneGround && (
              <span className="hidden sm:inline-flex items-center gap-1 label text-[10px] text-[#C99518]">
                <Sparkles className="w-3 h-3" />
                Granite Stone Friction
              </span>
            )}
          </div>
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="p-1.5 text-[#171714] hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery with Creative Transition */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square w-full bg-white border border-[#DDD7CA] overflow-hidden relative flex flex-col items-center justify-center p-6">
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={`${selectedProduct.name} - ${activeOption.weight}`}
                  className="max-h-[85%] w-auto max-w-full object-contain anim-pack-switch"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              {/* Gallery Thumbnail Strip */}
              {selectedProduct.gallery?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                        className={`w-16 h-16 border transition-all cursor-pointer bg-white p-1 shrink-0 flex items-center justify-center ${
                          isSelectedThumb ? 'border-[#171714] opacity-100 ring-1 ring-[#171714]' : 'border-[#DDD7CA] opacity-60 hover:opacity-100'
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
                <div className="bg-white p-5 border border-[#DDD7CA] space-y-2.5">
                  <span className="label text-[10px] text-[#46513A] block flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C99518]" />
                    Purity & Origin Assurance
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProduct.purityNotes.map((note, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[#171714]">
                        <Check className="w-3.5 h-3.5 text-[#46513A] shrink-0" />
                        <span className="text-xs text-[#68645B]">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Key Details & Purchasing */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Seller Attribution */}
                {seller && (
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#DDD7CA]">
                    <button
                      onClick={() => {
                        setIsProductModalOpen(false);
                        navigateToSellerStore(seller.id);
                      }}
                      className="label text-[10px] text-[#46513A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {seller.name} • {seller.district}, Kerala
                    </button>
                    <span className="label text-[9px] text-[#68645B]">
                      Verified Artisan
                    </span>
                  </div>
                )}

                {/* Product Title */}
                <h2 className="font-serif text-3xl sm:text-4xl text-[#171714] leading-tight mb-3">
                  {selectedProduct.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex flex-wrap items-center gap-3 text-xs mb-5">
                  <div className="flex items-center gap-1 text-[#C99518] font-serif text-base">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{selectedProduct.rating}</span>
                    <span className="label text-[10px] text-[#68645B] ml-1">({selectedProduct.reviewsCount} reviews)</span>
                  </div>

                  <span className="label text-[10px] text-[#46513A]">
                    • In Stock ({selectedProduct.stock} Available)
                  </span>
                </div>

                {/* Weight Options with Creative Switch */}
                <div className="bg-white p-5 border border-[#DDD7CA] mb-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="label text-[10px] text-[#68645B]">
                      Package Size:
                    </span>
                    <span className="label text-[9px] text-[#46513A]">
                      Image updates with selection
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                        className={`label text-[10px] px-3.5 py-2 border transition-all duration-300 cursor-pointer ${
                          selectedWeightIndex === idx
                            ? 'bg-[#171714] text-white border-[#171714] shadow-xs scale-[1.03]'
                            : 'bg-transparent text-[#68645B] border-[#DDD7CA] hover:border-[#171714] hover:text-[#171714]'
                        }`}
                        title={`Select ${opt.weight} package`}
                      >
                        <span>{opt.weight}</span>
                        <span className="ml-1 opacity-75 font-serif text-xs">₹{opt.salePrice || opt.price}</span>
                      </button>
                    ))}
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-3 border-t border-[#DDD7CA] flex items-baseline justify-between">
                    <div>
                      <span className="label text-[9px] text-[#68645B] block mb-1">Total Amount:</span>
                      <div className="flex items-baseline gap-2">
                        <span key={displaySalePrice} className="font-serif text-3xl text-[#171714] anim-price-flip">
                          ₹{displaySalePrice}
                        </span>
                        {displayPrice > displaySalePrice && (
                          <span className="label text-[11px] text-[#DDD7CA] line-through">
                            ₹{displayPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="label text-[10px] text-[#68645B]">
                      {activeOption.weight} ({selectedProduct.unit})
                    </span>
                  </div>
                </div>

                {/* Quick Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div className="bg-white p-4 border border-[#DDD7CA]">
                    <span className="label text-[9px] text-[#68645B] block mb-1">Processing Method</span>
                    <span className="text-sm text-[#171714] font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C99518]" />
                      {selectedProduct.preparationTime}
                    </span>
                  </div>
                  <div className="bg-white p-4 border border-[#DDD7CA]">
                    <span className="label text-[9px] text-[#68645B] block mb-1">Shelf Life</span>
                    <span className="text-sm text-[#171714] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#46513A]" />
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
              <div className="space-y-4 pt-4 border-t border-[#DDD7CA]">
                <div className="flex items-center gap-4">
                  <span className="label text-[10px] text-[#68645B]">Quantity:</span>
                  <div className="flex items-center border border-[#DDD7CA] bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-mono text-[#171714]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="px-3 py-1.5 text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="label text-[10px] text-[#68645B]">
                    Pack: {activeOption.weight}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 justify-center"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span>Add to Cart • ₹{displaySalePrice * quantity}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-12 h-12 flex items-center justify-center border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#A63D2F] border-[#A63D2F] text-white'
                        : 'bg-white border-[#DDD7CA] text-[#171714] hover:border-[#171714]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Full Ingredients & Allergen Advisory */}
          <div className="bg-white p-6 sm:p-8 border border-[#DDD7CA] space-y-4">
            <h3 className="font-serif text-xl text-[#171714]">
              Ingredients & Culinary Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="label text-[10px] text-[#46513A] block">Pure Ingredients</span>
                <p className="body-text text-sm leading-relaxed">{selectedProduct.ingredients}</p>
              </div>
              <div className="space-y-1">
                <span className="label text-[10px] text-[#A63D2F] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Allergen Advisory
                </span>
                <p className="body-text text-sm leading-relaxed">{selectedProduct.allergenInformation}</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 sm:p-8 border border-[#DDD7CA] space-y-6">
            <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-4">
              <h3 className="font-serif text-xl text-[#171714] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
                Patron Reviews ({productReviews.length})
              </h3>
            </div>

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="space-y-4">
                {productReviews.map(rev => (
                  <div key={rev.id} className="p-5 bg-[#FAF8F5] border border-[#DDD7CA] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#171714]">{rev.userName}</span>
                        <span className="label text-[9px] text-[#46513A] px-2 py-0.5 bg-white border border-[#DDD7CA]">
                          Verified Patron
                        </span>
                      </div>
                      <div className="flex text-[#C99518] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="body-text text-xs italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="label text-[9px] text-[#68645B] block font-mono">{rev.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="body-text text-xs italic">No reviews yet for this product. Be the first to share your experience!</p>
            )}

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-[#DDD7CA] space-y-4">
              <span className="label text-[10px] text-[#68645B] block">
                Submit an Authentic Review
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Meera Nair)"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none focus:border-[#171714]"
                />
                <div className="flex items-center gap-3 bg-white p-3 border border-[#DDD7CA]">
                  <span className="label text-[10px] text-[#68645B]">Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className={`cursor-pointer text-base ${star <= newReviewRating ? 'text-[#C99518]' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience regarding aroma, grind texture, and cooking flavor..."
                value={newReviewComment}
                onChange={e => setNewReviewComment(e.target.value)}
                rows={3}
                className="w-full p-3 border border-[#DDD7CA] bg-white text-xs text-[#171714] focus:outline-none focus:border-[#171714]"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Feedback</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
