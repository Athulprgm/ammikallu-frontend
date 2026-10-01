import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoadingScreen from './components/LoadingScreen';
import AuthScreen from './views/AuthScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';

// Views
import CustomerHome from './views/CustomerHome';
import ShopPage from './views/ShopPage';
import UserAccountView from './views/UserAccountView';
import AdminConsole from './views/AdminConsole';

// Session flag so the intro animation only plays once per browser session
const INTRO_KEY = 'ammikallu.introSeen';
const hasSeenIntro = () => {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
};

function MainAppContent() {
  const { session, isAdmin, currentView, toast, setToast } = useApp();
  const [showLoading, setShowLoading] = useState(() => !hasSeenIntro());

  // Auth gate — not signed in: show the Flipkart-style login screen only.
  if (!session) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <AuthScreen />
      </>
    );
  }

  if (showLoading) {
    return (
      <LoadingScreen
        onComplete={() => {
          try {
            window.sessionStorage.setItem(INTRO_KEY, '1');
          } catch {
            /* storage unavailable — just skip next time if possible */
          }
          setShowLoading(false);
        }}
      />
    );
  }

  // ── Admin session ──────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] text-[#171714] relative selection:bg-[#A63D2F] selection:text-[#F5F1E8]">
        <div className="grain-overlay" aria-hidden="true" />
        <Toast toast={toast} onClose={() => setToast(null)} />
        <main>
          <AdminConsole />
        </main>
      </div>
    );
  }

  // ── User (customer) session ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171714] flex flex-col justify-between relative selection:bg-[#A63D2F] selection:text-[#F5F1E8]">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Toast toast={toast} onClose={() => setToast(null)} />
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <CustomerHome />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'account' && <UserAccountView />}
      </main>

      {/* Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />

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
