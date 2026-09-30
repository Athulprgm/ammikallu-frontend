import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import {
  Star,
  MapPin,
  CheckCircle2,
  Award,
  ArrowLeft,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function SellerStorefront() {
  const {
    sellers,
    selectedSellerId,
    products,
    setCurrentView,
    navigateToShop
  } = useApp();

  const seller = sellers.find(s => s.id === selectedSellerId) || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === seller.id && p.status === 'approved');

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      
      <div className="container-editorial">

        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="label text-[11px] text-[#68645B] hover:text-[#171714] transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Store Header Editorial Showcase */}
        <div className="border border-[#DDD7CA] bg-white overflow-hidden mb-12">
          
          {/* Cover Image banner */}
          <div className="h-56 sm:h-72 w-full bg-[#EEEBE3] relative overflow-hidden">
            <img
              src={seller.coverImage || seller.image}
              alt={seller.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute top-6 right-6">
              <span className="label text-[10px] bg-[#171714]/80 text-[#F5F1E8] border border-white/20 px-3 py-1.5 backdrop-blur-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C99518]" /> Verified Kerala Artisan
              </span>
            </div>
          </div>

          {/* Profile Details Bar */}
          <div className="p-6 md:p-10 relative -mt-16 sm:-mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#DDD7CA]">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-white bg-[#EEEBE3] overflow-hidden shrink-0 shadow-lg">
                <img
                  src={seller.image}
                  alt={seller.owner}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Location */}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-serif text-3xl sm:text-5xl text-[#171714]">
                    {seller.name}
                  </h1>
                  {seller.verified && (
                    <CheckCircle2 className="w-5 h-5 text-[#46513A] shrink-0" title="Verified Home Kitchen" />
                  )}
                </div>
                <span className="label text-[11px] text-[#A63D2F] block mt-1">
                  {seller.malayalamName} • Home Maker: {seller.owner}
                </span>
                <p className="text-xs text-[#68645B] flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A63D2F]" />
                    {seller.city}, {seller.district}, Kerala
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C99518]" />
                    Kitchen Active Since {seller.joinedDate?.split('-')[0] || '2023'}
                  </span>
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 border border-[#DDD7CA] bg-[#F5F1E8] px-6 py-3 shrink-0">
              <div className="text-center">
                <span className="font-serif text-2xl text-[#C99518] flex items-center justify-center gap-1">
                  ★ {seller.rating}
                </span>
                <span className="label text-[9px] text-[#68645B] block">{seller.reviewsCount} reviews</span>
              </div>
              <div className="w-[1px] h-8 bg-[#DDD7CA]" />
              <div className="text-center">
                <span className="font-serif text-2xl text-[#171714]">
                  {sellerProducts.length}
                </span>
                <span className="label text-[9px] text-[#68645B] block">Available Items</span>
              </div>
            </div>

          </div>

          {/* Description & Artisan Badges */}
          <div className="p-6 md:p-10 bg-[#FAF8F5] space-y-4">
            <span className="label text-[10px] text-[#68645B] block">Artisan Kitchen Story</span>
            <p className="body-text max-w-3xl leading-relaxed">
              {seller.description}
            </p>

            {seller.badges && seller.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {seller.badges.map((b, i) => (
                  <span
                    key={i}
                    className="label text-[10px] px-3 py-1 bg-white border border-[#DDD7CA] text-[#46513A] flex items-center gap-1.5"
                  >
                    <Award className="w-3 h-3 text-[#C99518]" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Specialties Ribbon */}
        <Marquee
          items={[
            `${seller.name} Speciality Kitchen`,
            'Small-Batch Hand Ground',
            'Zero Industrial Preservatives',
            'Prepared on Order Receipt',
            `${seller.district} Authentic Home Recipe`,
            'Direct Farm Sourced'
          ]}
          speed={35}
          className="py-3 border-y border-[#DDD7CA] text-[#68645B] text-xs font-mono mb-12"
        />

        {/* Product Catalog Section */}
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#DDD7CA] pb-4">
            <div>
              <span className="label text-[#A63D2F] block mb-1">
                ഉൽപ്പന്നങ്ങൾ • Kitchen Catalog
              </span>
              <h2 className="display-md text-[#171714]">
                Fresh Handcrafted Items by {seller.owner}
              </h2>
            </div>
            <span className="label text-xs text-[#68645B]">
              {sellerProducts.length} Items Listed
            </span>
          </div>

          {sellerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA]">
              {sellerProducts.map((prod, i) => (
                <div
                  key={prod.id}
                  className="bg-[#F5F1E8] animate-fade-in-up"
                  style={{ animationDelay: `${(i % 8) * 60}ms` }}
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center border border-[#DDD7CA] bg-white space-y-4">
              <p className="body-text">No active items are currently listed for this kitchen.</p>
              <button
                onClick={() => navigateToShop()}
                className="btn-primary"
              >
                Browse All Marketplace Spices
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
