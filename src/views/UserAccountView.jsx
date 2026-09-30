import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import {
  Package,
  Heart,
  MapPin,
  Bell,
  CheckCircle2,
  Truck,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function UserAccountView() {
  const {
    accountTab,
    setAccountTab,
    orders,
    wishlist,
    products,
    addresses,
    deleteAddress,
    setDefaultAddress,
    notifications,
    navigateToShop
  } = useApp();

  const [expandedOrderId, setExpandedOrderId] = useState(orders[0]?.id || null);

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#F5F1E8] min-h-screen pt-24 pb-20 animate-fade-in">
      
      <div className="container-editorial">

        {/* Account Banner */}
        <div className="border border-[#DDD7CA] bg-white p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#171714] text-[#F5F1E8] flex items-center justify-center font-serif text-2xl border border-[#DDD7CA]">
              A
            </div>
            <div>
              <span className="label text-[#A63D2F] block mb-1">
                ഉപഭോക്തൃ വിവരങ്ങൾ • Patron Account
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#171714]">
                Athul Krishna
              </h1>
              <p className="text-xs text-[#68645B] mt-1 font-mono">
                athul@ammikkallu.test • Ernakulam, Kerala
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="label text-[10px] px-3.5 py-1.5 bg-[#F5F1E8] border border-[#DDD7CA] text-[#46513A] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#46513A]" />
              Verified Kerala Patron
            </span>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="flex gap-2 border-b border-[#DDD7CA] overflow-x-auto pb-px mb-8 scrollbar-none">
          <button
            onClick={() => setAccountTab('orders')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 ${
              accountTab === 'orders'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#C99518]" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setAccountTab('wishlist')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 ${
              accountTab === 'wishlist'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#A63D2F]" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setAccountTab('addresses')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 ${
              accountTab === 'addresses'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#46513A]" />
            <span>Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setAccountTab('notifications')}
            className={`label text-[11px] px-5 py-3 border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 ${
              accountTab === 'notifications'
                ? 'border-[#171714] text-[#171714] bg-white/60 font-semibold'
                : 'border-transparent text-[#68645B] hover:text-[#171714]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#68645B]" />
            <span>Notifications ({notifications.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {accountTab === 'orders' && (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-[#DDD7CA] overflow-hidden"
              >
                {/* Order Header Summary */}
                <div
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="p-6 bg-[#FAF8F5] border-b border-[#DDD7CA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F5F1E8] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#171714]">
                        Order #{order.id}
                      </span>
                      <span className="label text-[9px] bg-[#171714] text-[#F5F1E8] px-2.5 py-0.5">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#68645B] font-mono">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="label text-[9px] text-[#68645B] block">Total Amount</span>
                      <span className="font-serif text-xl text-[#171714]">
                        ₹{order.total}
                      </span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-[#68645B] transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <div className="p-6 md:p-8 space-y-8 animate-fade-in">
                    
                    {/* Timeline */}
                    <div className="border border-[#DDD7CA] p-6 bg-[#FAF8F5]">
                      <span className="label text-[10px] text-[#A63D2F] block mb-4 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        Kitchen & Delivery Logistics
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {order.timeline.map((step, idx) => (
                          <div
                            key={idx}
                            className={`p-3 border text-xs space-y-1 ${
                              step.completed
                                ? step.active
                                  ? 'bg-[#171714] text-white border-[#171714]'
                                  : 'bg-white text-[#46513A] border-[#DDD7CA]'
                                : 'bg-[#FAF8F5] text-[#68645B]/60 border-[#DDD7CA]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="label text-[9px] block">Step 0{idx + 1}</span>
                              {step.completed && <CheckCircle2 className="w-3 h-3 text-[#C99518]" />}
                            </div>
                            <h5 className="font-serif text-sm leading-tight">{step.title}</h5>
                            <span className="text-[10px] block opacity-75 font-mono">{step.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <span className="label text-[10px] text-[#68645B] block">
                        Ordered Items ({order.items.length})
                      </span>
                      <div className="border border-[#DDD7CA] divide-y divide-[#DDD7CA]">
                        {order.items.map(item => (
                          <div key={item.id} className="p-4 bg-white flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-4">
                              <img src={item.image} alt="" className="w-12 h-12 object-cover border border-[#DDD7CA] bg-[#EEEBE3]" />
                              <div>
                                <h5 className="font-serif text-base text-[#171714]">{item.productName}</h5>
                                <span className="label text-[9px] text-[#68645B] block mt-0.5">
                                  Kitchen: {item.sellerName}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[#68645B]">₹{item.price} × {item.quantity}</span>
                              <span className="font-serif text-base text-[#171714] block mt-0.5">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="p-5 bg-[#FAF8F5] border border-[#DDD7CA] text-xs space-y-1">
                      <span className="label text-[9px] text-[#68645B] block mb-1">Shipping Destination</span>
                      <p className="text-sm text-[#171714]">
                        {order.deliveryAddress.name}, {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}
                      </p>
                      <span className="text-xs text-[#68645B] block font-mono">Contact: {order.deliveryAddress.phone}</span>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Wishlist Grid */}
        {accountTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] border border-[#DDD7CA] bg-[#DDD7CA]">
                {wishlistedProducts.map(prod => (
                  <div key={prod.id} className="bg-[#F5F1E8]">
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center border border-[#DDD7CA] bg-white space-y-4">
                <Heart className="w-8 h-8 text-[#A63D2F] mx-auto opacity-50" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-[#171714]">Your wishlist is empty</h3>
                <p className="body-text max-w-sm mx-auto">
                  Explore our cold stone-ground spices and home-baked artisanal snacks to bookmark your favorites.
                </p>
                <button
                  onClick={() => navigateToShop()}
                  className="btn-primary"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Address Book */}
        {accountTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white p-6 border border-[#DDD7CA] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-[#171714] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A63D2F]" strokeWidth={1.5} />
                    {addr.name}
                  </h3>
                  {addr.isDefault ? (
                    <span className="label text-[9px] px-2.5 py-1 bg-[#46513A]/10 text-[#46513A] border border-[#46513A]/20">
                      Default Delivery
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="label text-[10px] text-[#A63D2F] hover:underline cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                </div>

                <p className="body-text text-sm leading-relaxed">
                  {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}{addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                </p>
                <span className="text-xs text-[#68645B] block font-mono">Phone: {addr.phone}</span>

                {!addr.isDefault && (
                  <div className="pt-3 border-t border-[#DDD7CA]">
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="label text-[10px] text-[#A63D2F] flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Address</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Notifications */}
        {accountTab === 'notifications' && (
          <div className="bg-white border border-[#DDD7CA] divide-y divide-[#DDD7CA]">
            {notifications.map(n => (
              <div key={n.id} className="p-5 flex items-start justify-between gap-4 text-xs hover:bg-[#FAF8F5] transition-colors">
                <div>
                  <h4 className="font-serif text-base text-[#171714]">{n.title}</h4>
                  <p className="body-text text-xs mt-1">{n.message}</p>
                </div>
                <span className="label text-[9px] text-[#68645B] shrink-0 font-mono">{n.time}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
