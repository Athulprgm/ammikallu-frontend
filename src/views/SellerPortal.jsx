import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Package,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle2,
  X,
  Award,
  Sparkles
} from 'lucide-react';

export default function SellerPortal() {
  const {
    sellers,
    currentSellerId,
    products,
    orders,
    updateSellerOrderStatus,
    saveSellerProduct,
    deleteProduct,
    categories
  } = useApp();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const seller = sellers.find(s => s.id === currentSellerId) || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === seller.id);

  // Form State for New/Edit Product
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cakes',
    price: 300,
    salePrice: 260,
    weight: '500g',
    unit: 'Box',
    preparationTime: '1 Day',
    shelfLife: '30 Days',
    ingredients: 'Organic ingredients, Pure Desi Ghee / Butter.',
    allergenInformation: 'Contains Dairy.',
    isVegetarian: true,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    description: 'Homemade fresh traditional delicacy prepared with family recipes.'
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: 'cakes',
      price: 300,
      salePrice: 260,
      weight: '500g',
      unit: 'Box',
      preparationTime: '1 Day',
      shelfLife: '30 Days',
      ingredients: 'Organic ingredients, Pure Desi Ghee / Butter.',
      allergenInformation: 'Contains Dairy.',
      isVegetarian: true,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
      description: 'Homemade fresh traditional delicacy prepared with family recipes.'
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      salePrice: product.salePrice || product.price,
      weight: product.weight,
      unit: product.unit,
      preparationTime: product.preparationTime,
      shelfLife: product.shelfLife,
      ingredients: product.ingredients,
      allergenInformation: product.allergenInformation,
      isVegetarian: product.isVegetarian,
      stock: product.stock,
      image: product.image,
      description: product.description
    });
    setIsAddEditModalOpen(true);
  };

  const handleSubmitProductForm = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    saveSellerProduct({
      ...(editingProduct ? { id: editingProduct.id } : {}),
      ...formData,
      sellerId: seller.id
    });
    setIsAddEditModalOpen(false);
  };

  // Filter orders containing this seller's products
  const sellerOrders = orders.filter(o => o.items.some(i => i.sellerId === seller.id));
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      
      <div className="container-editorial">

        {/* Editorial Seller Command Banner */}
        <div className="bg-[#171714] text-[#F5F1E8] border border-[#DDD7CA] p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#EEEBE3] border border-white/20 overflow-hidden shrink-0">
              <img
                src={seller.image}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl text-white">
                  {seller.name}
                </h1>
                <span className="label text-[9px] bg-[#46513A] text-white px-2.5 py-0.5">
                  {seller.status}
                </span>
              </div>
              <p className="text-xs text-[#F5F1E8]/70 mt-1 font-mono">
                {seller.malayalamName} • {seller.city}, {seller.district} (Home Maker: {seller.owner})
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>Add New Item</span>
          </button>
        </div>

        {/* 4 Editorial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA] mb-10">
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Gross Kitchen Sales</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#171714]">₹{totalRevenue}</span>
              <DollarSign className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Total Orders</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#171714]">{sellerOrders.length}</span>
              <Package className="w-4 h-4 text-[#46513A]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Active Pantry Items</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#171714]">{sellerProducts.length}</span>
              <Store className="w-4 h-4 text-[#C99518]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Patron Review Score</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#C99518]">★ {seller.rating}</span>
              <Award className="w-4 h-4 text-[#C99518]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#DDD7CA] overflow-x-auto pb-px mb-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            Product Catalog ({sellerProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            Kitchen Fulfillment Orders ({sellerOrders.length})
          </button>
        </div>

        {/* Tab 1: Product Catalog Manager */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#DDD7CA] overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#DDD7CA] flex items-center justify-between text-xs font-mono text-[#68645B]">
              <span className="label text-[10px]">Active Inventory ({sellerProducts.length})</span>
              <span className="label text-[10px]">Moderation Status</span>
            </div>

            <div className="divide-y divide-[#DDD7CA]">
              {sellerProducts.map(prod => (
                <div key={prod.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover border border-[#DDD7CA] bg-[#EEEBE3]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-[#171714]">{prod.name}</h3>
                        <span className={`label text-[9px] px-2 py-0.5 ${
                          prod.status === 'approved' ? 'bg-[#46513A]/10 text-[#46513A] border border-[#46513A]/20' : 'bg-[#C99518]/10 text-[#C99518] border border-[#C99518]/20'
                        }`}>
                          {prod.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#68645B] block mt-1 font-mono">
                        Price: ₹{prod.salePrice || prod.price} • Stock: {prod.stock} units • Prep: {prod.preparationTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="label text-[10px] px-3.5 py-1.5 border border-[#DDD7CA] bg-white hover:border-[#171714] text-[#171714] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="label text-[10px] px-3 py-1.5 border border-[#DDD7CA] bg-white hover:border-[#A63D2F] text-[#A63D2F] transition-all cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Kitchen Fulfillment Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {sellerOrders.map(order => (
              <div key={order.id} className="bg-white border border-[#DDD7CA] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDD7CA]">
                  <div>
                    <span className="font-serif text-xl text-[#171714]">Order #{order.id}</span>
                    <span className="text-xs text-[#68645B] block mt-0.5 font-mono">Customer: {order.customerName} ({order.phone})</span>
                  </div>

                  {/* Status Updater */}
                  <div className="flex items-center gap-2">
                    <span className="label text-[10px] text-[#68645B]">Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={e => updateSellerOrderStatus(order.id, e.target.value)}
                      className="p-2 border border-[#DDD7CA] bg-[#FAF8F5] text-xs font-mono text-[#171714] focus:outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing (In Kitchen)</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Items for this seller */}
                <div className="space-y-2 text-xs">
                  {order.items.filter(i => i.sellerId === seller.id).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#DDD7CA]">
                      <span className="font-serif text-sm text-[#171714]">{item.productName} × {item.quantity}</span>
                      <span className="font-serif text-sm text-[#A63D2F]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-[#F5F1E8] w-full max-w-2xl border border-[#DDD7CA] shadow-2xl max-h-[90vh] flex flex-col">
              
              <div className="p-5 bg-white border-b border-[#DDD7CA] flex items-center justify-between sticky top-0 z-10">
                <h3 className="font-serif text-2xl text-[#171714]">
                  {editingProduct ? 'Edit Artisan Item' : 'Add New Artisan Produce'}
                </h3>
                <button onClick={() => setIsAddEditModalOpen(false)} className="p-1 text-[#171714] hover:opacity-60 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitProductForm} className="p-6 md:p-8 overflow-y-auto space-y-5 text-xs">
                <div className="space-y-1.5">
                  <label className="label text-[10px] text-[#68645B] block">Product Title</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Tellicherry Bold Black Pepper"
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none focus:border-[#171714]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Dietary Standard</label>
                    <select
                      value={formData.isVegetarian ? 'veg' : 'non-veg'}
                      onChange={e => setFormData({ ...formData, isVegetarian: e.target.value === 'veg' })}
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    >
                      <option value="veg">100% Vegetarian</option>
                      <option value="non-veg">Contains Egg / Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Sale Price (₹)</label>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Stock Qty</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      required
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Prep Time</label>
                    <input
                      type="text"
                      value={formData.preparationTime}
                      onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                      placeholder="e.g. 1 Day"
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="label text-[10px] text-[#68645B] block">Shelf Life</label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={e => setFormData({ ...formData, shelfLife: e.target.value })}
                      placeholder="e.g. 60 Days"
                      className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="label text-[10px] text-[#68645B] block">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label text-[10px] text-[#68645B] block">Ingredients & Processing</label>
                  <textarea
                    value={formData.ingredients}
                    onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                    rows={2}
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                >
                  Save & Publish Item
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
