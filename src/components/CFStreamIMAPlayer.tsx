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
  // Add these new callback props
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
  adBreaks = [0], // Default preroll
  vastTagUrl,
  title,
  onError,
  onAdStart,
  onAdComplete,
  onContentStart,
  onContentPause
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
  const [contentStarted, setContentStarted] = useState(false);
  const [adsInitialized, setAdsInitialized] = useState(false);

  // Load Google IMA SDK
  useEffect(() => {
    if (window.google && window.google.ima) {
      setImaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    script.async = true;
    script.onload = () => {
      setImaLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google IMA SDK');
      setAdLoadError('Failed to load ad system');
      onError?.('Failed to load ad system');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onError]);

  // Initialize IMA
  useEffect(() => {
    if (!imaLoaded || !videoRef.current || !adContainerRef.current || !vastTagUrl || adsInitialized) return;

    try {
      console.log('Initializing IMA...');
      
      // Create ad display container
      const adDisplayContainer = new window.google.ima.AdDisplayContainer(
        adContainerRef.current,
        videoRef.current
      );
      setAdDisplayContainer(adDisplayContainer);

      // Create ads loader
      const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);
      setAdsLoader(adsLoader);

      // Listen for ads manager loaded event
      adsLoader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          console.log('AdsManager loaded');
          const adsManager = event.getAdsManager(videoRef.current);
          setAdsManager(adsManager);

          // Add event listeners
          adsManager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () => {
            console.log('Ad loaded');
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.STARTED, () => {
            console.log('Ad started');
            setIsAdPlaying(true);
            onAdStart?.();
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
            console.log('Content pause requested');
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setIsPlaying(false);
            setIsAdPlaying(true);
            onContentPause?.();
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
            console.log('Content resume requested');
            resumeContent();
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, () => {
            console.log('Ad complete');
            onAdComplete?.();
            resumeContent();
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.SKIPPED, () => {
            console.log('Ad skipped');
            onAdComplete?.();
            resumeContent();
          });

          adsManager.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            console.log('All ads completed');
            onAdComplete?.();
            resumeContent();
            // Clean up ads manager
            setTimeout(() => {
              try {
                adsManager?.destroy();
              } catch (e) {
                console.warn('Error destroying ads manager:', e);
              }
            }, 100);
          });

          try {
            adsManager.init(
              videoRef.current?.clientWidth || 640, 
              videoRef.current?.clientHeight || 480, 
              window.google.ima.ViewMode.NORMAL
            );
          } catch (adError) {
            console.error('AdsManager init error:', adError);
            setAdLoadError('Ad failed to initialize');
            startContentVideo(); // Fallback to content
          }
        }
      );

      // Listen for ad errors
      adsLoader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        (event: any) => {
          console.error('Ad error:', event.getError());
          setAdLoadError('Ad failed to load');
          setIsAdPlaying(false);
          startContentVideo(); // Fallback to content
        }
      );

      setAdsInitialized(true);

    } catch (error) {
      console.error('IMA initialization error:', error);
      setAdLoadError('Ad system initialization failed');
      onError?.('Ad system initialization failed');
      startContentVideo();
    }
  }, [imaLoaded, vastTagUrl, onError, adsInitialized, onAdStart, onAdComplete, onContentPause]);

  const startContentVideo = () => {
    console.log('Starting content video');
    if (videoRef.current) {
      setContentStarted(true);
      setIsAdPlaying(false);
      
      // Ensure video is visible
      videoRef.current.style.display = 'block';
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            onContentStart?.();
          })
          .catch((error) => {
            console.warn('Autoplay failed, trying muted:', error);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  onContentStart?.();
                })
                .catch(console.error);
            }
          });
      }
    }
  };

  const resumeContent = () => {
    console.log('Resuming content');
    
    // Hide ad container
    if (adContainerRef.current) {
      adContainerRef.current.style.display = 'none';
      adContainerRef.current.style.pointerEvents = 'none';
    }
    
    setIsAdPlaying(false);
    
    // Show and play video content
    if (videoRef.current) {
      // Ensure video is visible
      videoRef.current.style.display = 'block';
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                onContentStart?.();
              })
              .catch((error) => {
                console.warn('Content resume failed, trying muted:', error);
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  videoRef.current.play()
                    .then(() => {
                      setIsPlaying(true);
                      onContentStart?.();
                    })
                    .catch(console.error);
                }
              });
        }
      }, 100);
    }
  };

  const requestAds = () => {
    console.log('Requesting ads...');
    if (!adsLoader || !vastTagUrl || !adDisplayContainer) {
      console.log('Missing ad requirements, starting content');
      startContentVideo();
      return;
    }

    try {
      adDisplayContainer.initialize();

      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl = vastTagUrl;
      adsRequest.linearAdSlotWidth = videoRef.current?.clientWidth || 640;
      adsRequest.linearAdSlotHeight = videoRef.current?.clientHeight || 480;
      adsRequest.nonLinearAdSlotWidth = videoRef.current?.clientWidth || 640;
      adsRequest.nonLinearAdSlotHeight = 150;

      adsLoader.requestAds(adsRequest);
      
      // Start ads manager if available
      if (adsManager) {
        setTimeout(() => {
          try {
            adsManager.start();
          } catch (error) {
            console.error('Failed to start ads manager:', error);
            startContentVideo();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Ad request error:', error);
      setAdLoadError('Failed to request ads');
      startContentVideo();
    }
  };

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (isAdPlaying) {
      // Don't interfere with ads
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (vastTagUrl && !contentStarted && videoRef.current.currentTime === 0) {
        // First play - show ads
        console.log('First play, requesting ads');
        requestAds();
      } else {
        // Resume content
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onContentStart?.();
            })
            .catch(console.error);
        }
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
        src={`https://videodelivery.net/${playbackId}/manifest/video.m3u8`}
        muted={isMuted}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedData={() => console.log('Video loaded')}
        onCanPlay={() => console.log('Video can play')}
        controls={false} // Always use custom controls
        style={{ 
          display: 'block', // Always show video element
          visibility: isAdPlaying ? 'hidden' : 'visible' // Use visibility instead of display
        }}
      />

      {/* Ad Container */}
      <div
        ref={adContainerRef}
        className="absolute inset-0"
        style={{ 
          display: isAdPlaying ? 'block' : 'none',
          zIndex: isAdPlaying ? 10 : -1,
          pointerEvents: isAdPlaying ? 'auto' : 'none'
        }}
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

      {/* Ad Loading/Playing Indicator */}
      {isAdPlaying && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Ad Playing...
        </div>
      )}

      {/* Error Message */}
      {adLoadError && !isAdPlaying && (
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded text-sm">
          {adLoadError} - Playing content
        </div>
      )}

      {/* Initial Play Button */}
      {!isPlaying && !isAdPlaying && !contentStarted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="ghost"
            onClick={handlePlayClick}
            className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
