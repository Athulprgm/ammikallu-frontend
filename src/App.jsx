import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';

// Views
import CustomerHome from './views/CustomerHome';
import ShopPage from './views/ShopPage';
import SellerStorefront from './views/SellerStorefront';
import UserAccountView from './views/UserAccountView';
import SellerPortal from './views/SellerPortal';
import AdminConsole from './views/AdminConsole';

function MainAppContent() {
  const { currentView, currentRole, toast } = useApp();
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} autoStart={true} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171714] flex flex-col justify-between relative selection:bg-[#A63D2F] selection:text-[#F5F1E8]">

      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />


      {/* Toast */}
      <Toast toast={toast} onClose={() => { }} />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <>
            {currentView === 'home' && <CustomerHome />}
            {currentView === 'shop' && <ShopPage />}
            {currentView === 'seller-store' && <SellerStorefront />}
            {currentView === 'account' && <UserAccountView />}
          </>
        )}
        {currentRole === 'seller' && <SellerPortal />}
        {currentRole === 'admin' && <AdminConsole />}
      </main>

      {/* Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
