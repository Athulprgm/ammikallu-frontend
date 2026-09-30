import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CATEGORIES_SEED,
  SELLERS_SEED,
  PRODUCTS_SEED,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES
} from '../data/seedData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('customer'); // 'customer' | 'seller' | 'admin'
  const [currentSellerId, setCurrentSellerId] = useState('seller-spices'); // Default seller for seller portal
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop' | 'seller-store' | 'account' | 'seller-dashboard' | 'admin-dashboard'
  
  // Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI Drawer / Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState('orders'); // 'orders' | 'wishlist' | 'addresses' | 'reviews' | 'profile'

  // Platform Entities State
  const [products, setProducts] = useState(PRODUCTS_SEED);
  const [sellers, setSellers] = useState(SELLERS_SEED);
  const [categories, setCategories] = useState(CATEGORIES_SEED);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // Cart & Wishlist State
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [wishlist, setWishlist] = useState([]);

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

  // Role Fast Switcher
  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'customer') {
      setCurrentView('home');
      showToast('Switched to Customer Storefront mode', 'info');
    } else if (role === 'seller') {
      setCurrentView('seller-dashboard');
      showToast('Switched to Seller Portal (Kasargod Heritage Spices)', 'info');
    } else if (role === 'admin') {
      setCurrentView('admin-dashboard');
      showToast('Switched to Admin Platform Console mode', 'info');
    }
  };

  // Cart Handlers
  const addToCart = (product, quantityToAdd = 1, selectedWeight = null, customPrice = null) => {
    if (!product.isAvailable || product.stock <= 0) {
      showToast('Product is currently out of stock', 'error');
      return;
    }
    const weight = selectedWeight || product.weight;
    const price = customPrice !== null ? customPrice : (product.salePrice || product.price);
    const cartItemId = `${product.id}-${weight}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.cartItemId === cartItemId || (!item.cartItemId && item.productId === product.id && item.selectedWeight === weight)
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantityToAdd;
        if (newQty > product.stock) {
          showToast(`Maximum available stock is ${product.stock}`, 'warning');
          return prevCart;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [...prevCart, {
          cartItemId,
          productId: product.id,
          selectedWeight: weight,
          quantity: quantityToAdd,
          price,
          product
        }];
      }
    });
    showToast(`Added "${product.name}" (${weight}) to cart!`, 'success');
  };

  const removeFromCart = (cartIdentifier) => {
    setCart(prev => prev.filter(item => (item.cartItemId !== cartIdentifier && item.productId !== cartIdentifier)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartIdentifier, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartIdentifier || item.productId === cartIdentifier) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            showToast(`Only ${item.product.stock} units in stock`, 'warning');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
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

  // Wishlist Toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // View Navigation Helpers
  const navigateToShop = (categoryId = null) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSellerStore = (sellerId) => {
    setSelectedSellerId(sellerId);
    setCurrentView('seller-store');
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
        sellerId: item.product.sellerId,
        sellerName: sellers.find(s => s.id === item.product.sellerId)?.name || 'Home Maker',
        price: item.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      timeline: [
        { status: 'pending', title: 'Order Placed', time: 'Just now', completed: true, active: true },
        { status: 'confirmed', title: 'Awaiting Seller Confirmation', time: 'Pending', completed: false },
        { status: 'processing', title: 'Preparing Fresh in Kitchen', time: 'Pending', completed: false },
        { status: 'ready', title: 'Packed & Ready for Pickup', time: 'Pending', completed: false },
        { status: 'shipped', title: 'Dispatched with Courier', time: 'Pending', completed: false },
        { status: 'delivered', title: 'Delivered Home', time: 'Pending', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(`Order ${newOrderId} placed successfully!`, 'success');
    addNotification('Order Placed!', `Your order #${newOrderId} has been sent to home creators.`);
    
    // Auto switch to customer account orders tab
    setAccountTab('orders');
    setCurrentView('account');
  };

  // Seller Action: Update Order Status
  const updateSellerOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      return prevOrders.map(ord => {
        if (ord.id === orderId) {
          const statusOrder = ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered'];
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
      });
    });
    showToast(`Order ${orderId} status updated to ${newStatus.toUpperCase()}`, 'success');
    addNotification(`Order ${orderId} Updated`, `Status changed to ${newStatus}`);
  };

  // Seller Action: Product CRUD
  const saveSellerProduct = (productData) => {
    if (productData.id) {
      // Edit existing
      setProducts(prev => prev.map(p => p.id === productData.id ? { ...p, ...productData } : p));
      showToast('Product updated successfully!', 'success');
    } else {
      // Add new
      const newProd = {
        ...productData,
        id: 'prod-' + Date.now(),
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviewsCount: 0,
        status: 'pending', // Requires admin approval!
        featured: false
      };
      setProducts(prev => [newProd, ...prev]);
      showToast('Product created! Submitted for Admin approval.', 'success');
      addNotification('New Product Submission', `Product "${newProd.name}" submitted for approval.`);
    }
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted from inventory', 'info');
  };

  // Admin Actions
  const approveProduct = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'approved' } : p));
    showToast('Product approved for public marketplace listing!', 'success');
  };

  const rejectProduct = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'rejected' } : p));
    showToast('Product rejected', 'warning');
  };

  const approveSeller = (sellerId) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'approved', verified: true } : s));
    showToast('Seller application approved!', 'success');
  };

  const rejectSeller = (sellerId) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'rejected' } : s));
    showToast('Seller application rejected', 'warning');
  };

  const addCategory = (categoryData) => {
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...categoryData,
      count: 0
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`, 'success');
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
    
    // Update product rating average
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prodRevs = [...reviews.filter(r => r.productId === productId), newRev];
        const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
        return { ...p, rating: Number(avg.toFixed(1)), reviewsCount: prodRevs.length };
      }
      return p;
    }));

    showToast('Thank you! Your review has been submitted.', 'success');
  };

  const addAddress = (addressData) => {
    const newAddr = {
      id: 'addr-' + Date.now(),
      ...addressData,
      isDefault: addresses.length === 0 ? true : addressData.isDefault
    };
    if (newAddr.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }
    setAddresses(prev => [...prev, newAddr]);
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
    // Roles & Views
    currentRole,
    currentSellerId,
    currentView,
    accountTab,
    selectedCategoryId,
    selectedSellerId,
    selectedProduct,
    searchQuery,

    // Setters
    setCurrentRole,
    setCurrentSellerId,
    setCurrentView,
    setAccountTab,
    setSelectedCategoryId,
    setSelectedSellerId,
    setSelectedProduct,
    setSearchQuery,
    switchRole,

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
    navigateToSellerStore,
    openProductDetail,
    placeOrder,
    updateSellerOrderStatus,
    saveSellerProduct,
    deleteProduct,
    approveProduct,
    rejectProduct,
    approveSeller,
    rejectSeller,
    addCategory,
    addReview,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    showToast
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
