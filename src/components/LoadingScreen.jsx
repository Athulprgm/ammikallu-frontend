import React, { useRef, useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(false);

  const handleFinish = () => {
    if (isFading) return; // guard against skip + onEnded racing
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
    }, 12000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F1E8] select-none transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered video animation */}
      <div className="w-64 h-64 sm:w-80 sm:h-80 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
          onError={handleFinish}
          className="w-full h-full object-contain pointer-events-none"
        >
          <source src="/loadingscreen/animation.webm" type="video/webm" />
        </video>
      </div>

      {/* Skip button — never trap the user (Bug #4) */}
      <button
        type="button"
        onClick={handleFinish}
        className="label text-[10px] mt-6 text-[#68645B] hover:text-[#171714] transition-colors cursor-pointer underline underline-offset-4"
      >
        Skip Intro
      </button>
    </div>
  );
}
