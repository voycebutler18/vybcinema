import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CFStreamIMAPlayerProps {
  playbackId: string;
  channelSlug: string;
  contentId: string;
  durationSec?: number;
  adBreaks?: number[];
  vastTagUrl?: string;
  title: string;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    google: {
      ima: {
        AdDisplayContainer: any;
        AdsLoader: any;
        AdsManagerLoadedEvent: any;
        AdsRequest: any;
        ViewMode: any;
        AdEvent: any;
        AdErrorEvent: any;
        settings: any;
      };
    };
    Hls?: any;
  }
}

export const CFStreamIMAPlayer: React.FC<CFStreamIMAPlayerProps> = ({
  playbackId,
  channelSlug,
  contentId,
  durationSec = 0,
  adBreaks = [0], // Default preroll
  vastTagUrl,
  title,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adLoadError, setAdLoadError] = useState<string | null>(null);
  const [imaLoaded, setImaLoaded] = useState(false);
  const [adsLoader, setAdsLoader] = useState<any>(null);
  const [adsManager, setAdsManager] = useState<any>(null);
  const [adDisplayContainer, setAdDisplayContainer] = useState<any>(null);

  const hlsUrl = `https://videodelivery.net/${playbackId}/manifest/video.m3u8`;

  /* ---------- FIX 1: Attach HLS.js on non-Safari so .m3u8 plays ---------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Safari plays HLS natively
      v.src = hlsUrl;
      return;
    }

    // Load Hls.js from CDN (no bundler changes)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;
    script.onload = () => {
      try {
        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls();
          hls.loadSource(hlsUrl);
          hls.attachMedia(v);
          // keep a ref for cleanup
          (v as any)._hls = hls;
        } else {
          // Fallback: set src directly
          v.src = hlsUrl;
        }
      } catch (e) {
        console.error(e);
        v.src = hlsUrl;
      }
    };
    script.onerror = () => {
      // If Hls.js fails to load, try direct src
      v.src = hlsUrl;
    };
    document.head.appendChild(script);

    return () => {
      try { (v as any)._hls?.destroy?.(); } catch {}
      document.head.removeChild(script);
    };
  }, [hlsUrl]);

  // Load Google IMA SDK
  useEffect(() => {
    if ((window as any).google && (window as any).google.ima) {
      setImaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    script.async = true;
    script.onload = () => setImaLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Google IMA SDK');
      setAdLoadError('Failed to load ad system');
      onError?.('Failed to load ad system');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [onError]);

  // Initialize IMA
  useEffect(() => {
    if (!imaLoaded || !videoRef.current || !adContainerRef.current || !vastTagUrl) return;

    try {
      // Create ad display container
      const adc = new window.google.ima.AdDisplayContainer(
        adContainerRef.current,
        videoRef.current
      );
      setAdDisplayContainer(adc);

      // Create ads loader
      const loader = new window.google.ima.AdsLoader(adc);
      setAdsLoader(loader);

      // Listen for ads manager loaded event
      loader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          const manager = event.getAdsManager(videoRef.current);
          setAdsManager(manager);

          // Add event listeners
          manager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () => {
            console.log('Ad loaded');
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.STARTED, () => {
            console.log('Ad started');
            setIsAdPlaying(true);
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
            console.log('Content pause requested');
            if (videoRef.current) {
              videoRef.current.pause();
            }
            if (adContainerRef.current) {
              adContainerRef.current.style.display = 'block';
              adContainerRef.current.style.pointerEvents = 'auto';
            }
            setIsAdPlaying(true);
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
            console.log('Content resume requested');
            resumeContent();
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, () => {
            console.log('Ad complete');
            resumeContent();
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.SKIPPED, () => {
            console.log('Ad skipped');
            resumeContent();
          });

          manager.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            console.log('All ads completed');
            resumeContent();
            try { manager?.destroy(); } catch {}
          });

          try {
            /* ---------- FIX 2: Use actual player size, not 640x480 ---------- */
            const v = videoRef.current!;
            const w = v?.clientWidth || 1280;
            const h = v?.clientHeight || 720;
            manager.init(w, h, window.google.ima.ViewMode.NORMAL);
            manager.start();
          } catch (adError) {
            console.error('AdsManager error:', adError);
            setAdLoadError('Ad failed to start');
            startContentVideo(); // Fallback to content
          }
        }
      );

      // Listen for ad errors
      loader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        (event: any) => {
          console.error('Ad error:', event.getError?.() || event);
          setAdLoadError('Ad failed to load');
          setIsAdPlaying(false);
          startContentVideo(); // Fallback to content
        }
      );

    } catch (error) {
      console.error('IMA initialization error:', error);
      setAdLoadError('Ad system initialization failed');
      onError?.('Ad system initialization failed');
    }
  }, [imaLoaded, vastTagUrl, onError]);

  const startContentVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const resumeContent = () => {
    try { adsManager?.destroy(); } catch {}

    // Hide ad container
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'none';
      adContainerRef.current.style.pointerEvents = 'none';
    }

    setIsAdPlaying(false);

    // Ensure video plays after ad
    if (videoRef.current) {
      videoRef.current.style.display = 'block';
      videoRef.current.play().catch(() => {
        // If autoplay is blocked, try muted
        videoRef.current!.muted = true;
        setIsMuted(true);
        videoRef.current!.play().catch(console.error);
      });
      setIsPlaying(true);
    }
  };

  const requestAds = () => {
    if (!adsLoader || !vastTagUrl || !adDisplayContainer) {
      startContentVideo();
      return;
    }

    try {
      adDisplayContainer.initialize();

      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl = vastTagUrl;

      // Use current player size
      const v = videoRef.current!;
      const w = v?.clientWidth || 1280;
      const h = v?.clientHeight || 720;
      adsRequest.linearAdSlotWidth = w;
      adsRequest.linearAdSlotHeight = h;
      adsRequest.nonLinearAdSlotWidth = w;
      adsRequest.nonLinearAdSlotHeight = Math.round(h / 3);

      /* ---------- FIX 3: Guard timeout so ads can't stall ---------- */
      const guard = setTimeout(() => {
        console.warn('Ad load timeout, resuming content');
        resumeContent();
      }, 3000);

      const onLoadedOnce = () => clearTimeout(guard);
      adsLoader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onLoadedOnce,
        { once: true }
      );

      adsLoader.requestAds(adsRequest);
    } catch (error) {
      console.error('Ad request error:', error);
      setAdLoadError('Failed to request ads');
      startContentVideo();
    }
  };

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (vastTagUrl && !isAdPlaying && videoRef.current.currentTime === 0) {
        // First play - show ads
        requestAds();
      } else {
        // Resume content
        videoRef.current.play().catch(() => {
          videoRef.current!.muted = true;
          setIsMuted(true);
          videoRef.current!.play().catch(console.error);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current?.parentElement) return;

    try {
      if (!document.fullscreenElement) {
        await videoRef.current.parentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        // src is set by Hls.js effect (or native for Safari). Keeping this line is fine as a fallback:
        src={hlsUrl}
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        controls={isAdPlaying ? false : true} // Hide controls during ads
        style={{ display: isAdPlaying ? 'none' : 'block' }}
      />

      {/* Ad Container (overlay) */}
      <div
        ref={adContainerRef}
        className={`absolute inset-0 ${isAdPlaying ? 'block' : 'hidden'}`}
        style={{ zIndex: isAdPlaying ? 10 : -1, pointerEvents: isAdPlaying ? 'auto' : 'none' }}
      />

      {/* Custom Controls Overlay */}
      {!isAdPlaying && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayClick}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <span className="text-white text-sm">{title}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Ad Loading Indicator */}
      {isAdPlaying && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
          Ad Playing...
        </div>
      )}

      {/* Error Message */}
      {adLoadError && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm">
          {adLoadError} - Playing content
        </div>
      )}
    </div>
  );
};
