import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export interface CFStreamIMAPlayerProps {
  playbackId: string;
  channelSlug: string;
  contentId: string;
  durationSec?: number;
  adBreaks?: number[];        // kept for future VMAP/mid-roll logic
  vastTagUrl?: string;        // your GAM VAST/VMAP tag
  title: string;

  onError?: (error: string) => void;
  onAdStart?: () => void;
  onAdComplete?: () => void;
  onContentStart?: () => void;
  onContentPause?: () => void;
}

declare global {
  interface Window {
    google?: {
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

function loadHlsFromCdn(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js';
    s.async = true;
    s.onload = () => resolve((window as any).Hls);
    s.onerror = () => reject(new Error('Failed to load Hls.js'));
    document.head.appendChild(s);
  });
}

export const CFStreamIMAPlayer: React.FC<CFStreamIMAPlayerProps> = ({
  playbackId,
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

  const adsLoaderRef = useRef<any>(null);
  const adsManagerRef = useRef<any>(null);
  const adDisplayContainerRef = useRef<any>(null);
  const hlsInstanceRef = useRef<any>(null);
  const adStartWatchdogRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adMessage, setAdMessage] = useState<string | null>(null);
  const [imaReady, setImaReady] = useState(false);

  /* ---------------- 1) Attach Cloudflare HLS to <video> ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://videodelivery.net/${playbackId}/manifest/video.m3u8`;

    const attach = async () => {
      // Safari can play HLS natively
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        return;
      }
      try {
        const Hls = await loadHlsFromCdn();
        if (Hls?.isSupported()) {
          hlsInstanceRef.current = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstanceRef.current.loadSource(hlsUrl);
          hlsInstanceRef.current.attachMedia(video);
        } else {
          // Fallback MP4 (only if downloads are enabled on Stream)
          video.src = `https://videodelivery.net/${playbackId}/downloads/default.mp4`;
        }
      } catch {
        // Last resort MP4
        video.src = `https://videodelivery.net/${playbackId}/downloads/default.mp4`;
      }
    };

    attach();

    return () => {
      try { hlsInstanceRef.current?.destroy?.(); } catch {}
      hlsInstanceRef.current = null;
    };
  }, [playbackId]);

  /* ---------------- 2) Load IMA SDK once ---------------- */
  useEffect(() => {
    if (window.google?.ima) {
      setImaReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    script.async = true;
    script.onload = () => setImaReady(true);
    script.onerror = () => {
      setImaReady(false);
      onError?.('Failed to load Google IMA SDK');
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onError]);

  /* ---------------- 3) Setup IMA objects when ready ---------------- */
  useEffect(() => {
    if (!imaReady || !videoRef.current || !adContainerRef.current) return;

    try {
      adDisplayContainerRef.current = new window.google!.ima.AdDisplayContainer(
        adContainerRef.current,
        videoRef.current
      );
      adsLoaderRef.current = new window.google!.ima.AdsLoader(adDisplayContainerRef.current);

      // Ad manager loaded
      adsLoaderRef.current.addEventListener(
        window.google!.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          try {
            const manager = event.getAdsManager(videoRef.current);
            adsManagerRef.current = manager;

            const AdEvent = window.google!.ima.AdEvent.Type;

            manager.addEventListener(AdEvent.LOADED, () => {});

            manager.addEventListener(AdEvent.STARTED, () => {
              // Ad started → cancel watchdog
              if (adStartWatchdogRef.current) {
                window.clearTimeout(adStartWatchdogRef.current);
                adStartWatchdogRef.current = null;
              }
              setIsAdPlaying(true);
              setAdMessage(null);
              onAdStart?.();
            });

            manager.addEventListener(AdEvent.CONTENT_PAUSE_REQUESTED, () => {
              try { videoRef.current?.pause(); } catch {}
              setIsPlaying(false);
              showAdLayer();
            });

            const resumeContent = () => {
              setIsAdPlaying(false);
              setAdMessage(null);
              try { manager?.destroy(); } catch {}
              hideAdLayer();
              startContent(true);
              onAdComplete?.();
            };

            manager.addEventListener(AdEvent.CONTENT_RESUME_REQUESTED, resumeContent);
            manager.addEventListener(AdEvent.COMPLETE, resumeContent);
            manager.addEventListener(AdEvent.SKIPPED, resumeContent);
            manager.addEventListener(AdEvent.ALL_ADS_COMPLETED, resumeContent);

            try {
              const w = videoRef.current?.clientWidth || 1280;
              const h = videoRef.current?.clientHeight || 720;
              manager.init(w, h, window.google!.ima.ViewMode.NORMAL);
              manager.start();
            } catch {
              fallbackToContent('Ad start error');
            }
          } catch {
            fallbackToContent('AdsManager init error');
          }
        }
      );

      // Ad errors
      adsLoaderRef.current.addEventListener(
        window.google!.ima.AdErrorEvent.Type.AD_ERROR,
        () => {
          fallbackToContent('Ad failed to load');
        }
      );
    } catch {
      fallbackToContent('IMA init error');
    }
  }, [imaReady]);

  /* ---------------- Helpers ---------------- */
  const showAdLayer = () => {
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'block';
      adContainerRef.current.style.pointerEvents = 'auto';
    }
    if (videoRef.current) {
      videoRef.current.style.visibility = 'hidden'; // hide movie during ad
      videoRef.current.controls = false;
    }
  };

  const hideAdLayer = () => {
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'none';
      adContainerRef.current.style.pointerEvents = 'none';
    }
    if (videoRef.current) {
      videoRef.current.style.visibility = 'visible';
      videoRef.current.controls = true;
    }
  };

  const fallbackToContent = (reason: string) => {
    setAdMessage(`${reason} - Playing content`);
    setIsAdPlaying(false);
    hideAdLayer();
    try { adsManagerRef.current?.destroy(); } catch {}
    startContent(true);
    onError?.(reason);
  };

  const startContent = (autoplay: boolean) => {
    const v = videoRef.current;
    if (!v) return;

    const playNow = () => {
      v.play()
        .then(() => {
          setIsPlaying(true);
          onContentStart?.();
        })
        .catch(() => {
          v.muted = true;
          setIsMuted(true);
          v.play()
            .then(() => {
              setIsPlaying(true);
              onContentStart?.();
            })
            .catch(() => {
              setIsPlaying(false);
              onError?.('Content play blocked');
            });
        });
    };

    if (autoplay) playNow();
  };

  const requestAds = () => {
    const v = videoRef.current;
    if (!v) return;

    // Stop content before ad
    try { v.pause(); } catch {}
    v.controls = false;
    v.style.visibility = 'hidden';

    if (!window.google?.ima || !adsLoaderRef.current || !adDisplayContainerRef.current || !vastTagUrl) {
      // No ads → just play
      startContent(true);
      return;
    }

    try {
      adDisplayContainerRef.current.initialize();

      const req = new window.google.ima.AdsRequest();
      req.adTagUrl = vastTagUrl;

      const w = v.clientWidth || 1280;
      const h = v.clientHeight || 720;
      req.linearAdSlotWidth = w;
      req.linearAdSlotHeight = h;
      req.nonLinearAdSlotWidth = w;
      req.nonLinearAdSlotHeight = Math.round(h / 3);

      showAdLayer();
      adsLoaderRef.current.requestAds(req);

      // Watchdog: if ad doesn't start soon, resume content
      if (adStartWatchdogRef.current) window.clearTimeout(adStartWatchdogRef.current);
      adStartWatchdogRef.current = window.setTimeout(() => {
        if (!isAdPlaying) fallbackToContent('Ad timeout');
      }, 4000);
    } catch {
      fallbackToContent('Ad request error');
    }
  };

  /* ---------------- UI handlers ---------------- */
  const handlePlayClick = () => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      onContentPause?.();
      return;
    }

    // First play with ad tag → preroll
    if (vastTagUrl && v.currentTime === 0 && !isAdPlaying) {
      requestAds();
      return;
    }

    // Otherwise resume content
    startContent(true);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = async () => {
    const host = videoRef.current?.parentElement;
    if (!host) return;
    try {
      if (!document.fullscreenElement) await host.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Content video (hidden during ad) */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        controls={!isAdPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => { setIsPlaying(false); onContentPause?.(); }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* IMA Ad container overlay */}
      <div
        ref={adContainerRef}
        className="absolute inset-0"
        style={{ display: 'none', zIndex: 10 }}
      />

      {/* Minimal overlay controls (hidden during ads) */}
      {!isAdPlaying && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
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
        </div>
      )}

      {/* Status pill for ad fallback messages */}
      {adMessage && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm z-20">
          {adMessage}
        </div>
      )}
    </div>
  );
};
