import React, { useRef, useState, useEffect } from 'react';

interface HeroVideoBackgroundProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  videoSrc = '/assets/videos/pgot-hero-background.mp4',
  posterSrc = '/assets/images/pgot-logo.png',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce muted on property level for strict mobile & desktop autoplay compliance (iOS Safari, Chrome, Edge)
    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay was prevented or interrupted (e.g. low power mode)
          console.warn('Hero background video autoplay notice:', err);
        });
      }
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      attemptPlay();
    };

    const handleError = () => {
      console.warn('Hero background video encountered playback error; falling back to visual ambient styling.');
      setHasError(true);
    };

    // If video is already ready (from cache or fast load)
    if (video.readyState >= 2) {
      setIsVideoLoaded(true);
      attemptPlay();
    }

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', attemptPlay);
    video.addEventListener('error', handleError);

    attemptPlay();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', attemptPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Underlying Base Background Color */}
      <div className="absolute inset-0 bg-[#061426]" />

      {/* 2. Continuous Autoplay Looping Background Video (Always Muted, Object-Fit Cover) */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-90' : 'opacity-0'
          }`}
          style={{ objectFit: 'cover' }}
        />
      )}

      {/* Fallback Static Visual if video fails or is loading */}
      {(hasError || !isVideoLoaded) && (
        <div className="absolute inset-0 flex items-center justify-end pr-12 lg:pr-32 opacity-25">
          <div className="w-[500px] h-[500px] rounded-full border border-[#D4AF37]/30 bg-radial from-[#168BFF]/20 via-[#0A1B33]/60 to-transparent animate-pulse-slow flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full border border-[#D4AF37]/20 border-dashed animate-spin-slow" />
          </div>
        </div>
      )}

      {/* 3. Sophisticated Dark Navy & Gold Vignette Overlay */}
      {/* Left 45% dark & clean gradient for high-contrast headline readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, 
              rgba(6, 20, 38, 0.96) 0%, 
              rgba(6, 20, 38, 0.92) 32%, 
              rgba(6, 20, 38, 0.65) 55%, 
              rgba(6, 20, 38, 0.35) 85%,
              rgba(6, 20, 38, 0.5) 100%
            )
          `,
        }}
      />

      {/* Top and Bottom soft fades */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(6, 20, 38, 0.85) 0%, 
              rgba(6, 20, 38, 0.05) 25%, 
              rgba(6, 20, 38, 0.05) 75%, 
              rgba(6, 20, 38, 0.98) 100%
            )
          `,
        }}
      />

      {/* Metallic Gold & Blue Ambient Edge Highlights */}
      <div className="absolute -top-40 right-10 w-[550px] h-[550px] bg-[#168BFF]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-[#0A1B33]/60 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4AF37 1px, transparent 1px),
            linear-gradient(to bottom, #168BFF 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};
