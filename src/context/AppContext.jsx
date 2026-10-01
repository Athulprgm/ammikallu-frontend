import React, { createContext, useContext, useState } from 'react';
import usePersistedState from '../hooks/usePersistedState';
import {
  CATEGORIES_SEED,
  PRODUCTS_SEED,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES
} from '../data/seedData';

const AppContext = createContext();

// ── Auth: exactly ONE admin + normal users (no multi-tenant). ────────────────
// Admin is a single fixed account; users self-register (mock, localStorage).
const ADMIN_EMAIL = 'admin@ammikallu.com';
const ADMIN_PASSWORD = 'admin123';

const USERS_KEY = 'ammikallu.users';
const SESSION_KEY = 'ammikallu.session';

function readStoredUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* storage unavailable — session stays in-memory only */
  }
}

export function AppProvider({ children }) {
  // ── Auth State (persisted) ─────────────────────────────────────────────────
  // session: null | { role: 'user' | 'admin', name, email }
  const [session, setSession] = useState(() => readStoredSession());

  // ── Navigation State ───────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState('home'); // user views: 'home' | 'shop' | 'account'
  const [accountTab, setAccountTab] = useState('orders'); // 'orders' | 'wishlist' | 'addresses' | 'reviews' | 'profile'

  // Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI Drawer / Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Platform Entities State (catalog is managed by the single Admin)
  const [products, setProducts] = usePersistedState('ammikallu.products', PRODUCTS_SEED);
  const [sellers] = useState([]); // legacy display data; single-admin store has no seller accounts
  const [categories, setCategories] = usePersistedState('ammikallu.categories', CATEGORIES_SEED);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [coupons] = useState(INITIAL_COUPONS);

  // Persisted State — survives a page refresh
  const [orders, setOrders] = usePersistedState('ammikallu.orders', INITIAL_ORDERS);
  const [addresses, setAddresses] = usePersistedState('ammikallu.addresses', INITIAL_ADDRESSES);

  // Cart & Wishlist State (persisted)
  const [cart, setCart] = usePersistedState('ammikallu.cart', []);
  const [appliedCoupon, setAppliedCoupon] = usePersistedState('ammikallu.appliedCoupon', null);
  const [wishlist, setWishlist] = usePersistedState('ammikallu.wishlist', []);

  // Notifications & Toast
  const [notifications, setNotifications] = useState([
    { id: 'n-1', title: 'Welcome to അമ്മിക്കല്ല്!', message: 'Explore authentic homemade spices and fresh home-baked snacks from Kerala.', time: 'Just now', unread: true }
  ]);
  const [toast, setToast] = useState(null);

  // Helper: Trigger Toast Alert
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Helper: Add Notification
  const addNotification = (title, message) => {
    setNotifications(prev => [
      { id: 'n-' + Date.now(), title, message, time: 'Just now', unread: true },
      ...prev
    ]);
  };

  // ── Auth Handlers ──────────────────────────────────────────────────────────
  const login = (email, password) => {
    const trimmed = (email || '').trim().toLowerCase();

    // Single fixed admin account
    if (trimmed === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminSession = { role: 'admin', name: 'Admin', email: ADMIN_EMAIL };
      setSession(adminSession);
      writeSession(adminSession);
      showToast('Signed in as Admin', 'success');
      return true;
    }

    const users = readStoredUsers();
    const user = users.find(u => u.email === trimmed && u.password === password);
    if (!user) {
      showToast('Invalid email or password', 'error');
      return false;
    }
    const userSession = { role: 'user', name: user.name, email: user.email };
    setSession(userSession);
    writeSession(userSession);
    showToast(`Welcome back, ${user.name}!`, 'success');
    return true;
  };

  const signup = (name, email, password) => {
    const trimmed = (email || '').trim().toLowerCase();
    if (!name || !trimmed || !password) {
      showToast('Please fill all fields', 'error');
      return false;
    }
    if (trimmed === ADMIN_EMAIL) {
      showToast('This email is reserved', 'error');
      return false;
    }
    const users = readStoredUsers();
    if (users.some(u => u.email === trimmed)) {
      showToast('An account with this email already exists', 'error');
      return false;
    }
    users.push({ name, email: trimmed, password });
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* storage unavailable */
    }
    const userSession = { role: 'user', name, email: trimmed };
    setSession(userSession);
    writeSession(userSession);
    showToast(`Account created. Welcome, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setSession(null);
    writeSession(null);
    setCurrentView('home');
    showToast('Signed out', 'info');
  };

  // ── Cart Handlers ──────────────────────────────────────────────────────────
  const addToCart = (product, quantityToAdd = 1, selectedWeight = null, customPrice = null) => {
    if (!product.isAvailable || product.stock <= 0) {
      showToast('Product is currently out of stock', 'error');
      return;
    }
    const weight = selectedWeight || product.weight;
    const price = customPrice !== null ? customPrice : (product.salePrice || product.price);
    const cartItemId = `${product.id}-${weight}`;

    // Match an existing line using current state BEFORE the updater runs,
    // so validation (and its toast) stays out of the state updater.
    const matches = (item) =>
      item.cartItemId === cartItemId ||
      (!item.cartItemId && item.productId === product.id && item.selectedWeight === weight);

    const existing = cart.find(matches);
    if (existing && existing.quantity + quantityToAdd > product.stock) {
      showToast(`Maximum available stock is ${product.stock}`, 'warning');
      return;
    }

    // Pure updater — no side effects, safe under StrictMode double-invocation.
    setCart(prevCart => {
      const idx = prevCart.findIndex(matches);
      if (idx > -1) {
        const updated = [...prevCart];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantityToAdd };
        return updated;
      }
      return [...prevCart, {
        cartItemId,
        productId: product.id,
        selectedWeight: weight,
        quantity: quantityToAdd,
        price,
        product
      }];
    });

    showToast(`Added "${product.name}" (${weight}) to cart!`, 'success');
  };

  const removeFromCart = (cartIdentifier) => {
    setCart(prev => prev.filter(item => (item.cartItemId !== cartIdentifier && item.productId !== cartIdentifier)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartIdentifier, delta) => {
    const item = cart.find(
      i => i.cartItemId === cartIdentifier || i.productId === cartIdentifier
    );
    if (!item) return;

    // Stock validation happens before the updater, so no toast inside it.
    if (item.quantity + delta > item.product.stock) {
      showToast(`Only ${item.product.stock} units in stock`, 'warning');
      return;
    }

    setCart(prevCart =>
      prevCart
        .map(prevItem => {
          if (prevItem.cartItemId === cartIdentifier || prevItem.productId === cartIdentifier) {
            const newQty = prevItem.quantity + delta;
            if (newQty <= 0) return null; // remove line when quantity hits 0
            return { ...prevItem, quantity: newQty };
          }
          return prevItem;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon apply
  const applyCouponCode = (code) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      showToast('Invalid promo coupon code', 'error');
      return false;
    }
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (found.minOrder && subtotal < found.minOrder) {
      showToast(`Minimum order amount for code ${found.code} is ₹${found.minOrder}`, 'warning');
      return false;
    }
    setAppliedCoupon(found);
    showToast(`Applied coupon "${found.code}" successfully!`, 'success');
    return true;
  };

  // Wishlist Toggle — toast outside the updater (pure updaters only)
  const toggleWishlist = (productId) => {
    const exists = wishlist.includes(productId);
    setWishlist(prev => (exists ? prev.filter(id => id !== productId) : [...prev, productId]));
    showToast(exists ? 'Removed from wishlist' : 'Added to wishlist!', exists ? 'info' : 'success');
  };

  // View Navigation Helpers
  const navigateToShop = (categoryId = null) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Order Placement
  const placeOrder = (orderData) => {
    const newOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      customerName: orderData.name || 'Athul Krishna',
      phone: orderData.phone || '+91 98765 43210',
      deliveryAddress: orderData.address,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : 'paid',
      orderStatus: 'pending',
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total,
      items: cart.map(item => ({
        id: 'item-' + Math.random().toString(36).substr(2, 6),
        productId: item.productId,
        productName: item.product.name,
        selectedWeight: item.selectedWeight || item.product.weight,
        price: item.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      timeline: [
        { status: 'pending', title: 'Order Placed', time: 'Just now', completed: true, active: true },
        { status: 'confirmed', title: 'Order Confirmed', time: 'Pending', completed: false },
        { status: 'processing', title: 'Preparing Fresh in Kitchen', time: 'Pending', completed: false },
        { status: 'packed', title: 'Packed & Ready', time: 'Pending', completed: false },
        { status: 'shipped', title: 'Dispatched with Courier', time: 'Pending', completed: false },
        { status: 'delivered', title: 'Delivered Home', time: 'Pending', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(`Order ${newOrderId} placed successfully!`, 'success');
    addNotification('Order Placed!', `Your order #${newOrderId} has been placed.`);

    // Auto switch to customer account orders tab
    setAccountTab('orders');
    setCurrentView('account');
  };

  // ── Admin: Order Management ────────────────────────────────────────────────
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(ord => {
        if (ord.id === orderId) {
          const statusOrder = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
          const currentIndex = statusOrder.indexOf(newStatus);

          const updatedTimeline = ord.timeline.map((step, idx) => {
            if (idx < currentIndex) {
              return { ...step, completed: true, active: false };
            } else if (idx === currentIndex) {
              return { ...step, completed: true, active: true, time: 'Updated just now' };
            } else {
              return { ...step, completed: false, active: false };
            }
          });

          return {
            ...ord,
            orderStatus: newStatus,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );
    showToast(`Order ${orderId} status updated to ${newStatus.toUpperCase()}`, 'success');
    addNotification(`Order ${orderId} Updated`, `Status changed to ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order ${orderId} removed`, 'info');
  };

  // ── Admin: Product CRUD ────────────────────────────────────────────────────
  const saveProduct = (productData) => {
    if (productData.id) {
      // Edit existing
      setProducts(prev => prev.map(p => (p.id === productData.id ? { ...p, ...productData } : p)));
      showToast('Product updated successfully!', 'success');
      return true;
    }
    // Add new
    const newProd = {
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: 0,
      isAvailable: true,
      isVegetarian: true,
      featured: false,
      ...productData,
      id: 'prod-' + Date.now()
    };
    setProducts(prev => [newProd, ...prev]);
    showToast('Product added successfully!', 'success');
    return true;
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted', 'info');
  };

  const toggleProductFeatured = (productId) => {
    setProducts(prev => prev.map(p => (p.id === productId ? { ...p, featured: !p.featured } : p)));
  };

  const toggleProductAvailable = (productId) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p))
    );
    showToast('Availability updated', 'info');
  };

  // ── Admin: Category CRUD ───────────────────────────────────────────────────
  const addCategory = (categoryData) => {
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...categoryData,
      count: 0
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`, 'success');
  };

  const updateCategory = (categoryId, categoryData) => {
    setCategories(prev => prev.map(c => (c.id === categoryId ? { ...c, ...categoryData } : c)));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast('Category deleted', 'info');
  };

  const addReview = (productId, reviewData) => {
    const newRev = {
      id: 'rev-' + Date.now(),
      productId,
      userName: reviewData.userName || 'Verified Buyer',
      userCity: reviewData.userCity || 'Kerala',
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      comment: reviewData.comment
    };
    setReviews(prev => [newRev, ...prev]);

    // Update product rating average (functional updater — no stale closure)
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const prodRevs = reviews
            .filter(r => r.productId === productId)
            .concat(newRev);
          const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
          return { ...p, rating: Number(avg.toFixed(1)), reviewsCount: prodRevs.length };
        }
        return p;
      })
    );

    showToast('Thank you! Your review has been submitted.', 'success');
  };

  const addAddress = (addressData) => {
    const shouldBeDefault = addresses.length === 0 ? true : addressData.isDefault;
    const newAddr = {
      id: 'addr-' + Date.now(),
      ...addressData,
      isDefault: shouldBeDefault
    };
    // Single atomic update: clear defaults only when the new one is default.
    setAddresses(prev =>
      prev
        .map(a => (shouldBeDefault ? { ...a, isDefault: false } : a))
        .concat(newAddr)
    );
    showToast('New delivery address added', 'success');
  };

  const setDefaultAddress = (addressId) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addressId })));
    showToast('Default address updated', 'info');
  };

  const deleteAddress = (addressId) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
    showToast('Address removed', 'info');
  };

  // Computations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount || 9999);
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  const deliveryFee = cartSubtotal > 0 ? (cartDiscount >= 40 || cartSubtotal >= 600 ? 0 : 40) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const value = {
    // Auth
    session,
    user: session, // alias
    isLoggedIn: !!session,
    isAdmin: session?.role === 'admin',
    login,
    signup,
    logout,

    // Views
    currentView,
    setCurrentView,
    accountTab,
    setAccountTab,
    selectedCategoryId,
    selectedProduct,
    searchQuery,

    // Setters
    setSelectedCategoryId,
    setSelectedProduct,
    setSearchQuery,

    // Modal / Drawer States
    isCartOpen,
    isCheckoutOpen,
    isProductModalOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsProductModalOpen,

    // Entities
    products,
    sellers,
    categories,
    orders,
    reviews,
    coupons,
    addresses,
    notifications,
    toast,

    // Cart & Wishlist
    cart,
    appliedCoupon,
    wishlist,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,

    // Handlers
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    applyCouponCode,
    toggleWishlist,
    navigateToShop,
    openProductDetail,
    placeOrder,
    addReview,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    showToast,
    setToast,

    // Admin handlers
    updateOrderStatus,
    deleteOrder,
    saveProduct,
    deleteProduct,
    toggleProductFeatured,
    toggleProductAvailable,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
