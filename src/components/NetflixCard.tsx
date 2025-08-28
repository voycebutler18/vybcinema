import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';

interface NetflixCardProps {
  content: any;
  contentType: string;
  index: number;
  onClick: () => void;
  onPlay: () => void;
}

export const ContentCard: React.FC<NetflixCardProps> = ({
  content,
  contentType,
  index,
  onClick,
  onPlay
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`flex-shrink-0 w-64 cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-110 z-20' : 'scale-100 z-10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        transformOrigin: index === 0 ? 'left center' : 'center',
        marginRight: isHovered ? '2rem' : '0'
      }}
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary/20 border border-border/50">
        {/* Main Image/Video */}
        <div className="aspect-video relative">
          {content.playback_id ? (
            <img
              src={`https://videodelivery.net/${content.playback_id}/thumbnails/thumbnail.jpg?time=1s&height=360`}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : content.cover_url ? (
            <img
              src={content.cover_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : content.file_url ? (
            <video
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              controls={false}
              poster=""
              onLoadedMetadata={() => setImageLoaded(true)}
              onError={() => {
                console.warn(`Video failed to load: ${content.file_url}`);
                setImageLoaded(true); // Show fallback
              }}
              onMouseEnter={(e) => {
                try {
                  e.currentTarget.currentTime = 1; // Show frame at 1 second
                  e.currentTarget.play().catch(() => {
                    // Ignore autoplay errors
                  });
                } catch (err) {
                  console.warn('Video hover play failed:', err);
                }
              }}
              onMouseLeave={(e) => {
                try {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 1; // Reset to frame at 1 second
                } catch (err) {
                  console.warn('Video hover pause failed:', err);
                }
              }}
              style={{ 
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            >
              <source src={content.file_url} type="video/mp4" />
              <source src={content.file_url} type="video/webm" />
              <source src={content.file_url} type="video/ogg" />
              {/* Fallback content */}
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <Play className="h-8 w-8 text-white/70" />
              </div>
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded"></div>
            </div>
          )}

          {/* Hover overlay with trailer */}
          {isHovered && content.trailer_url && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={content.trailer_url} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Expanded Info Panel (appears on hover) */}
        {isHovered && (
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 space-y-3">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay();
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {contentType}
                </Badge>
                {content.genre && (
                  <Badge variant="outline" className="text-xs">
                    {content.genre}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-foreground font-semibold text-sm line-clamp-1">
                {content.title}
              </h3>
              
              {content.description && (
                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                  {content.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Simple title overlay when not hovered */}
        {!isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
            <h3 className="text-foreground font-semibold text-sm line-clamp-1">
              {content.title}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export { ContentCard as NetflixCard };