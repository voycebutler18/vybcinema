import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, ThumbsUp, Info } from 'lucide-react';

interface NetflixHeroProps {
  content: any;
  contentType: string;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export const NetflixHero: React.FC<NetflixHeroProps> = ({
  content,
  contentType,
  onPlay,
  onMoreInfo
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!content) {
    return (
      <div className="relative h-[80vh] bg-gradient-to-r from-black/80 to-black/40 flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-gray-700 rounded"></div>
              <div className="h-12 w-40 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {content.trailer_url ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={content.trailer_url} type="video/mp4" />
          </video>
        ) : content.cover_url ? (
          <img
            src={content.cover_url}
            alt={content.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <Badge variant="secondary" className="mb-4 bg-red-600 hover:bg-red-700 text-white">
              {contentType.toUpperCase()}
            </Badge>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {content.title}
            </h1>
            
            {/* Description */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {content.description || `An amazing ${contentType.toLowerCase()} that you won't want to miss.`}
            </p>
            
            {/* Genre */}
            {content.genre && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-white/70">Genre:</span>
                <Badge variant="outline" className="border-white/30 text-white">
                  {content.genre}
                </Badge>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-semibold px-8"
                onClick={onPlay}
              >
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
              
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-gray-600/70 text-white hover:bg-gray-600/90 font-semibold px-8"
                onClick={onMoreInfo}
              >
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost"
                className="rounded-full p-3 bg-black/30 hover:bg-black/50 text-white border border-white/30"
              >
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost"
                className="rounded-full p-3 bg-black/30 hover:bg-black/50 text-white border border-white/30"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};