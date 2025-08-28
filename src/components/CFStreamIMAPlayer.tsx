import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CFStreamIMAPlayerProps {
  playbackId: string;
  channelSlug: string;
  contentId: string;
  durationSec?: number;
  adBreaks?: number[];           // kept for future mid-roll logic
  vastTagUrl?: string;           // your GAM VAST/VMAP tag
  title: string;

  // Optional callbacks (your VideoPlayer already passes these)
  onError?: (error: string) => void;
  onAdStart?: () => void;
  onAdComplete?: () => void;
  onContentStart?: () => void;
  onContentPause?: () => void;
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

  // Load Google IMA SDK once
  useEffect(() => {
    if (window.google?.ima) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize IMA objects when SDK & refs are ready
  useEffect(() => {
    if (!imaLoaded || !videoRef.current || !adContainerRef.current) return;

    try {
      const adc = new window.google.ima.AdDisplayContainer(
        adContainerRef.current,
        videoRef.current
      );
      setAdDisplayContainer(adc);

      const loader = new window.google.ima.AdsLoader(adc);
      setAdsLoader(loader);

      // If an ad error occurs, fall back to content
      loader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        (e: any) => {
          console.error('IMA Ad error:', e.getError?.() || e);
          setAdLoadError('Ad failed to load');
          setIsAdPlaying(false);
          startContentVideo();
        }
      );

      // When AdsManager is ready
      loader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (evt: any) => {
          try {
            const manager = evt.getAdsManager(videoRef.current);
            setAdsManager(manager);

            // Ad lifecycle
            manager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () => {
              // Ad creative loaded
            });

            manager.addEventListener(window.google.ima.AdEvent.Type.STARTED, () => {
              // Safety pause in case content started
              try { videoRef.current?.pause(); } catch {}
              setIsAdPlaying(true);
              onAdStart?.();
            });

            manager.addEventListener(
              window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
              () => {
                // IMA asks us to pause content before ad
                try { videoRef.current?.pause(); } catch {}
                if (adContainerRef.current) {
                  adContainerRef.current.style.display = 'block';
                  adContainerRef.current.style.pointerEvents = 'auto';
                }
                setIsAdPlaying(true);
              }
            );

            const resumeContent = () => {
              // Hide ad container and resume content
              try { manager?.destroy(); } catch {}
              if (adContainerRef.current) {
                adContainerRef.current.style.display = 'none';
                adContainerRef.current.style.pointerEvents = 'none';
              }
              setIsAdPlaying(false);
              onAdComplete?.();
              startContentVideo(); // begin movie
            };

            manager.addEventListener(
              window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
              resumeContent
            );
            manager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, resumeContent);
            manager.addEventListener(window.google.ima.AdEvent.Type.SKIPPED, resumeContent);
            manager.addEventListener(
              window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
              resumeContent
            );

            // Start ads
            const w = videoRef.current?.clientWidth || 1280;
            const h = videoRef.current?.clientHeight || 720;
            manager.init(w, h, window.google.ima.ViewMode.NORMAL);
            manager.start();
          } catch (err) {
            console.error('AdsManager init/start error:', err);
            setAdLoadError('Ad failed to start');
            startContentVideo();
          }
        }
      );
    } catch (err) {
      console.error('IMA init error:', err);
      setAdLoadError('Ad system initialization failed');
      onError?.('Ad system initialization failed');
    }
  }, [imaLoaded]);

  /** Begin/resume content playback (movie) safely */
  const startContentVideo = () => {
    const v = videoRef.current;
    if (!v) return;

    // Make sure the video element is visible again
    v.style.visibility = 'visible';

    v.play()
      .then(() => {
        setIsPlaying(true);
        onContentStart?.();
      })
      .catch(() => {
        // Try muted autoplay as a fallback
        v.muted = true;
        setIsMuted(true);
        v.play().then(() => {
          setIsPlaying(true);
          onContentStart?.();
        }).catch(console.error);
      });
  };

  /** Request ads and ensure content is paused/hidden while ad runs */
  const requestAds = (loader = adsLoader) => {
    const v = videoRef.current;
    if (!v) return;

    // Hard-stop content first so we never overlap with the ad
    try { v.pause(); } catch {}
    v.controls = false;
    v.style.visibility = 'hidden'; // hide movie underneath the ad

    if (!loader || !vastTagUrl || !adDisplayContainer) {
      // No ads → just play content
      startContentVideo();
      return;
    }

    try {
      try { adDisplayContainer.initialize(); } catch {}

      const req = new window.google.ima.AdsRequest();
      req.adTagUrl = vastTagUrl;

      const w = v.clientWidth || 1280;
      const h = v.clientHeight || 720;
      req.linearAdSlotWidth = w;
      req.linearAdSlotHeight = h;
      req.nonLinearAdSlotWidth = w;
      req.nonLinearAdSlotHeight = Math.round(h / 3);

      // Guard: if ads don’t arrive, resume content
      const guard = setTimeout(() => {
        console.warn('Ad load timeout; resuming content');
        setIsAdPlaying(false);
        startContentVideo();
      }, 3000);

      loader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        () => clearTimeout(guard),
        { once: true }
      );

      loader.requestAds(req);
    } catch (err) {
      console.error('Ad request error:', err);
      setAdLoadError('Failed to request ads');
      startContentVideo();
    }
  };

  /** Play/pause button logic with preroll on first play */
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
    startContentVideo();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !isMuted;
    v.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = async () => {
    const host = videoRef.current?.parentElement;
    if (!host) return;
    try {
      if (!document.fullscreenElement) {
        await host.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const hlsUrl = `https://videodelivery.net/${playbackId}/manifest/video.m3u8`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Content video (hidden while ad plays) */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={hlsUrl}
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => { setIsPlaying(false); onContentPause?.(); }}
        onEnded={() => setIsPlaying(false)}
        controls={isAdPlaying ? false : true}
        style={{ visibility: isAdPlaying ? 'hidden' : 'visible' }}
      />

      {/* IMA Ad container sits above the video */}
      <div
        ref={adContainerRef}
        className={`absolute inset-0 ${isAdPlaying ? 'block' : 'hidden'}`}
        style={{ zIndex: isAdPlaying ? 10 : -1 }}
      />

      {/* Simple overlay controls (hidden during ads) */}
      {!isAdPlaying && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
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

      {/* Ad state indicator */}
      {isAdPlaying && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
          Ad Playing…
        </div>
      )}

      {/* Error banner (we still resume content) */}
      {adLoadError && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm">
          {adLoadError} - Playing content
        </div>
      )}
    </div>
  );
};
