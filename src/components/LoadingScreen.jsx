import React, { useRef, useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(false);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 600);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for autoplay policy
      });
    }

    // Safety timeout to ensure user is never stuck
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 7000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F1E8] select-none transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Small centered video */}
      <div className="w-40 h-40 sm:w-52 sm:h-52 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
          onError={handleFinish}
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="/loadingscreen/animation.webm" type="video/webm" />
        </video>
      </div>

      {/* Brand name below */}
      <img src="/logo.png" alt="Ammikallu" className="h-16 w-auto object-contain mb-2" />
      <p className="mt-2 font-serif text-2xl text-[#171714] tracking-tight">Ammikallu</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#68645B]">Heritage Stone-Ground</p>

      {/* Skip */}
      <button
        onClick={handleFinish}
        className="absolute bottom-8 right-8 text-[11px] uppercase tracking-widest text-[#68645B] hover:text-[#171714] transition-colors cursor-pointer"
      >
        Skip →
      </button>
    </div>
  );
}
