import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  CheckCircle2,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function AdminConsole() {
  const {
    sellers,
    approveSeller,
    rejectSeller,
    products,
    approveProduct,
    rejectProduct,
    orders,
    categories,
    addCategory
  } = useApp();

  const [adminTab, setAdminTab] = useState('sellers'); // 'sellers' | 'products' | 'categories'
  const [newCatName, setNewCatName] = useState('');
  const [newCatMalayalam, setNewCatMalayalam] = useState('');
  const [newCatImage, setNewCatImage] = useState('https://images.unsplash.com/photo-1599818814757-61c01e63a1fa?w=600&q=80');

  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const pendingProducts = products.filter(p => p.status === 'pending');
  const totalPlatformRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName || !newCatMalayalam) return;
    addCategory({
      name: newCatName,
      malayalam: newCatMalayalam,
      image: newCatImage,
      description: `Fresh homemade ${newCatName}`
    });
    setNewCatName('');
    setNewCatMalayalam('');
  };

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      
      <div className="container-editorial">

        {/* Admin Console Header */}
        <div className="bg-[#171714] text-[#F5F1E8] border border-[#DDD7CA] p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#A63D2F] text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl text-white">
                  Platform Admin Console
                </h1>
                <span className="label text-[9px] bg-[#C99518] text-[#171714] px-2.5 py-0.5">
                  Governance
                </span>
              </div>
              <p className="text-xs text-[#F5F1E8]/70 mt-1 font-mono">
                അമ്മിക്കല്ല് Marketplace Quality Control, Maker Verification & Taxonomy
              </p>
            </div>
          </div>
        </div>

        {/* 4 Analytics Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA] mb-10">
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Total Platform GMV</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#171714]">₹{totalPlatformRevenue}</span>
              <TrendingUp className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Pending Makers</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#C99518]">{pendingSellers.length}</span>
              <Users className="w-4 h-4 text-[#C99518]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Pending Moderations</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#A63D2F]">{pendingProducts.length}</span>
              <Package className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Verified Artisans</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#46513A]">{sellers.length}</span>
              <Store className="w-4 h-4 text-[#46513A]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#DDD7CA] overflow-x-auto pb-px mb-8 scrollbar-none">
          <button
            onClick={() => setAdminTab('sellers')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 ${
              adminTab === 'sellers'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            Artisan Applications ({sellers.length})
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 ${
              adminTab === 'products'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            Product Quality Queue ({products.length})
          </button>

          <button
            onClick={() => setAdminTab('categories')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 ${
              adminTab === 'categories'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            Taxonomy & Collections ({categories.length})
          </button>
        </div>

        {/* Tab 1: Seller Applications Queue */}
        {adminTab === 'sellers' && (
          <div className="bg-white border border-[#DDD7CA] overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#DDD7CA] flex items-center justify-between text-xs font-mono text-[#68645B]">
              <span className="label text-[10px]">Registered Kitchen Artisans ({sellers.length})</span>
              <span className="label text-[10px]">Verification Action</span>
            </div>

            <div className="divide-y divide-[#DDD7CA]">
              {sellers.map(s => (
                <div key={s.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={s.image} alt={s.name} className="w-14 h-14 object-cover border border-[#DDD7CA] bg-[#EEEBE3]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-[#171714]">{s.name}</h3>
                        <span className={`label text-[9px] px-2 py-0.5 ${
                          s.status === 'approved' ? 'bg-[#46513A]/10 text-[#46513A] border border-[#46513A]/20' : 'bg-[#C99518]/10 text-[#C99518] border border-[#C99518]/20'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#68645B] mt-0.5 font-mono">
                        {s.city}, {s.district} • Maker: {s.owner} • Phone: {s.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approveSeller(s.id)}
                          className="label text-[10px] px-3.5 py-1.5 bg-[#46513A] text-white hover:bg-[#39422F] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => rejectSeller(s.id)}
                          className="label text-[10px] px-3.5 py-1.5 border border-[#A63D2F] text-[#A63D2F] hover:bg-[#A63D2F] hover:text-white transition-all cursor-pointer"
                        >
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="label text-[10px] text-[#46513A] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Product Approval Queue */}
        {adminTab === 'products' && (
          <div className="bg-white border border-[#DDD7CA] overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#DDD7CA] flex items-center justify-between text-xs font-mono text-[#68645B]">
              <span className="label text-[10px]">Submitted Marketplace Produce ({products.length})</span>
              <span className="label text-[10px]">Quality Decision</span>
            </div>

            <div className="divide-y divide-[#DDD7CA]">
              {products.map(p => (
                <div key={p.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover border border-[#DDD7CA] bg-[#EEEBE3]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-[#171714]">{p.name}</h3>
                        <span className={`label text-[9px] px-2 py-0.5 ${
                          p.status === 'approved' ? 'bg-[#46513A]/10 text-[#46513A] border border-[#46513A]/20' : 'bg-[#C99518]/10 text-[#C99518] border border-[#C99518]/20'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#68645B] mt-0.5 font-mono">
                        Price: ₹{p.salePrice || p.price} • Category: {p.categoryId} • Veg: {p.isVegetarian ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approveProduct(p.id)}
                          className="label text-[10px] px-3.5 py-1.5 bg-[#46513A] text-white hover:bg-[#39422F] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => rejectProduct(p.id)}
                          className="label text-[10px] px-3.5 py-1.5 border border-[#A63D2F] text-[#A63D2F] hover:bg-[#A63D2F] hover:text-white transition-all cursor-pointer"
                        >
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="label text-[10px] text-[#46513A] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live in Store
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Category Management */}
        {adminTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Add Category Form */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-[#DDD7CA] space-y-5">
              <div>
                <span className="label text-[#A63D2F] block mb-1">Taxonomy</span>
                <h3 className="font-serif text-2xl text-[#171714]">Add New Collection</h3>
              </div>
              <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="label text-[10px] text-[#68645B]">Collection Title (English)</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Traditional Spices"
                    required
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="label text-[10px] text-[#68645B]">Malayalam Name (മലയാളം)</label>
                  <input
                    type="text"
                    value={newCatMalayalam}
                    onChange={e => setNewCatMalayalam(e.target.value)}
                    placeholder="e.g. നാടൻ മസാലകൾ"
                    required
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="label text-[10px] text-[#68645B]">Cover Image URL</label>
                  <input
                    type="text"
                    value={newCatImage}
                    onChange={e => setNewCatImage(e.target.value)}
                    required
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                >
                  Create Collection
                </button>
              </form>
            </div>

            {/* Existing Categories */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 border border-[#DDD7CA] space-y-4">
              <div>
                <span className="label text-[#68645B] block mb-1">Active Taxonomy</span>
                <h3 className="font-serif text-2xl text-[#171714]">Marketplace Categories ({categories.length})</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {categories.map(c => (
                  <div key={c.id} className="p-4 border border-[#DDD7CA] bg-[#FAF8F5] space-y-1">
                    <h4 className="font-serif text-base text-[#171714]">{c.name}</h4>
                    <span className="label text-[10px] text-[#A63D2F] block">{c.malayalam}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
