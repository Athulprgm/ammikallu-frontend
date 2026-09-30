import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

const TOTAL_FRAMES = 240;
const BATCH_SIZE = 8;

export default function HeroSection() {
  const { navigateToShop, setCurrentView } = useApp();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1));
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const animationFrameIdRef = useRef(null);

  const [progress, setProgress] = useState(0);

  /* ── Frame URL ──────────────────────────────────────────────── */
  const getFrameUrl = useCallback((i) => {
    return `/bg/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
  }, []);

  /* ── Draw cover ─────────────────────────────────────────────── */
  const drawCover = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img?.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;
    const ratio = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const nw = img.naturalWidth * ratio;
    const nh = img.naturalHeight * ratio;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
  }, []);

  /* ── Render nearest loaded frame ────────────────────────────── */
  const renderFrame = useCallback((n) => {
    let img = imagesRef.current[n];
    if (!img?.complete || img.naturalWidth === 0) {
      for (let o = 1; o < TOTAL_FRAMES; o++) {
        const prev = imagesRef.current[n - o];
        if (prev?.complete && prev.naturalWidth > 0) { img = prev; break; }
        const next = imagesRef.current[n + o];
        if (next?.complete && next.naturalWidth > 0) { img = next; break; }
      }
    }
    if (img) drawCover(img);
  }, [drawCover]);

  /* ── Resize canvas ──────────────────────────────────────────── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    renderFrame(Math.round(currentFrameRef.current));
  }, [renderFrame]);

  /* ── Preload frames ─────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    const first = new Image();
    first.src = getFrameUrl(1);
    first.onload = () => {
      if (cancelled) return;
      imagesRef.current[1] = first;
      resizeCanvas();
      renderFrame(1);
    };

    const queue = Array.from({ length: TOTAL_FRAMES - 1 }, (_, i) => i + 2);
    let active = 0;
    const loadNext = () => {
      if (cancelled || queue.length === 0) return;
      while (active < BATCH_SIZE && queue.length > 0) {
        const idx = queue.shift();
        active++;
        const img = new Image();
        img.src = getFrameUrl(idx);
        img.onload = () => {
          active--;
          if (cancelled) return;
          imagesRef.current[idx] = img;
          if (Math.round(currentFrameRef.current) === idx) renderFrame(idx);
          loadNext();
        };
        img.onerror = () => { active--; loadNext(); };
      }
    };
    loadNext();

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => { cancelled = true; window.removeEventListener('resize', resizeCanvas); };
  }, [getFrameUrl, renderFrame, resizeCanvas]);

  /* ── 60fps smooth lerp loop ─────────────────────────────────── */
  useEffect(() => {
    let lastFrame = 1;
    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) currentFrameRef.current += diff * 0.15;
      else currentFrameRef.current = targetFrameRef.current;
      const f = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentFrameRef.current)));
      if (f !== lastFrame) { renderFrame(f); lastFrame = f; }
      animationFrameIdRef.current = requestAnimationFrame(tick);
    };
    animationFrameIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [renderFrame]);

  /* ── Scroll → frame scrub ───────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollH = el.offsetHeight - window.innerHeight;
      if (scrollH <= 0) return;
      const scrolled = -el.getBoundingClientRect().top;
      
      // Video animation finishes at 1.8vh. 
      // The rest of the sticky height (up to 400vh) keeps the video frozen for the popup.
      const animationEndScroll = window.innerHeight * 1.8;
      const videoP = Math.max(0, Math.min(1, scrolled / animationEndScroll));
      
      setProgress(videoP);
      targetFrameRef.current = 1 + videoP * (TOTAL_FRAMES - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Parallax values from progress ─────────────────────────── */
  const titleY    = progress * -120;
  const titleOp   = Math.max(0, 1 - progress * 4);
  const descY     = progress * -70;
  const descOp    = Math.max(0, 1 - progress * 3.5);
  const ctaY      = progress * -50;
  const ctaOp     = Math.max(0, 1 - progress * 3);
  const scrollOp  = Math.max(0, 1 - progress * 5);
  const videoScale = 1 + progress * 0.08;

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden">

        {/* Canvas — scroll-driven video */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ transform: `scale(${videoScale})`, transformOrigin: 'center center' }}
        />

        {/* Cinematic overlay gradient */}
        <div
          className="hero-overlay absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Left-bottom content block */}
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="container-editorial pb-16 md:pb-20 w-full max-w-[760px]">

            {/* Eyebrow */}
            <div
              className="mb-6 pointer-events-none"
              style={{ opacity: titleOp, transform: `translateY(${titleY * 0.6}px)` }}
            >
              <span className="label text-white/60">Rooted in Kerala</span>
            </div>

            {/* Headline */}
            <h1
              className="display-xl text-white mb-6 will-transform pointer-events-none"
              style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}
            >
              The Taste<br />of Real Kerala.
            </h1>

            {/* Description */}
            <p
              className="body-text text-white/70 mb-8 max-w-md pointer-events-none"
              style={{ opacity: descOp, transform: `translateY(${descY}px)` }}
            >
              Authentic spices, carefully sourced and crafted for the modern kitchen.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-4 flex-wrap pointer-events-auto"
              style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)` }}
            >
              <button
                onClick={() => navigateToShop()}
                className="btn-primary"
                id="hero-explore-btn"
              >
                Explore Collection
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('kerala-story')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="btn-ghost"
                id="hero-story-btn"
              >
                Our Story
              </button>
            </div>

            {/* Scroll indicator */}
            <div
              className="mt-12 flex items-center gap-3 pointer-events-none"
              style={{ opacity: scrollOp }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1px] h-8 bg-white/40 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 w-full bg-white/80 transition-all duration-100"
                    style={{ height: `${Math.min(100, progress * 400)}%` }}
                  />
                </div>
              </div>
              <span className="label text-[10px] text-white/50">Scroll to explore</span>
            </div>
          </div>
        </div>

        {/* Frame progress track (subtle, only during scroll) */}
        {progress > 0.05 && progress < 0.95 && (
          <div className="absolute bottom-6 right-6 pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="w-24 h-[1px] bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white/50 transition-all duration-75"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="label text-[10px] text-white/40">
                {String(Math.round(progress * 100)).padStart(2, '0')}%
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
