import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented or interrupted:', err);
            setIsPlaying(false);
          });
      }
    };

    const handleError = () => {
      console.warn('Hero background video encountered a playback error; using procedural visual fallback.');
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Underlying Base Background Color */}
      <div className="absolute inset-0 bg-[#061426]" />

      {/* 2. Background Video */}
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
        />
      )}

      {/* Fallback Static Visual if video fails or reduced motion is active */}
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

      {/* Video Control Pill (accessible, bottom-right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-center gap-2 bg-[#061426]/75 backdrop-blur-md border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-xs text-gray-300">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors focus:outline-none"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
          aria-label={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-medium hidden sm:inline">
            {isPlaying ? 'Live Cinematic' : 'Paused'}
          </span>
        </button>
        <span className="h-3 w-[1px] bg-white/20" />
        <button
          onClick={toggleMute}
          className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
