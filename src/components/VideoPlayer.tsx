import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipBack, SkipForward, Settings, Minimize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPlayerProps {
  videoUrl?: string;
  coverUrl?: string;
  trailerUrl?: string;
  title: string;
  description?: string;
  genre?: string;
  contentType: string;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  coverUrl,
  trailerUrl,
  title,
  description,
  genre,
  contentType,
  onDelete,
  canDelete = false,
}) => {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (showFullPlayer) {
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            setShowControls(false);
          }
        }, 3000);
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [showFullPlayer, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
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
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
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
    if (videoRef.current && !isNaN(videoRef.current.currentTime)) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Calculate buffered percentage
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        const duration = videoRef.current.duration;
        if (!isNaN(duration) && duration > 0) {
          setBuffered((bufferedEnd / duration) * 100);
        }
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
      setCurrentTime(0);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playVideo = (type: 'main' | 'trailer') => {
    setCurrentVideo(type);
    setShowFullPlayer(true);
    setShowControls(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentVideoUrl = currentVideo === 'trailer' ? trailerUrl : videoUrl;

  return (
    <Card className="cinema-card overflow-hidden">
      {/* Cover/Thumbnail */}
      <div className="relative">
        <div className="aspect-video bg-secondary/20 rounded-t-lg relative overflow-hidden group cursor-pointer">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={`${title} cover`}
              className="w-full h-full object-cover"
            />
          ) : videoUrl ? (
            <video
              className="w-full h-full object-cover"
              src={videoUrl}
              muted
              preload="metadata"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Play className="h-12 w-12 text-primary" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              {videoUrl && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                  onClick={() => playVideo('main')}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play {contentType}
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
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{contentType}</Badge>
          {genre && <Badge variant="outline">{genre}</Badge>}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {description}
          </p>
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

      {/* Full Screen Video Player */}
      <Dialog open={showFullPlayer} onOpenChange={setShowFullPlayer}>
        <DialogContent className="max-w-full w-screen h-screen p-0 bg-black border-none video-player-dialog">
          <VisuallyHidden>
            <DialogTitle>Video Player - {title}</DialogTitle>
            <DialogDescription>
              Playing {contentType}: {title}. {description}
            </DialogDescription>
          </VisuallyHidden>
          <div 
            ref={playerRef}
            className={`relative w-full h-full bg-black ${isFullscreen ? 'video-player-fullscreen' : ''}`}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              src={currentVideoUrl}
              autoPlay
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onClick={togglePlay}
              playsInline
              preload="metadata"
              controls={false}
              style={{ objectFit: 'contain' }}
            />
            
            {/* Custom Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setShowControls(true)}
            >
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullPlayer(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <h2 className="text-white text-lg font-semibold">
                    {title} {currentVideo === 'trailer' && '(Trailer)'}
                  </h2>
                </div>
                
                {/* Switch Video Buttons */}
                {videoUrl && trailerUrl && (
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

              {/* Center Play Button */}
              {!isPlaying && (
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

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-2 video-controls-mobile md:video-controls-desktop">
                {/* Progress Bar */}
                <div className="relative">
                  {/* Buffered Progress */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-white/40 rounded-full transition-all duration-300"
                      style={{ width: `${buffered}%` }}
                    />
                  </div>
                  
                  {/* Playback Progress */}
                  <Slider
                    value={[currentTime || 0]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full cursor-pointer video-slider"
                    disabled={!duration || isNaN(duration)}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    {/* Skip Backward */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skipTime(-10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    {/* Skip Forward */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skipTime(10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
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

                    {/* Time Display */}
                    <span className="text-white text-sm font-mono whitespace-nowrap">
                      {formatTime(currentTime || 0)} / {formatTime(duration || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Settings Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>

                    {/* Fullscreen Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Video Description */}
                {description && (
                  <div className="pt-2">
                    <p className="text-white/80 text-sm max-w-2xl">{description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};