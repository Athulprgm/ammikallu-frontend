import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import { Search, SlidersHorizontal, RefreshCw, Sparkles, Leaf, ArrowRight } from 'lucide-react';

export default function ShopPage() {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [vegOnly, setVegOnly] = useState(false);
  const [stoneGroundOnly, setStoneGroundOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'

  // Filter products
  let filteredProducts = products.filter(p => p.status === 'approved');

  if (selectedCategoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === selectedCategoryId);
  }

  if (vegOnly) {
    filteredProducts = filteredProducts.filter(p => p.isVegetarian);
  }

  if (stoneGroundOnly) {
    filteredProducts = filteredProducts.filter(p => p.stoneGround);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.ingredients && p.ingredients.toLowerCase().includes(q))
    );
  }

  // Sorting logic
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      
      {/* Top Shop Marquee Banner */}
      <Marquee
        items={[
          'Cold Stone-Ground Spices',
          'Single-Origin Kasargod Roots',
          'Tellicherry Pepper Extra Bold',
          'Zero Industrial Additives',
          'Small-Batch Kerala Home Bakes',
          'Aroma-Sealed Packaging',
          'Direct from Verified Artisans'
        ]}
        speed={32}
        className="py-3 border-y border-[#DDD7CA] text-[#68645B] text-xs font-mono mb-10"
      />

      <div className="container-editorial">

        {/* Editorial Header */}
        <div className="pb-8 border-b border-[#DDD7CA] mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="label text-[#A63D2F] block mb-2">
              നാടൻ ചന്ത • The Ammikallu Pantry
            </span>
            <h1 className="display-lg text-[#171714]">
              {activeCategory ? activeCategory.name : 'All Handcrafted Produce'}
            </h1>
            <p className="body-text mt-3 max-w-xl">
              Stone-ground single origin spices, roasted masalas, clay-pot pickles, and traditional Kerala tea-time bakes.
            </p>
          </div>

          {/* Reset Filters / Count indicator */}
          <div className="flex items-center gap-4">
            <span className="label text-xs text-[#68645B]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </span>

            {(selectedCategoryId || vegOnly || stoneGroundOnly || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setVegOnly(false);
                  setStoneGroundOnly(false);
                  setSearchQuery('');
                }}
                className="label text-[11px] px-3.5 py-1.5 border border-[#171714] text-[#171714] hover:bg-[#171714] hover:text-[#F5F1E8] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Strips */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`label text-[11px] px-4 py-2.5 border transition-all duration-300 shrink-0 cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-[#171714] text-white border-[#171714]'
                : 'bg-transparent text-[#68645B] border-[#DDD7CA] hover:border-[#171714] hover:text-[#171714]'
            }`}
          >
            All Items ({products.filter(p => p.status === 'approved').length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`label text-[11px] px-4 py-2.5 border transition-all duration-300 shrink-0 cursor-pointer flex items-center gap-2 ${
                selectedCategoryId === cat.id
                  ? 'bg-[#171714] text-white border-[#171714]'
                  : 'bg-transparent text-[#68645B] border-[#DDD7CA] hover:border-[#171714] hover:text-[#171714]'
              }`}
            >
              <span>{cat.name}</span>
              <span className="opacity-50 text-[9px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Controls Toolbar: Search + Toggles + Sort */}
        <div className="bg-[#EEEBE3]/50 p-4 border border-[#DDD7CA] flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search turmeric, pepper, snacks..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DDD7CA] text-xs text-[#171714] placeholder-[#68645B]/60 focus:outline-none focus:border-[#171714] transition-colors"
            />
            <Search className="w-4 h-4 text-[#68645B] absolute left-3 top-3" />
          </div>

          {/* Toggles and Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
            
            {/* Stone Ground Only */}
            <button
              onClick={() => setStoneGroundOnly(!stoneGroundOnly)}
              className={`label text-[10px] px-3.5 py-2 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                stoneGroundOnly
                  ? 'bg-[#171714] text-white border-[#171714]'
                  : 'bg-white text-[#68645B] border-[#DDD7CA] hover:border-[#171714]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C99518]" />
              <span>Stone-Ground</span>
            </button>

            {/* Veg Only */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`label text-[10px] px-3.5 py-2 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                vegOnly
                  ? 'bg-[#46513A] text-white border-[#46513A]'
                  : 'bg-white text-[#68645B] border-[#DDD7CA] hover:border-[#171714]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>100% Veg</span>
            </button>

            {/* Sort select */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#DDD7CA]">
              <SlidersHorizontal className="w-3 h-3 text-[#68645B]" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[#171714] focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid with Staggered Entrance */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA]">
            {filteredProducts.map((prod, i) => (
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
            <div className="w-12 h-12 border border-[#DDD7CA] flex items-center justify-center mx-auto text-[#68645B]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#171714]">
              {products.length === 0 ? 'Pantry Catalog is Currently Empty' : 'No produce matching your criteria'}
            </h3>
            <p className="body-text text-sm max-w-sm mx-auto">
              {products.length === 0
                ? 'No items are listed in the catalog yet. Use the Maker Portal or Admin Console to list authentic products.'
                : "We couldn't find items with those exact filters. Try clearing your search query or filters."}
            </p>
            {products.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setVegOnly(false);
                  setStoneGroundOnly(false);
                  setSearchQuery('');
                }}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
