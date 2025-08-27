import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const playVideo = (type: 'main' | 'trailer') => {
    setCurrentVideo(type);
    setShowFullPlayer(true);
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
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[80vh]"
              src={currentVideoUrl}
              controls
              autoPlay
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-white text-xl font-bold mb-1">
                {title} {currentVideo === 'trailer' && '(Trailer)'}
              </h2>
              {description && (
                <p className="text-white/80 text-sm">{description}</p>
              )}
            </div>

            {/* Switch Video Buttons */}
            {videoUrl && trailerUrl && (
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant={currentVideo === 'main' ? 'default' : 'secondary'}
                  onClick={() => setCurrentVideo('main')}
                  className="bg-black/50 backdrop-blur-sm"
                >
                  Full {contentType}
                </Button>
                <Button
                  size="sm"
                  variant={currentVideo === 'trailer' ? 'default' : 'secondary'}
                  onClick={() => setCurrentVideo('trailer')}
                  className="bg-black/50 backdrop-blur-sm"
                >
                  Trailer
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};