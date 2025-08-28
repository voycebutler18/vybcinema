import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

// Optional callbacks so the parent can reflect state (you already pass these)
export interface CFStreamIMAPlayerProps {
  playbackId: string;
  channelSlug: string;
  contentId: string;
  durationSec?: number;
  adBreaks?: number[];        // Not used by IMA directly unless you use VMAP, but we keep it for future
  vastTagUrl?: string;        // Your GAM / VAST (or VMAP) tag
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
  }
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
  const hlsRef = useRef<any>(null);
  const adStartWatchdogRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adMessage, setAdMessage] = useState<string | null>(null);

  // 1) Attach Cloudflare HLS to <video> (use hls.js for Chrome/Edge/Firefox)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://videodelivery.net/${playbackId}/manifest/video.m3u8`;

    const attach = async () => {
      // Safari (and some mobile browsers) support HLS natively
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        return;
      }
      try {
        const { default: Hls } = await import('hls.js');
        if (Hls.isSupported()) {
          hlsRef.current = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current.loadSource(hlsUrl);
          hlsRef.current.attachMedia(video);
        } else {
          // Fallback to Cloudflare MP4 (only works if downloads enabled in Stream)
          video.src = `https://videodelivery.net/${playbackId}/downloads/default.mp4`;
        }
      } catch (e) {
        // As a last resort, set the MP4
        video.src = `https://videodelivery.net/${playbackId}/downloads/default.mp4`;
      }
    };

    attach();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [playbackId]);

  // 2) Load IMA SDK once
  const [imaReady, setImaReady] = useState(false);
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

  // 3) Setup IMA objects when ready
  useEffect(() => {
    if (!imaReady || !videoRef.current || !adContainerRef.current) return;

    try {
      adDisplayContainerRef.current = new window.google!.ima.AdDisplayContainer(
        adContainerRef.current,
        videoRef.current
      );
      adsLoaderRef.current = new window.google!.ima.AdsLoader(adDisplayContainerRef.current);

      // Ad manager ready
      adsLoaderRef.current.addEventListener(
        window.google!.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          try {
            adsManagerRef.current = event.getAdsManager(videoRef.current);

            // Ad events
            const AdEvent = window.google!.ima.AdEvent.Type;

            adsManagerRef.current.addEventListener(AdEvent.LOADED, () => {
              // Ad has loaded
            });

            adsManagerRef.current.addEventListener(AdEvent.STARTED, () => {
              setIsAdPlaying(true);
              setAdMessage(null);
              onAdStart?.();
              // Ad started -> cancel watchdog
              if (adStartWatchdogRef.current) {
                window.clearTimeout(adStartWatchdogRef.current);
                adStartWatchdogRef.current = null;
              }
            });

            adsManagerRef.current.addEventListener(AdEvent.COMPLETE, () => {
              // Pre/mid/post finished
              finishAdAndResume();
            });

            adsManagerRef.current.addEventListener(AdEvent.SKIPPED, () => {
              finishAdAndResume();
            });

            adsManagerRef.current.addEventListener(AdEvent.CONTENT_PAUSE_REQUESTED, () => {
              try {
                videoRef.current?.pause();
              } catch {}
              setIsPlaying(false);
            });

            adsManagerRef.current.addEventListener(AdEvent.CONTENT_RESUME_REQUESTED, () => {
              finishAdAndResume();
            });

            // Start ads
            try {
              adsManagerRef.current.init(640, 360, window.google!.ima.ViewMode.NORMAL);
              adsManagerRef.current.start();
            } catch (err) {
              // Could not start ads -> play content
              fallbackToContent('Ad start error');
            }
          } catch (err) {
            fallbackToContent('AdsManager init error');
          }
        }
      );

      // Ad errors
      adsLoaderRef.current.addEventListener(
        window.google!.ima.AdErrorEvent.Type.AD_ERROR,
        (e: any) => {
          fallbackToContent('Ad failed to load');
        }
      );
    } catch (e) {
      fallbackToContent('IMA init error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imaReady]);

  // Helpers
  const finishAdAndResume = () => {
    setIsAdPlaying(false);
    setAdMessage(null);
    try {
      adsManagerRef.current?.destroy();
    } catch {}
    hideAdLayer();
    startContent(true);
    onAdComplete?.();
  };

  const showAdLayer = () => {
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'block';
      adContainerRef.current.style.pointerEvents = 'auto';
    }
  };
  const hideAdLayer = () => {
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'none';
      adContainerRef.current.style.pointerEvents = 'none';
    }
  };

  const fallbackToContent = (reason: string) => {
    setAdMessage(`${reason} - Playing content`);
    onError?.(reason);
    setIsAdPlaying(false);
    hideAdLayer();
    try {
      adsManagerRef.current?.destroy();
    } catch {}
    startContent(true);
  };

  const startContent = (withAutoplay: boolean) => {
    const video = videoRef.current;
    if (!video) return;

    const playNow = () => {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          onContentStart?.();
        })
        .catch(() => {
          // Try muted autoplay if the browser blocks it
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              onContentStart?.();
            })
            .catch(err => {
              onError?.('Content play blocked');
              setIsPlaying(false);
            });
        });
    };

    if (withAutoplay) {
      playNow();
    } else {
      // do nothing; will play on user click
    }
  };

  // 4) Request ads on first user play
  const requestAds = () => {
    if (!window.google?.ima || !adsLoaderRef.current || !adDisplayContainerRef.current || !vastTagUrl) {
      // No ads available -> play content
      startContent(true);
      return;
    }

    try {
      // Must be called in a user gesture context
      adDisplayContainerRef.current.initialize();

      // Build request
      const req = new window.google.ima.AdsRequest();
      req.adTagUrl = vastTagUrl;

      // Player size for linear and non-linear inventory
      req.linearAdSlotWidth = videoRef.current?.clientWidth || 640;
      req.linearAdSlotHeight = videoRef.current?.clientHeight || 360;
      req.nonLinearAdSlotWidth = videoRef.current?.clientWidth || 640;
      req.nonLinearAdSlotHeight = 150;

      // Ask for ads
      showAdLayer();
      adsLoaderRef.current.requestAds(req);

      // Watchdog: if no STARTED within 4s, go to content
      if (adStartWatchdogRef.current) window.clearTimeout(adStartWatchdogRef.current);
      adStartWatchdogRef.current = window.setTimeout(() => {
        if (!isAdPlaying) {
          fallbackToContent('Ad timeout');
        }
      }, 4000);
    } catch (e) {
      fallbackToContent('Ad request error');
    }
  };

  // UI handlers
  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      onContentPause?.();
      return;
    }

    // First play: try ads (if a tag exists); otherwise play content
    if (!isAdPlaying && video.currentTime === 0 && vastTagUrl) {
      requestAds();
    } else {
      startContent(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = async () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Content video always present (ads overlay sits on top) */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        controls={!isAdPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
          onContentPause?.();
        }}
        onEnded={() => setIsPlaying(false)}
        // src set in effect
      />

      {/* IMA Ad container overlay (same rectangle as the video) */}
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

      {/* Small status pill for ad fallback messages */}
      {adMessage && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm z-20">
          {adMessage}
        </div>
      )}
    </div>
  );
};
