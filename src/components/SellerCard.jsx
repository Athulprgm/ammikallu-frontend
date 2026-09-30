import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, MapPin, CheckCircle2, Award, ArrowRight } from 'lucide-react';

export default function SellerCard({ seller }) {
  const { navigateToSellerStore } = useApp();

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E1D5] hover:border-[#526B3A]/50 shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between group">
      
      {/* Cover Image & Avatar Banner */}
      <div className="relative h-28 w-full bg-[#F7F2E8]">
        <img
          src={seller.coverImage || seller.image}
          alt={seller.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Location Badge */}
        <div className="absolute top-3 left-3 bg-[#171714]/80 backdrop-blur-md text-[#F7F2E8] text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#C99A2E]" />
          <span>{seller.city}, {seller.district}</span>
        </div>
      </div>

      {/* Seller Content Body */}
      <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
        <div>
          {/* Avatar Photo */}
          <div className="relative -mt-10 mb-3 flex items-end justify-between">
            <div className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white">
              <img
                src={seller.image}
                alt={seller.owner}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-1 bg-[#C99A2E]/15 border border-[#C99A2E]/30 px-2.5 py-1 rounded-full text-[#C99A2E] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{seller.rating}</span>
              <span className="text-[#66635B] text-[11px] font-normal">({seller.reviewsCount})</span>
            </div>
          </div>

          {/* Seller Title & Malayalam Name */}
          <h3 className="font-serif text-lg font-bold text-[#171714] group-hover:text-[#526B3A] transition-colors flex items-center gap-1.5">
            {seller.name}
            {seller.verified && (
              <CheckCircle2 className="w-4 h-4 text-[#526B3A] inline shrink-0" title="Verified Home Kitchen" />
            )}
          </h3>
          <span className="font-ml-sans text-xs text-[#B85C38] font-medium block mb-2">
            {seller.malayalamName} • Home Chef: {seller.owner}
          </span>

          {/* Specialty Description */}
          <p className="text-xs text-[#66635B] leading-relaxed line-clamp-2 mb-3">
            {seller.specialty}
          </p>

          {/* Badges List */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {seller.badges?.map((badge, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#526B3A]/10 text-[#526B3A] px-2 py-0.5 rounded-md"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* View Store Button */}
        <button
          onClick={() => navigateToSellerStore(seller.id)}
          className="w-full py-2.5 rounded-xl bg-[#F7F2E8] hover:bg-[#526B3A] text-[#171714] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-warm-sm"
        >
          <span>Visit Home Kitchen Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
