import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CFStreamIMAPlayerProps {
  playbackId: string;
  channelSlug: string;
  contentId: string;
  durationSec?: number;
  adBreaks?: number[];              // preroll if [0], add seconds for midrolls
  vastTagUrl?: string;              // put your GAM tag here
  title: string;
  onError?: (error: string) => void;
  // optional callbacks from your VideoPlayer:
  onAdStart?: () => void;
  onAdComplete?: () => void;
  onContentStart?: () => void;
  onContentPause?: () => void;
}

declare global {
  interface Window {
    google?: any;
    Hls?: any;
  }
}

export const CFStreamIMAPlayer: React.FC<CFStreamIMAPlayerProps> = ({
  playbackId,
  channelSlug,
  contentId,
  durationSec = 0,
  adBreaks = [0],
  vastTagUrl,
  title,
  onError,
  onAdStart,
  onAdComplete,
  onContentStart,
  onContentPause,
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

  /* ---------------- HLS attach (Chrome/Edge/Firefox need Hls.js) ---------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      v.src = hlsUrl;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;
    script.onload = () => {
      try {
        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls();
          (v as any)._hls = hls;
          hls.loadSource(hlsUrl);
          hls.attachMedia(v);
        } else {
          v.src = hlsUrl;
        }
      } catch (e) {
        console.error('HLS init error:', e);
        v.src = hlsUrl;
      }
    };
    script.onerror = () => { v.src = hlsUrl; };
    document.head.appendChild(script);

    return () => {
      try { (v as any)._hls?.destroy?.(); } catch {}
      document.head.removeChild(script);
    };
  }, [hlsUrl]);

  /* ---------------- Load IMA SDK ---------------- */
  useEffect(() => {
    if (window.google?.ima) { setImaLoaded(true); return; }
    const s = document.createElement('script');
    s.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    s.async = true;
    s.onload = () => setImaLoaded(true);
    s.onerror = () => {
      console.error('Failed to load IMA SDK');
      setAdLoadError('Failed to load ad system');
      onError?.('Failed to load ad system');
    };
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, [onError]);

  /* ---------------- Init IMA, request preroll on first gesture ---------------- */
  useEffect(() => {
    if (!imaLoaded || !videoRef.current || !adContainerRef.current || !vastTagUrl) return;

    try {
      const adc = new window.google.ima.AdDisplayContainer(adContainerRef.current, videoRef.current);
      setAdDisplayContainer(adc);

      const loader = new window.google.ima.AdsLoader(adc);
      setAdsLoader(loader);

      // When ads manager arrives
      loader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          const manager = event.getAdsManager(videoRef.current);
          setAdsManager(manager);

          manager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () => console.log('Ad loaded'));
          manager.addEventListener(window.google.ima.AdEvent.Type.STARTED, () => {
            setIsAdPlaying(true);
            onAdStart?.();
          });
          manager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
            videoRef.current?.pause();
            if (adContainerRef.current) {
              adContainerRef.current.style.display = 'block';
              adContainerRef.current.style.pointerEvents = 'auto';
            }
            setIsAdPlaying(true);
          });
          const resume = () => {
            try { manager?.destroy(); } catch {}
            if (adContainerRef.current) {
              adContainerRef.current.style.display = 'none';
              adContainerRef.current.style.pointerEvents = 'none';
            }
            setIsAdPlaying(false);
            const v = videoRef.current!;
            v.play().catch(() => {
              v.muted = true; setIsMuted(true);
              v.play().catch(console.error);
            });
            setIsPlaying(true);
            onAdComplete?.();
            onContentStart?.();
          };
          manager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, resume);
          manager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, resume);
          manager.addEventListener(window.google.ima.AdEvent.Type.SKIPPED, resume);
          manager.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, resume);

          try {
            const v = videoRef.current!;
            const w = v.clientWidth || 1280;
            const h = v.clientHeight || 720;
            manager.init(w, h, window.google.ima.ViewMode.NORMAL);
            manager.start();
          } catch (err) {
            console.error('AdsManager error:', err);
            setAdLoadError('Ad failed to start');
            // fallback: start content
            videoRef.current?.play().catch(console.error);
            setIsPlaying(true);
            onContentStart?.();
          }
        }
      );

      // Ad errors should never block content
      loader.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, (e: any) => {
        console.error('Ad error:', e.getError?.() || e);
        setAdLoadError('Ad failed to load');
        setIsAdPlaying(false);
        videoRef.current?.play().catch(console.error);
        setIsPlaying(true);
        onContentStart?.();
      });

      // Kick off ads on the **first user gesture** (mobile-safe)
      const onFirstPlay = () => {
        try { adc.initialize(); } catch {}
        requestAds(loader);
        videoRef.current?.removeEventListener('play', onFirstPlay);
      };
      videoRef.current.addEventListener('play', onFirstPlay, { once: true });
    } catch (err) {
      console.error('IMA init error:', err);
      setAdLoadError('Ad system initialization failed');
      onError?.('Ad system initialization failed');
    }
  }, [imaLoaded, vastTagUrl]);

  const requestAds = (loader = adsLoader) => {
    if (!loader || !vastTagUrl || !adDisplayContainer) {
      // no ads → just play content
      videoRef.current?.play().catch(console.error);
      setIsPlaying(true);
      onContentStart?.();
      return;
    }

    try {
      const v = videoRef.current!;
      // initialize again just in case the gesture happened elsewhere
      try { adDisplayContainer.initialize(); } catch {}

      const req = new window.google.ima.AdsRequest();
      req.adTagUrl = vastTagUrl; // for a quick test, use Google’s sample VMAP (see note below)
      const w = v.clientWidth || 1280;
      const h = v.clientHeight || 720;
      req.linearAdSlotWidth = w;
      req.linearAdSlotHeight = h;
      req.nonLinearAdSlotWidth = w;
      req.nonLinearAdSlotHeight = Math.round(h / 3);

      // Guard: if ads don't load in time, resume content
      const guard = setTimeout(() => {
        console.warn('Ad load timeout; resuming content');
        setIsAdPlaying(false);
        v.play().catch(console.error);
        setIsPlaying(true);
        onContentStart?.();
      }, 3000);

      const clearGuard = () => clearTimeout(guard);
      loader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        clearGuard,
        { once: true }
      );

      loader.requestAds(req);
    } catch (err) {
      console.error('Ad request error:', err);
      setAdLoadError('Failed to request ads');
      videoRef.current?.play().catch(console.error);
      setIsPlaying(true);
      onContentStart?.();
    }
  };

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.pause(); setIsPlaying(false); onContentPause?.();
    } else {
      // first play → ads; else resume content
      if (vastTagUrl && !isAdPlaying && v.currentTime === 0) requestAds();
      else {
        v.play().catch(() => {
          v.muted = true; setIsMuted(true);
          v.play().catch(console.error);
        });
        setIsPlaying(true);
        onContentStart?.();
      }
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch (e) { console.error('Fullscreen error:', e); }
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      // Make ANY tap/click kick things off (mobile-friendly)
      onClick={() => {
        const v = videoRef.current;
        if (v && v.currentTime === 0 && !isPlaying && !isAdPlaying) handlePlayClick();
      }}
    >
      {/* Content video (always there) */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        muted={isMuted}
        playsInline
        onPlay={() => { setIsPlaying(true); }}
        onPause={() => { setIsPlaying(false); onContentPause?.(); }}
        controls={isAdPlaying ? false : true}
        // src is set by HLS effect (or native Safari). Keeping fallback is OK:
        src={hlsUrl}
        style={{ display: isAdPlaying ? 'none' : 'block' }}
      />

      {/* IMA ad container overlays on top */}
      <div
        ref={adContainerRef}
        className={`absolute inset-0 ${isAdPlaying ? 'block' : 'hidden'}`}
        style={{ zIndex: isAdPlaying ? 10 : -1, pointerEvents: isAdPlaying ? 'auto' : 'none' }}
      />

      {/* Lightweight overlay controls (visible when not playing) */}
      {!isAdPlaying && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayClick}
            className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Minimal controls row on hover (optional) */}
      {!isAdPlaying && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handlePlayClick} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <span className="text-white text-sm">{title}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Status bubbles */}
      {isAdPlaying && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
          Ad Playing...
        </div>
      )}
      {adLoadError && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm">
          {adLoadError} - Playing content
        </div>
      )}
    </div>
  );
};
