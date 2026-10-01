import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, Package, Tag, ShoppingCart, LogOut, Plus, Edit, Trash2, X,
  Star, Eye, EyeOff, CheckCircle2, TrendingUp, Search, ChevronDown,
  AlertTriangle, ArrowUpDown
} from 'lucide-react';

const EMPTY_PRODUCT_FORM = {
  name: '',
  categoryId: '',
  price: '',
  salePrice: '',
  stock: 10,
  weight: '250g',
  unit: 'Aroma-Sealed Pouch',
  shortDescription: '',
  description: '',
  ingredients: '',
  image: '',
  status: 'approved',
  isAvailable: true,
  isVegetarian: true,
  featured: false
};

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

export default function AdminConsole() {
  const {
    logout,
    products,
    categories,
    orders,
    saveProduct,
    deleteProduct,
    toggleProductFeatured,
    toggleProductAvailable,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    deleteOrder,
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState('products'); // 'products' | 'categories' | 'orders'

  // ── Product form state ──
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── Search / filter state ──
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // ── Category form state ──
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', malayalam: '', image: '', description: '' });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const outOfStock = products.filter(p => !p.isAvailable || (p.stock || 0) <= 0).length;

  // ── Product handlers ──
  const openAddProduct = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_PRODUCT_FORM, categoryId: categories[0]?.id || '' });
    setFormErrors({});
    setProductModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      categoryId: p.categoryId || categories[0]?.id || '',
      price: p.price ?? '',
      salePrice: p.salePrice ?? '',
      stock: p.stock ?? 0,
      weight: p.weight || '250g',
      unit: p.unit || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      ingredients: p.ingredients || '',
      image: p.image || '',
      status: p.status || 'approved',
      isAvailable: p.isAvailable !== false,
      isVegetarian: p.isVegetarian !== false,
      featured: !!p.featured
    });
    setFormErrors({});
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required';
    if (!form.categoryId) errors.categoryId = 'Pick a category';
    if (form.price === '' || Number(form.price) <= 0) errors.price = 'Enter a valid price';
    if (form.salePrice !== '' && Number(form.salePrice) > Number(form.price)) {
      errors.salePrice = 'Sale price cannot exceed the regular price';
    }
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    saveProduct({
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: form.name.trim(),
      categoryId: form.categoryId,
      price: Number(form.price),
      salePrice: form.salePrice === '' ? null : Number(form.salePrice),
      stock: Number(form.stock) || 0,
      weight: form.weight.trim() || '250g',
      unit: form.unit.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      gallery: form.image.trim() ? [form.image.trim()] : [],
      status: form.status,
      isAvailable: form.isAvailable,
      isVegetarian: form.isVegetarian,
      featured: form.featured
    });
    setProductModalOpen(false);
  };

  const confirmDeleteProduct = (p) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      deleteProduct(p.id);
    }
  };

  // ── Category handlers ──
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', malayalam: '', image: '', description: '' });
    setCatModalOpen(true);
  };

  const openEditCategory = (c) => {
    setEditingCategory(c);
    setCatForm({ name: c.name || '', malayalam: c.malayalam || '', image: c.image || '', description: c.description || '' });
    setCatModalOpen(true);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catForm.name.trim(),
        malayalam: catForm.malayalam.trim(),
        image: catForm.image.trim(),
        description: catForm.description.trim()
      });
    } else {
      addCategory({
        name: catForm.name.trim(),
        malayalam: catForm.malayalam.trim() || catForm.name.trim(),
        image: catForm.image.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
        description: catForm.description.trim() || `Fresh ${catForm.name.trim()}`
      });
    }
    setCatModalOpen(false);
  };

  const confirmDeleteCategory = (c) => {
    const inUse = products.filter(p => p.categoryId === c.id).length;
    if (inUse > 0) {
      showToast(`Cannot delete: ${inUse} product(s) still use this category`, 'warning');
      return;
    }
    if (window.confirm(`Delete category "${c.name}"?`)) {
      deleteCategory(c.id);
    }
  };

  // ── Derived lists ──
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.phone || '').includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      <div className="container-editorial">

        {/* Header */}
        <div className="bg-[#171714] text-[#F5F1E8] border border-[#DDD7CA] p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#A63D2F] text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl text-white">Admin Console</h1>
                <span className="label text-[9px] bg-[#C99518] text-[#171714] px-2.5 py-0.5">Single Admin</span>
              </div>
              <p className="text-xs text-[#F5F1E8]/70 mt-1 font-mono">
                അമ്മിക്കല്ല് — manage products, categories &amp; customer orders
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="label text-[10px] px-4 py-2.5 border border-white/30 text-white hover:bg-white hover:text-[#171714] transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

        {/* Stats tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA] mb-10">
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Total Revenue</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#171714]">₹{totalRevenue}</span>
              <TrendingUp className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Total Orders</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#C99518]">{orders.length}</span>
              <ShoppingCart className="w-4 h-4 text-[#C99518]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Products</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-3xl text-[#A63D2F]">{products.length}</span>
              <Package className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="bg-white p-6 space-y-1">
            <span className="label text-[10px] text-[#68645B] block">Out of Stock</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className={`font-serif text-3xl ${outOfStock > 0 ? 'text-[#A63D2F]' : 'text-[#46513A]'}`}>{outOfStock}</span>
              <AlertTriangle className="w-4 h-4 text-[#46513A]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#DDD7CA] overflow-x-auto pb-px mb-8 scrollbar-none">
          {[
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Tag },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 cursor-pointer shrink-0 flex items-center gap-2 ${
                adminTab === t.id
                  ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                  : 'border-transparent text-[#68645B] hover:text-[#171714]'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════ PRODUCTS TAB ══════════ */}
        {adminTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BFB2]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DDD7CA] text-sm outline-none focus:border-[#171714] transition-colors"
                  />
                </div>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#DDD7CA] text-sm outline-none focus:border-[#171714] cursor-pointer h-full"
                    aria-label="Filter by category"
                  >
                    <option value="all">All categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#68645B] pointer-events-none" />
                </div>
              </div>
              <button
                onClick={openAddProduct}
                className="label text-[10px] px-5 py-3 bg-[#171714] text-white hover:bg-[#A63D2F] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="bg-white border border-[#DDD7CA] overflow-hidden">
              <div className="divide-y divide-[#DDD7CA]">
                {filteredProducts.length === 0 && (
                  <div className="p-10 text-center text-sm text-[#68645B]">
                    No products match your search.
                  </div>
                )}
                {filteredProducts.map(p => (
                  <div key={p.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={p.image} alt={p.name} className="w-14 h-14 object-cover border border-[#DDD7CA] bg-[#EEEBE3] shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-lg text-[#171714] truncate">{p.name}</h3>
                          {p.featured && (
                            <span className="label text-[9px] px-2 py-0.5 bg-[#C99518]/10 text-[#C99518] border border-[#C99518]/20 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          <span className={`label text-[9px] px-2 py-0.5 ${
                            p.isAvailable
                              ? 'bg-[#46513A]/10 text-[#46513A] border border-[#46513A]/20'
                              : 'bg-[#A63D2F]/10 text-[#A63D2F] border border-[#A63D2F]/20'
                          }`}>
                            {p.isAvailable ? 'In Stock' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-[#68645B] mt-0.5 font-mono">
                          ₹{p.salePrice || p.price} • Stock: {p.stock ?? 0} • {categories.find(c => c.id === p.categoryId)?.name || p.categoryId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleProductFeatured(p.id)}
                        className={`p-2 border cursor-pointer transition-all ${
                          p.featured
                            ? 'border-[#C99518] text-[#C99518] bg-[#C99518]/5'
                            : 'border-[#DDD7CA] text-[#68645B] hover:border-[#C99518] hover:text-[#C99518]'
                        }`}
                        title={p.featured ? 'Remove from featured' : 'Mark as featured'}
                        aria-label={p.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className="w-3.5 h-3.5" fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => toggleProductAvailable(p.id)}
                        className={`p-2 border cursor-pointer transition-all ${
                          p.isAvailable
                            ? 'border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714]'
                            : 'border-[#A63D2F] text-[#A63D2F] bg-[#A63D2F]/5'
                        }`}
                        title={p.isAvailable ? 'Hide from store (out of stock)' : 'Show in store'}
                        aria-label={p.isAvailable ? 'Hide from store' : 'Show in store'}
                      >
                        {p.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-2 border border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714] cursor-pointer transition-all"
                        title="Edit product"
                        aria-label="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDeleteProduct(p)}
                        className="p-2 border border-[#DDD7CA] text-[#68645B] hover:border-[#A63D2F] hover:text-[#A63D2F] cursor-pointer transition-all"
                        title="Delete product"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CATEGORIES TAB ══════════ */}
        {adminTab === 'categories' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={openAddCategory}
                className="label text-[10px] px-5 py-3 bg-[#171714] text-white hover:bg-[#A63D2F] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(c => {
                const count = products.filter(p => p.categoryId === c.id).length;
                return (
                  <div key={c.id} className="bg-white border border-[#DDD7CA] overflow-hidden group">
                    <div className="h-32 overflow-hidden bg-[#EEEBE3]">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-lg text-[#171714]">{c.name}</h3>
                          <span className="label text-[10px] text-[#A63D2F]">{c.malayalam}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditCategory(c)}
                            className="p-1.5 border border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714] cursor-pointer transition-all"
                            title="Edit category"
                            aria-label="Edit category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteCategory(c)}
                            className="p-1.5 border border-[#DDD7CA] text-[#68645B] hover:border-[#A63D2F] hover:text-[#A63D2F] cursor-pointer transition-all"
                            title="Delete category"
                            aria-label="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#68645B] mt-2 line-clamp-2">{c.description}</p>
                      <span className="label text-[10px] text-[#68645B] block mt-3 pt-3 border-t border-[#DDD7CA]">
                        {count} product{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ ORDERS TAB ══════════ */}
        {adminTab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BFB2]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search by order id, customer or phone..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DDD7CA] text-sm outline-none focus:border-[#171714] transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#DDD7CA] text-sm outline-none focus:border-[#171714] cursor-pointer h-full"
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  {STATUS_ORDER.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#68645B] pointer-events-none" />
              </div>
            </div>

            <div className="bg-white border border-[#DDD7CA] overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-10 text-center text-sm text-[#68645B]">
                  No orders yet. Orders placed by customers will appear here.
                </div>
              ) : (
                <div className="divide-y divide-[#DDD7CA]">
                  {filteredOrders.map(o => (
                    <div key={o.id} className="divide-y divide-[#DDD7CA]/60">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                        className="w-full p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-semibold text-[#171714]">#{o.id}</span>
                            <span className={`label text-[9px] px-2 py-0.5 border ${
                              o.orderStatus === 'delivered'
                                ? 'bg-[#46513A]/10 text-[#46513A] border-[#46513A]/20'
                                : o.orderStatus === 'pending'
                                  ? 'bg-[#C99518]/10 text-[#C99518] border-[#C99518]/20'
                                  : 'bg-[#171714]/5 text-[#171714] border-[#DDD7CA]'
                            }`}>
                              {STATUS_LABELS[o.orderStatus] || o.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-[#68645B] mt-1 font-mono">
                            {o.customerName} • {o.phone} • {new Date(o.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-serif text-lg text-[#171714]">₹{o.total}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#68645B] transition-transform duration-300 ${expandedOrderId === o.id ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>

                      {expandedOrderId === o.id && (
                        <div className="p-5 bg-[#FAF8F5] space-y-5">
                          {/* Items */}
                          <div className="space-y-3">
                            {(o.items || []).map(item => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover border border-[#DDD7CA] bg-white" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-[#171714] truncate">{item.productName}</p>
                                  <p className="text-xs text-[#68645B] font-mono">{item.selectedWeight} × {item.quantity}</p>
                                </div>
                                <span className="text-sm text-[#171714]">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery info */}
                          <div className="text-xs text-[#68645B] font-mono">
                            <p className="text-[#171714] mb-1">Deliver to:</p>
                            <p>{o.deliveryAddress?.name}, {o.deliveryAddress?.phone}</p>
                            <p>{o.deliveryAddress?.addressLine1}{o.deliveryAddress?.addressLine2 ? `, ${o.deliveryAddress.addressLine2}` : ''}</p>
                            <p>{o.deliveryAddress?.city}, {o.deliveryAddress?.district} — {o.deliveryAddress?.pincode}</p>
                            <p className="mt-2">Payment: {o.paymentMethod} ({o.paymentStatus})</p>
                          </div>

                          {/* Status control */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-[#DDD7CA]">
                            <label className="label text-[10px] text-[#68645B] flex items-center gap-2">
                              <ArrowUpDown className="w-3.5 h-3.5" />
                              Update status:
                            </label>
                            <select
                              value={o.orderStatus}
                              onChange={e => updateOrderStatus(o.id, e.target.value)}
                              className="appearance-none px-4 py-2 bg-white border border-[#DDD7CA] text-xs outline-none focus:border-[#171714] cursor-pointer"
                            >
                              {STATUS_ORDER.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => { if (window.confirm(`Remove order #${o.id}?`)) deleteOrder(o.id); }}
                              className="label text-[10px] px-3.5 py-2 border border-[#DDD7CA] text-[#A63D2F] hover:bg-[#A63D2F] hover:text-white hover:border-[#A63D2F] transition-all flex items-center gap-1.5 cursor-pointer sm:ml-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════ PRODUCT MODAL ══════════ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label={editingProduct ? 'Edit product' : 'Add product'}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#DDD7CA] shadow-warm-xl animate-fade-in">
            <div className="sticky top-0 bg-white border-b border-[#DDD7CA] px-6 md:px-8 py-5 flex items-center justify-between z-10">
              <h2 className="font-serif text-2xl text-[#171714]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 text-[#68645B] hover:text-[#171714] cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 md:p-8 space-y-5">
              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kasargod Heritage Manjal Podi"
                  className={`w-full p-3 border bg-white text-sm outline-none focus:border-[#171714] transition-colors ${formErrors.name ? 'border-[#A63D2F]' : 'border-[#DDD7CA]'}`}
                />
                {formErrors.name && <p className="text-xs text-[#A63D2F] mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label text-[10px] text-[#68645B] block mb-1.5">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className={`w-full p-3 border bg-white text-sm outline-none focus:border-[#171714] cursor-pointer ${formErrors.categoryId ? 'border-[#A63D2F]' : 'border-[#DDD7CA]'}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {formErrors.categoryId && <p className="text-xs text-[#A63D2F] mt-1">{formErrors.categoryId}</p>}
                </div>

                <div>
                  <label className="label text-[10px] text-[#68645B] block mb-1.5">Default Weight</label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                    placeholder="e.g. 250g"
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="label text-[10px] text-[#68645B] block mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className={`w-full p-3 border bg-white text-sm outline-none focus:border-[#171714] transition-colors ${formErrors.price ? 'border-[#A63D2F]' : 'border-[#DDD7CA]'}`}
                  />
                  {formErrors.price && <p className="text-xs text-[#A63D2F] mt-1">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="label text-[10px] text-[#68645B] block mb-1.5">Sale Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.salePrice}
                    onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))}
                    className={`w-full p-3 border bg-white text-sm outline-none focus:border-[#171714] transition-colors ${formErrors.salePrice ? 'border-[#A63D2F]' : 'border-[#DDD7CA]'}`}
                  />
                  {formErrors.salePrice && <p className="text-xs text-[#A63D2F] mt-1">{formErrors.salePrice}</p>}
                </div>
                <div>
                  <label className="label text-[10px] text-[#68645B] block mb-1.5">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="/manjal-podi/250g.png or https://..."
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors font-mono text-xs"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="mt-3 w-20 h-20 object-cover border border-[#DDD7CA]" />
                )}
              </div>

              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                  placeholder="One-line summary shown on cards"
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors"
                />
              </div>

              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors resize-y"
                />
              </div>

              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Ingredients</label>
                <textarea
                  value={form.ingredients}
                  onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  rows={2}
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors resize-y"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
                    className="w-4 h-4 accent-[#A63D2F] cursor-pointer"
                  />
                  <span className="text-xs text-[#171714]">Available in store</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isVegetarian}
                    onChange={e => setForm(f => ({ ...f, isVegetarian: e.target.checked }))}
                    className="w-4 h-4 accent-[#A63D2F] cursor-pointer"
                  />
                  <span className="text-xs text-[#171714]">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#A63D2F] cursor-pointer"
                  />
                  <span className="text-xs text-[#171714]">Featured on homepage</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#DDD7CA]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-3 border border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714] transition-all text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#171714] text-white hover:bg-[#A63D2F] transition-all text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ CATEGORY MODAL ══════════ */}
      {catModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label={editingCategory ? 'Edit category' : 'Add category'}>
          <div className="bg-white w-full max-w-md border border-[#DDD7CA] shadow-warm-xl animate-fade-in">
            <div className="border-b border-[#DDD7CA] px-6 py-5 flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#171714]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-2 text-[#68645B] hover:text-[#171714] cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Name (English) *</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Traditional Spices"
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Malayalam Name</label>
                <input
                  type="text"
                  value={catForm.malayalam}
                  onChange={e => setCatForm(f => ({ ...f, malayalam: e.target.value }))}
                  placeholder="e.g. നാടൻ മസാലകൾ"
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors"
                />
              </div>
              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  value={catForm.image}
                  onChange={e => setCatForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://... (optional)"
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-xs outline-none focus:border-[#171714] transition-colors font-mono"
                />
                {catForm.image && (
                  <img src={catForm.image} alt="Preview" className="mt-3 w-20 h-20 object-cover border border-[#DDD7CA]" />
                )}
              </div>
              <div>
                <label className="label text-[10px] text-[#68645B] block mb-1.5">Description</label>
                <textarea
                  value={catForm.description}
                  onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-sm outline-none focus:border-[#171714] transition-colors resize-y"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="flex-1 py-3 border border-[#DDD7CA] text-[#68645B] hover:border-[#171714] hover:text-[#171714] transition-all text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#171714] text-white hover:bg-[#A63D2F] transition-all text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingCategory ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
