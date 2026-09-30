import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

const TOTAL_FRAMES = 240;
const BATCH_SIZE = 8;

export default function HeroVideoScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1));
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const animationFrameIdRef = useRef(null);

  const [titleOpacity, setTitleOpacity] = useState(1);
  const [progressState, setProgressState] = useState(0);

  // Frame URL generator matching /bg/ezgif-frame-001.jpg ... /bg/ezgif-frame-240.jpg
  const getFrameUrl = useCallback((index) => {
    const padded = String(index).padStart(3, '0');
    return `/bg/ezgif-frame-${padded}.jpg`;
  }, []);

  // Draw image with cover sizing on canvas
  const drawImageCover = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Render current frame or closest loaded frame
  const renderCurrentFrame = useCallback(
    (frameNum) => {
      let img = imagesRef.current[frameNum];

      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = imagesRef.current[frameNum - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            break;
          }
          const next = imagesRef.current[frameNum + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            break;
          }
        }
      }

      if (img) {
        drawImageCover(img);
      }
    },
    [drawImageCover]
  );

  // Resize canvas for device pixel ratio sharpness
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    renderCurrentFrame(Math.round(currentFrameRef.current));
  }, [renderCurrentFrame]);

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[1] = firstImg;
      resizeCanvas();
      renderCurrentFrame(1);
    };

    // Load remaining frames in batches
    const loadQueue = [];
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      loadQueue.push(i);
    }

    let activeLoads = 0;
    const loadNext = () => {
      if (isCancelled || loadQueue.length === 0) return;

      while (activeLoads < BATCH_SIZE && loadQueue.length > 0) {
        const frameIndex = loadQueue.shift();
        activeLoads++;

        const img = new Image();
        img.src = getFrameUrl(frameIndex);
        img.onload = () => {
          activeLoads--;
          if (isCancelled) return;
          imagesRef.current[frameIndex] = img;

          if (Math.round(currentFrameRef.current) === frameIndex) {
            renderCurrentFrame(frameIndex);
          }
          loadNext();
        };
        img.onerror = () => {
          activeLoads--;
          if (isCancelled) return;
          loadNext();
        };
      }
    };

    loadNext();

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [getFrameUrl, renderCurrentFrame, resizeCanvas]);

  // Smooth lerp animation loop (60 FPS)
  useEffect(() => {
    let lastRenderedFrame = 1;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.15;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(currentFrameRef.current))
      );

      if (frameToDraw !== lastRenderedFrame) {
        renderCurrentFrame(frameToDraw);
        lastRenderedFrame = frameToDraw;
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [renderCurrentFrame]);

  // Listen to window scroll strictly within this Hero track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.offsetHeight - window.innerHeight;

      if (scrollHeight <= 0) return;

      // Calculate progress between 0 and 1 strictly for the hero track
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollHeight));

      setProgressState(progress);

      // Target frame scrubs from 1 to 240
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);

      // Title fades out quickly as scroll begins (0% to ~25% scroll)
      const fade = Math.max(0, 1 - progress * 3.5);
      setTitleOpacity(fade);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[260vh] sm:h-[300vh] bg-[#F7F2E8]"
    >
      {/* Sticky Fullscreen Video Canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block transform-gpu pointer-events-none"
        />

        {/* Ambient Subtle Vignette & Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2E8]/40 via-transparent to-[#F7F2E8]/50 pointer-events-none" />

        {/* Minimal Hero Title Overlay */}
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none transition-all duration-500 transform-gpu"
          style={{
            opacity: titleOpacity,
            transform: `translateY(-${(1 - titleOpacity) * 48}px)`,
            visibility: titleOpacity <= 0.01 ? 'hidden' : 'visible'
          }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-[#E8E1D5] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38]"></span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#171714]">
              01 • Heritage Stone-Ground
            </span>
          </div>

          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-[#171714] tracking-tight leading-[0.9] drop-shadow-xs">
            Ammikallu
          </h1>

          <p className="mt-5 font-sans text-sm sm:text-base md:text-lg text-[#5C5750] font-normal tracking-wide max-w-lg mx-auto">
            Cold stone-ground Kasargod spices and heritage curry powders from verified Kerala kitchens.
          </p>

          {/* Minimal Scroll Cue */}
          <div className="mt-12 sm:mt-16 inline-flex flex-col items-center gap-1.5 text-[#171714]">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C867E]">
              Scroll to Animate
            </span>
            <ChevronDown className="w-4 h-4 text-[#B85C38] animate-bounce" />
          </div>
        </div>

        {/* Minimalist Floating Frame Progress Track (fades in as user scrolls) */}
        {progressState > 0.02 && progressState < 0.98 && (
          <div className="absolute bottom-8 left-8 right-8 sm:left-12 sm:right-12 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-[#171714]/70 transition-opacity duration-300">
            <span className="tracking-widest font-semibold uppercase text-[10px]">
              Frame {String(Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progressState * 239) + 1))).padStart(3, '0')} / 240
            </span>

            {/* Hairline track */}
            <div className="flex-1 mx-6 h-[1.5px] bg-[#171714]/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B85C38] transition-all duration-75"
                style={{ width: `${Math.round(progressState * 100)}%` }}
              />
            </div>

            <span className="text-[10px] tracking-wider uppercase font-semibold">
              {Math.round(progressState * 100)}%
            </span>
          </div>
        )}

        {/* Subtle Completion Hint when Frame 240 is reached */}
        {progressState >= 0.96 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fade-in text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#171714] text-xs font-semibold border border-[#E8E1D5] shadow-warm-md">
              <span>Explore Collection</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#B85C38] animate-bounce" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
