import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import useOverlayA11y from '../hooks/useOverlayA11y';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  Store,
  Truck
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCouponCode,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    setIsCheckoutOpen
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  // Escape to close, focus trap, background scroll lock (Bug #5)
  const overlayRef = useOverlayA11y(isCartOpen, () => setIsCartOpen(false));

  if (!isCartOpen) return null;

  // Group cart items by seller (kept for structure; single-store shows one group)
  const groupedCart = cart.reduce((acc, item) => {
    const sellerId = item.product.sellerId || 'store';
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    if (applyCouponCode(couponInput)) {
      setCouponInput('');
    }
  };

  const freeDeliveryThreshold = 299;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Basket"
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F5F1E8] shadow-2xl border-l border-[#DDD7CA] flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-5 bg-white border-b border-[#DDD7CA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#171714] text-[#F5F1E8] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#C99518]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#171714]">
                  Shopping Basket
                </h2>
                <span className="label text-[10px] text-[#68645B]">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} Items Selected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#171714] hover:opacity-60 transition-opacity cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {cart.length > 0 && (
            <div className="bg-[#46513A]/10 border-b border-[#46513A]/20 px-5 py-2.5 flex items-center gap-2 text-xs text-[#46513A]">
              <Truck className="w-4 h-4 text-[#46513A] shrink-0" strokeWidth={1.5} />
              {amountNeededForFreeDelivery === 0 ? (
                <span className="label text-[10px]">Complimentary Kerala Home Delivery Unlocked</span>
              ) : (
                <span className="text-xs">Add <strong>₹{amountNeededForFreeDelivery}</strong> more for <strong>Complimentary Delivery</strong></span>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              Object.entries(groupedCart).map(([sellerId, items]) => {
                const sellerSubtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

                return (
                  <div
                    key={sellerId}
                    className="bg-white p-4 border border-[#DDD7CA] space-y-3"
                  >
                    {/* Seller Sub-Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#DDD7CA] text-xs">
                      <div className="flex items-center gap-1.5 label text-[10px] text-[#46513A]">
                        <Store className="w-3.5 h-3.5" />
                        <span>Ammikallu Store</span>
                      </div>
                      <span className="label text-[9px] text-[#68645B]">
                        Subtotal: ₹{sellerSubtotal}
                      </span>
                    </div>

                    {/* Items for this Seller */}
                    <div className="space-y-3">
                      {items.map(item => {
                        const itemIdentifier = item.cartItemId || item.productId;
                        return (
                          <div key={itemIdentifier} className="flex gap-3 items-center">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover border border-[#DDD7CA] shrink-0 bg-[#EEEBE3]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-base text-[#171714] truncate" title={item.product.name}>
                                {item.product.name}
                              </h4>
                              
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.selectedWeight && (
                                  <span className="label text-[9px] bg-[#FAF8F5] text-[#171714] px-1.5 py-0.5 border border-[#DDD7CA]">
                                    {item.selectedWeight}
                                  </span>
                                )}
                                <span className="font-serif text-sm text-[#171714]">
                                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                                </span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-[#DDD7CA] bg-white">
                                  <button
                                    onClick={() => updateCartQuantity(itemIdentifier, -1)}
                                    className="px-2.5 py-0.5 text-xs hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="px-2.5 text-xs font-mono text-[#171714]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQuantity(itemIdentifier, 1)}
                                    className="px-2.5 py-0.5 text-xs hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(itemIdentifier)}
                                  className="text-[#A63D2F] hover:opacity-75 p-1 cursor-pointer transition-opacity"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 space-y-4">
                <ShoppingBag className="w-10 h-10 text-[#68645B] mx-auto opacity-40" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-[#171714]">Your Basket is Empty</h3>
                <p className="body-text text-xs max-w-xs mx-auto">
                  Add single-origin cold stone-ground spices and handmade snacks to your order.
                </p>
              </div>
            )}

            {/* Coupon Promo Input Box */}
            {cart.length > 0 && (
              <div className="bg-white p-4 border border-[#DDD7CA] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="label text-[10px] text-[#68645B] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C99518]" />
                    Promotional Voucher:
                  </span>
                  <span className="text-[10px] text-[#68645B]">
                    Try <strong className="font-mono text-[#A63D2F]">SPICE15</strong>
                  </span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="ENTER CODE..."
                    className="flex-1 px-3 py-2 border border-[#DDD7CA] text-xs text-[#171714] focus:outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="label text-[10px] px-4 py-2 bg-[#171714] text-white hover:bg-[#333] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="bg-[#46513A]/10 text-[#46513A] px-3 py-2 border border-[#46513A]/20 label text-[10px] flex items-center justify-between">
                    <span>Voucher "{appliedCoupon.code}" Activated</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#DDD7CA] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#68645B]">
                  <span className="label text-[10px]">Subtotal</span>
                  <span className="font-serif text-sm text-[#171714]">₹{cartSubtotal}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#46513A]">
                    <span className="label text-[10px]">Discount ({appliedCoupon?.code})</span>
                    <span className="font-serif text-sm">-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#68645B]">
                  <span className="label text-[10px]">Kerala Delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-[#46513A] label text-[10px]">Free</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-serif text-xl text-[#171714] pt-2 border-t border-[#DDD7CA]">
                  <span>Total Amount</span>
                  <span className="text-[#A63D2F]">₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="btn-primary w-full justify-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
