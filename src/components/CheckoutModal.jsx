import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import useOverlayA11y from '../hooks/useOverlayA11y';
import {
  X,
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  Building,
  Smartphone,
  Truck,
  ArrowRight
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    addresses,
    addAddress,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    placeOrder
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New Address form fields
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Ernakulam');
  const [newAddrPincode, setNewAddrPincode] = useState('');

  // Escape to close, focus trap, background scroll lock (Bug #5)
  const overlayRef = useOverlayA11y(isCheckoutOpen, () => setIsCheckoutOpen(false));

  if (!isCheckoutOpen) return null;

  const selectedAddr = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddrName || !newAddrLine1 || !newAddrCity || !newAddrPincode) return;
    addAddress({
      name: newAddrName,
      phone: newAddrPhone || '+91 98765 43210',
      addressLine1: newAddrLine1,
      city: newAddrCity,
      district: newAddrDistrict,
      pincode: newAddrPincode,
      state: 'Kerala',
      isDefault: false
    });
    setShowAddAddress(false);
  };

  const handlePlaceOrderSubmit = () => {
    if (!selectedAddr) return;
    placeOrder({
      name: selectedAddr.name,
      phone: selectedAddr.phone,
      address: selectedAddr,
      paymentMethod,
      subtotal: cartSubtotal,
      deliveryFee,
      discount: cartDiscount,
      total: cartTotal
    });
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div
        className="bg-[#F5F1E8] w-full max-w-3xl border border-[#DDD7CA] shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#DDD7CA] flex items-center justify-between sticky top-0 z-20">
          <div>
            <span className="label text-[10px] text-[#A63D2F] block mb-0.5">Direct from Kerala Kitchens</span>
            <h2 className="font-serif text-2xl text-[#171714]">
              Express Doorstep Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-[#171714] hover:opacity-60 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* Step 1: Select Delivery Address */}
          <div className="bg-white p-6 border border-[#DDD7CA] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
              <h3 className="font-serif text-lg text-[#171714] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
                01. Delivery Address (Kerala)
              </h3>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="label text-[10px] text-[#A63D2F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Address
              </button>
            </div>

            {/* Existing Address Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 border transition-all cursor-pointer text-xs space-y-1 ${
                    selectedAddressId === addr.id
                      ? 'border-[#171714] bg-[#FAF8F5]'
                      : 'border-[#DDD7CA] hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#171714]">{addr.name}</span>
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#46513A]" />
                    )}
                  </div>
                  <p className="body-text text-xs leading-tight">
                    {addr.addressLine1}, {addr.city}, {addr.district} - {addr.pincode}
                  </p>
                  <span className="label text-[9px] text-[#68645B] block font-mono">{addr.phone}</span>
                </div>
              ))}
            </div>

            {/* Inline Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddNewAddressSubmit} className="pt-4 border-t border-[#DDD7CA] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newAddrName}
                    onChange={e => setNewAddrName(e.target.value)}
                    required
                    className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newAddrPhone}
                    onChange={e => setNewAddrPhone(e.target.value)}
                    className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line (House Name, Street)"
                  value={newAddrLine1}
                  onChange={e => setNewAddrLine1(e.target.value)}
                  required
                  className="w-full p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddrCity}
                    onChange={e => setNewAddrCity(e.target.value)}
                    required
                    className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none"
                  />
                  <select
                    value={newAddrDistrict}
                    onChange={e => setNewAddrDistrict(e.target.value)}
                    className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none cursor-pointer"
                  >
                    <option value="Ernakulam">Ernakulam</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Wayanad">Wayanad</option>
                    <option value="Kannur">Kannur</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddrPincode}
                    onChange={e => setNewAddrPincode(e.target.value)}
                    required
                    className="p-3 border border-[#DDD7CA] bg-white text-[#171714] focus:outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save & Select Address
                </button>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method Choice */}
          <div className="bg-white p-6 border border-[#DDD7CA] space-y-4">
            <h3 className="font-serif text-lg text-[#171714] flex items-center gap-2 border-b border-[#DDD7CA] pb-3">
              <CreditCard className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
              02. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div
                onClick={() => setPaymentMethod('UPI (GPay / PhonePe)')}
                className={`p-4 border transition-all cursor-pointer flex items-center gap-3 ${
                  paymentMethod.includes('UPI')
                    ? 'border-[#171714] bg-[#FAF8F5]'
                    : 'border-[#DDD7CA] bg-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#A63D2F]" />
                <div>
                  <span className="font-serif text-sm text-[#171714] block">UPI Direct</span>
                  <span className="label text-[9px] text-[#68645B] block">GPay, PhonePe, UPI</span>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                className={`p-4 border transition-all cursor-pointer flex items-center gap-3 ${
                  paymentMethod.includes('Cash')
                    ? 'border-[#171714] bg-[#FAF8F5]'
                    : 'border-[#DDD7CA] bg-white'
                }`}
              >
                <Truck className="w-4 h-4 text-[#46513A]" />
                <div>
                  <span className="font-serif text-sm text-[#171714] block">Cash on Delivery</span>
                  <span className="label text-[9px] text-[#68645B] block">Pay upon delivery</span>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-4 border transition-all cursor-pointer flex items-center gap-3 ${
                  paymentMethod.includes('NetBanking')
                    ? 'border-[#171714] bg-[#FAF8F5]'
                    : 'border-[#DDD7CA] bg-white'
                }`}
              >
                <Building className="w-4 h-4 text-[#C99518]" />
                <div>
                  <span className="font-serif text-sm text-[#171714] block">NetBanking</span>
                  <span className="label text-[9px] text-[#68645B] block">Indian Banks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Order Breakdown Summary */}
          <div className="bg-white p-6 border border-[#DDD7CA] space-y-3">
            <h3 className="font-serif text-lg text-[#171714] border-b border-[#DDD7CA] pb-3">
              03. Order Summary
            </h3>
            <div className="space-y-2 text-xs text-[#68645B]">
              <div className="flex justify-between">
                <span>Produce Subtotal ({cart.length} items)</span>
                <span className="font-serif text-sm text-[#171714]">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#46513A]">
                  <span>Voucher Promotion Discount</span>
                  <span className="font-serif text-sm">-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Kerala Courier Shipping</span>
                <span>{deliveryFee === 0 ? <strong className="text-[#46513A] label text-[10px]">Free</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-serif text-xl text-[#171714] pt-3 border-t border-[#DDD7CA]">
                <span>Total Amount Payable</span>
                <span className="text-[#A63D2F]">₹{cartTotal}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action Button */}
        <div className="p-5 bg-white border-t border-[#DDD7CA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs">
            <span className="label text-[9px] text-[#68645B] block">Shipping Destination:</span>
            <span className="font-serif text-base text-[#171714] truncate block max-w-xs">
              {selectedAddr ? `${selectedAddr.name} • ${selectedAddr.city}` : 'Select Delivery Address'}
            </span>
          </div>

          <button
            onClick={handlePlaceOrderSubmit}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <span>Confirm & Place Order</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </div>
  );
}
