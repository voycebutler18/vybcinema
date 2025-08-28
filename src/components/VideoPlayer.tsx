import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipBack, SkipForward, Settings, Minimize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CFStreamIMAPlayer } from './CFStreamIMAPlayer';

interface VideoPlayerProps {
  // media
  videoUrl?: string;
  coverUrl?: string;
  trailerUrl?: string;

  // metadata
  title: string;
  description?: string;
  genre?: string;
  contentType: string;

  // actions
  onDelete?: () => void;
  canDelete?: boolean;

  // Cloudflare Stream
  streamUrl?: string;
  streamStatus?: string;
  streamId?: string;
  streamThumbnailUrl?: string;
  playbackId?: string;

  // Ads (optional)
  vastTagUrl?: string;
  adBreaks?: number[];
  durationSeconds?: number;
  monetizationEnabled?: boolean;
  contentId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  // media
  videoUrl,
  coverUrl,
  trailerUrl,

  // metadata
  title,
  description,
  genre,
  contentType,

  // actions
  onDelete,
  canDelete = false,

  // cloudflare
  streamUrl,
  streamStatus,
  streamId,
  streamThumbnailUrl,
  playbackId,

  // ads (optional)
  vastTagUrl,
  adBreaks = [0],
  durationSeconds,
  monetizationEnabled = true,
  contentId,
}) => {
  // UI / playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<'main' | 'trailer'>('main');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // ad flags (kept but optional)
  const [adPlaying, setAdPlaying] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);
  const [showFallbackPlayer, setShowFallbackPlayer] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // ---------- DERIVED VALUES ----------

  // When Cloudflare has a playbackId, we can ALWAYS render a public poster:
  // https://videodelivery.net/{playbackId}/thumbnails/thumbnail.jpg?time=1s&height=360
  const posterUrl =
    (playbackId
      ? `https://videodelivery.net/${playbackId}/thumbnails/thumbnail.jpg?time=1s&height=360`
      : null) ||
    streamThumbnailUrl ||
    coverUrl ||
    undefined;

  const hasStreamPlayback = streamStatus === 'ready' && !!playbackId;
  const isProcessing = streamStatus === 'pending' || (streamStatus === 'processing' && !playbackId);

  // Use IMA only if all inputs exist AND you want monetization
  const shouldUseAds =
    !!monetizationEnabled &&
    !!vastTagUrl &&
    !!hasStreamPlayback &&
    !showFallbackPlayer;

  // ---------- EFFECTS ----------

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!showFullPlayer) return;
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying && !adPlaying) setShowControls(false);
      }, 3000);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showFullPlayer, isPlaying, adPlaying]);

  // ---------- PLAYER HANDLERS ----------

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Autoplay safety
        videoRef.current!.muted = true;
        setIsMuted(true);
        videoRef.current!.play().catch(() => undefined);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleVolumeChange = (value: number[]) => {
    const nextVol = value[0];
    setVolume(nextVol);
    if (videoRef.current) {
      videoRef.current.volume = nextVol;
      setIsMuted(nextVol === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current && !isNaN(newTime) && isFinite(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || isNaN(videoRef.current.currentTime)) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const d = videoRef.current.duration;
      if (!isNaN(d) && d > 0) setBuffered((bufferedEnd / d) * 100);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current || isNaN(videoRef.current.duration)) return;
    setDuration(videoRef.current.duration);
    setCurrentTime(0);
    setIsVideoLoaded(true);
    setVideoError(null);
  };

  const handleVideoLoadedData = () => {
    setIsVideoLoaded(true);
    setVideoError(null);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = e.currentTarget.error;
    let errorMessage = 'Video playback failed';
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error occurred while loading video';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage =
            'Codec not supported. Use MP4 (H.264 yuv420p 8-bit) + AAC. Also set the "faststart" flag.';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage =
            'Source not supported. Use MP4 with H.264 video and AAC audio codecs.';
          break;
        default:
          errorMessage = 'Unknown video error occurred';
      }
    }
    setVideoError(errorMessage);
    setIsVideoLoaded(false);
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playVideo = (type: 'main' | 'trailer') => {
    setCurrentVideo(type);
    setShowFullPlayer(true);
    setShowControls(true);
    setAdPlaying(false);
    setAdCompleted(false);
    setShowFallbackPlayer(false);
  };

  const formatTime = (t: number) => {
    if (isNaN(t) || !isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ---------- ADS HOOKS (no-ops if you don't pass vastTagUrl) ----------
  const handleAdStart = () => {
    setAdPlaying(true);
    setShowControls(false);
  };
  const handleAdComplete = () => {
    setAdPlaying(false);
    setAdCompleted(true);
    setShowControls(true);
  };
  const handleAdError = () => {
    setAdPlaying(false);
    setShowFallbackPlayer(true);
  };
  const handleContentStart = () => {
    setIsPlaying(true);
    setAdPlaying(false);
  };
  const handleContentPause = () => setIsPlaying(false);

  // ---------- RENDER ----------

  return (
    <Card className="cinema-card overflow-hidden">
      {/* Cover / Thumbnail */}
      <div className="relative">
        <div className="aspect-video bg-secondary/20 rounded-t-lg relative overflow-hidden group cursor-pointer">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (hasStreamPlayback || videoUrl) ? (
            <video
              className="w-full h-full object-cover"
              src={hasStreamPlayback ? `https://videodelivery.net/${playbackId}/manifest/video.m3u8` : videoUrl}
              muted
              preload="metadata"
              poster={posterUrl}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Play className="h-12 w-12 text-primary" />
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
              <p className="text-white text-sm">Processing video...</p>
              <p className="text-white/60 text-xs">This may take a few minutes</p>
            </div>
          )}

          {/* Hover overlay with Play buttons */}
          {!isProcessing && (
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                {(hasStreamPlayback || videoUrl) && (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white/10 backdrop-blur-sm border-white/20"
                    onClick={() => playVideo('main')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play {contentType}
                    {shouldUseAds && <span className="ml-1 text-xs">(Ad)</span>}
                  </Button>
                )}
                {trailerUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20"
                    onClick={() => playVideo('trailer')}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Trailer
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{contentType}</Badge>
          {genre && <Badge variant="outline">{genre}</Badge>}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>

        {description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
        )}

        {canDelete && (
          <div className="flex justify-end">
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <X className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>

      {/* Full Screen Dialog Player */}
      <Dialog open={showFullPlayer} onOpenChange={setShowFullPlayer}>
        <DialogContent className="max-w-full w-screen h-screen p-0 bg-black border-none video-player-dialog">
          <VisuallyHidden>
            <DialogTitle>Video Player - {title}</DialogTitle>
            <DialogDescription>
              Playing {contentType}: {title}. {description}
            </DialogDescription>
          </VisuallyHidden>

          <div ref={playerRef} className={`relative w-full h-full bg-black ${isFullscreen ? 'video-player-fullscreen' : ''}`}>
            {/* 1) IMA ads (optional) */}
            {shouldUseAds && currentVideo === 'main' ? (
              <CFStreamIMAPlayer
                playbackId={playbackId!}
                channelSlug={contentType.toLowerCase().replace(' ', '-')}
                contentId={contentId || 'unknown'}
                durationSec={durationSeconds}
                adBreaks={adBreaks}
                vastTagUrl={vastTagUrl}
                title={title}
                onError={handleAdError}
                onAdStart={handleAdStart}
                onAdComplete={handleAdComplete}
                onContentStart={handleContentStart}
                onContentPause={handleContentPause}
              />
            ) : /* 2) Cloudflare Stream iframe */ hasStreamPlayback && currentVideo === 'main' ? (
              <iframe
                src={`https://iframe.cloudflarestream.com/${playbackId}?controls=true&autoplay=false`}
                className="w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                style={{ backgroundColor: 'black' }}
            />
            ) : (
              /* 3) Regular <video> for uploads/url + trailer */
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                autoPlay
                poster={posterUrl}
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onLoadedData={handleVideoLoadedData}
                onError={handleVideoError}
                onClick={togglePlay}
                playsInline
                preload="metadata"
                controls={false}
                muted={isMuted}
                crossOrigin="anonymous"
                style={{ objectFit: 'contain', width: '100%', height: '100%', backgroundColor: 'black' }}
              >
                <source src={currentVideo === 'trailer' ? trailerUrl : videoUrl} type="video/mp4" />
                <p className="text-white text-center p-4">
                  Your browser does not support the video tag. Please try a different browser or update your current browser.
                </p>
              </video>
            )}

            {/* Ad indicator */}
            {adPlaying && (
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                <span className="text-white text-sm">Ad Playing...</span>
              </div>
            )}

            {/* Error overlay */}
            {videoError && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md">
                  <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">Video Playback Error</h3>
                  <p className="text-white/80 text-sm mb-4">{videoError}</p>
                  <div className="text-white/60 text-xs">
                    <p className="mb-2">For best compatibility, videos should be:</p>
                    <ul className="text-left space-y-1">
                      <li>• MP4 container</li>
                      <li>• H.264 (yuv420p, 8-bit) video</li>
                      <li>• AAC audio</li>
                      <li>• “faststart” flag enabled</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Custom controls (hidden for CF iframe + when ad is playing) */}
            {!(hasStreamPlayback && currentVideo === 'main') && !adPlaying && (
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onMouseEnter={() => setShowControls(true)}
              >
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setShowFullPlayer(false)} className="text-white hover:bg-white/20">
                      <X className="h-5 w-5" />
                    </Button>
                    <h2 className="text-white text-lg font-semibold">
                      {title} {currentVideo === 'trailer' && '(Trailer)'}
                    </h2>
                  </div>

                  {(hasStreamPlayback || videoUrl) && trailerUrl && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={currentVideo === 'main' ? 'default' : 'secondary'}
                        onClick={() => setCurrentVideo('main')}
                        className="bg-black/50 backdrop-blur-sm text-white border-white/20"
                      >
                        Full {contentType}
                      </Button>
                      <Button
                        size="sm"
                        variant={currentVideo === 'trailer' ? 'default' : 'secondary'}
                        onClick={() => setCurrentVideo('trailer')}
                        className="bg-black/50 backdrop-blur-sm text-white border-white/20"
                      >
                        Trailer
                      </Button>
                    </div>
                  )}
                </div>

                {/* Big play in center */}
                {!isPlaying && !adPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  </div>
                )}

                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-2 video-controls-mobile md:video-controls-desktop">
                  {/* Progress */}
                  <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-white/20 rounded-full">
                      <div className="h-full bg-white/40 rounded-full transition-all duration-300" style={{ width: `${buffered}%` }} />
                    </div>
                    <Slider
                      value={[currentTime || 0]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="w-full cursor-pointer video-slider"
                      disabled={!duration || isNaN(duration)}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => skipTime(-10)} className="text-white hover:bg-white/20">
                        <SkipBack className="h-5 w-5" />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => skipTime(10)} className="text-white hover:bg-white/20">
                        <SkipForward className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <div className="w-20 hidden md:block">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="cursor-pointer volume-slider"
                          />
                        </div>
                      </div>

                      <span className="text-white text-sm font-mono whitespace-nowrap">
                        {formatTime(currentTime || 0)} / {formatTime(duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Settings className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {description && (
                    <div className="pt-2">
                      <p className="text-white/80 text-sm max-w-2xl">{description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
