import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Plus } from 'lucide-react';

export default function ProductCard({ product, size = 'default' }) {
  const { sellers, addToCart, toggleWishlist, wishlist, openProductDetail } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const seller = sellers.find(s => s.id === product.sellerId);

  const weightOptions = product.weightOptions || [{ weight: product.weight, price: product.price, salePrice: product.salePrice }];
  const [selIdx, setSelIdx] = useState(Math.max(0, weightOptions.findIndex(w => w.weight === product.weight)));
  const opt = weightOptions[selIdx] || weightOptions[0];
  const price = opt.salePrice || opt.price;
  const orig  = opt.price;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, opt.weight, price);
  };

  const isLarge = size === 'large';

  return (
    <article
      className="product-card group flex flex-col"
      onClick={() => openProductDetail(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && openProductDetail(product)}
      aria-label={`View ${product.name}`}
    >
      {/* Image Container */}
      <div
        className={`product-card-image bg-white relative overflow-hidden flex flex-col items-center justify-center p-5 border-b border-[#DDD7CA] ${
          isLarge ? 'aspect-[3/4]' : 'aspect-square'
        }`}
      >
        <img
          key={opt.image || product.image}
          src={opt.image || product.image}
          alt={`${product.name} - ${opt.weight}`}
          loading="lazy"
          decoding="async"
          className="max-h-[85%] w-auto max-w-full object-contain anim-pack-switch group-hover:scale-105 transition-transform duration-500"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Selected weight micro-badge */}
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <span className="label text-[9px] bg-[#171714]/85 text-[#F5F1E8] border border-white/20 px-2 py-0.5 backdrop-blur-xs font-mono shadow-sm">
            {opt.weight}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-[#A63D2F] text-white opacity-100'
              : 'bg-white/90 text-[#171714] opacity-0 group-hover:opacity-100'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
        </button>

        {/* Origin tag */}
        {seller && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="label text-[9px] text-white/90">{seller.district}, Kerala</span>
          </div>
        )}

        {/* Purity badge */}
        {product.stoneGround && (
          <div className="absolute top-3 left-3">
            <span className="label text-[9px] bg-[#171714] text-[#C99518] border border-[#C99518]/30 px-2 py-1">Cold Stone</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4 border-t border-[#DDD7CA]">
        {/* Category */}
        {product.categoryId && (
          <span className="label text-[10px] text-[#68645B] mb-2">{product.categoryId.replace(/-/g, ' ')}</span>
        )}

        {/* Name */}
        <h3 className={`font-serif text-[#171714] leading-tight mb-1 group-hover:text-[#A63D2F] transition-colors duration-300 ${
          isLarge ? 'text-2xl' : 'text-lg'
        }`}>
          {product.name}
        </h3>

        {/* Short desc */}
        {product.shortDescription && (
          <p className="text-[13px] text-[#68645B] line-clamp-2 mb-3 leading-relaxed flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Weight options with active creative switch */}
        {weightOptions.length > 1 && (
          <div className="flex items-center gap-1.5 mb-3" onClick={e => e.stopPropagation()}>
            {weightOptions.map((o, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSelIdx(i); }}
                className={`label text-[10px] px-2.5 py-1 border cursor-pointer transition-all duration-300 ${
                  selIdx === i
                    ? 'bg-[#171714] text-white border-[#171714] shadow-xs scale-[1.03]'
                    : 'bg-transparent text-[#68645B] border-[#DDD7CA] hover:border-[#171714] hover:text-[#171714]'
                }`}
                title={`Switch to ${o.weight} pack`}
              >
                {o.weight}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#DDD7CA]" onClick={e => e.stopPropagation()}>
          <div className="flex items-baseline gap-2">
            <span key={price} className="font-serif text-xl text-[#171714] anim-price-flip">
              ₹{price}
            </span>
            {orig > price && (
              <span className="label text-[11px] text-[#DDD7CA] line-through">₹{orig}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 flex items-center justify-center border border-[#DDD7CA] text-[#171714] hover:bg-[#171714] hover:text-white hover:border-[#171714] transition-all duration-300 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
