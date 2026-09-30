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
      className="group flex flex-col cursor-pointer transition-all duration-700"
      onClick={() => openProductDetail(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && openProductDetail(product)}
      aria-label={`View ${product.name}`}
    >
      {/* Ultra-Premium Image Stage (Apple Style) */}
      <div
        className={`relative w-full flex items-center justify-center bg-[#F2F2F4] rounded-[32px] overflow-visible mb-6 transition-colors duration-500 group-hover:bg-[#EBEBEF] ${
          isLarge ? 'aspect-[3/4]' : 'aspect-square'
        }`}
      >
        <img
          key={opt.image || product.image}
          src={opt.image || product.image}
          alt={`${product.name} - ${opt.weight}`}
          loading="lazy"
          decoding="async"
          className="max-h-[85%] w-auto max-w-full object-contain transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.12] group-hover:-translate-y-3 group-hover:drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] relative z-10"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Selected weight badge (Minimal) */}
        <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wider bg-white/60 backdrop-blur-md text-[#171714] px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
            {opt.weight}
          </span>
        </div>

        {/* Wishlist Button (Sleek Circle) */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-20 ${
            isWishlisted
              ? 'bg-[#A63D2F] text-white shadow-[0_4px_12px_rgba(166,61,47,0.3)] scale-100'
              : 'bg-white/60 backdrop-blur-md text-[#171714] opacity-0 group-hover:opacity-100 hover:scale-105 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
        </button>

        {/* Purity badge */}
        {product.stoneGround && (
          <div className="absolute top-5 left-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[9px] font-bold tracking-wider uppercase bg-[#171714] text-[#C99518] px-2.5 py-1.5 rounded-full">
              Cold Stone
            </span>
          </div>
        )}
      </div>

      {/* Info Section (Flat, Borderless Typography) */}
      <div className="flex flex-col px-2 flex-1">
        
        {/* Title */}
        <h3 className={`font-serif text-[#171714] leading-[1.15] mb-1.5 tracking-tight group-hover:text-[#A63D2F] transition-colors duration-300 ${
          isLarge ? 'text-3xl' : 'text-2xl'
        }`}>
          {product.name.split('(')[0].trim()}
        </h3>

        {/* Sub-title (Malayalam) */}
        {product.name.includes('(') && (
          <span className="text-[13px] text-[#8C887E] italic mb-3 font-serif tracking-wide block">
            ({product.name.split('(')[1]}
          </span>
        )}

        {/* Short desc */}
        {product.shortDescription && (
          <p className="text-[14px] text-[#524E46] line-clamp-2 mb-6 leading-relaxed flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Sleek Minimal Selectors & Price Row */}
        <div className="mt-auto flex flex-col space-y-5" onClick={e => e.stopPropagation()}>
          
          {/* Weight options */}
          {weightOptions.length > 1 && (
            <div className="flex gap-2 items-center flex-wrap">
              {weightOptions.map((o, i) => {
                const isSelected = selIdx === i;
                return (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setSelIdx(i); }}
                    className={`py-1.5 px-3.5 rounded-full text-center transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#171714] border-[#171714] text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]'
                        : 'bg-transparent border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714]'
                    }`}
                    title={`Switch to ${o.weight} pack`}
                  >
                    <span className="font-mono text-[11px] font-bold tracking-wider">{o.weight}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Price & Action */}
          <div className="flex items-center justify-between border-t border-black/5 pt-4">
            <div className="flex items-baseline gap-2.5">
              <span key={price} className="font-serif text-[28px] text-[#171714] tracking-tight leading-none anim-price-flip">
                ₹{price}
              </span>
              {orig > price && (
                <span className="text-sm text-[#8C887E] line-through font-mono opacity-80">₹{orig}</span>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="bg-[#F2F2F4] text-[#171714] hover:bg-[#171714] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
