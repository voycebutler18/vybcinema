import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ChevronDown } from "lucide-react";

export interface Content {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  cover_url?: string;    // poster image
  file_url?: string;     // full video (fallback for preview)
  trailer_url?: string;  // preferred short preview
  preview_url?: string;  // optional preview alias
  content_type?: string;
}

interface ContentCardProps {
  content: Content;
  contentType: string;
  index: number;
  onClick: () => void;   // “More / Details”
  onPlay: () => void;    // Play action
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  contentType,
  index,
  onClick,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // choose best preview source
  const previewSrc =
    content.trailer_url || content.preview_url || content.file_url || "";

  const playPreview = () => {
    const v = videoRef.current;
    if (!v || !previewSrc) return;
    try {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    } catch {}
  };

  const stopPreview = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  };

  return (
    <div
      className={`flex-shrink-0 w-64 cursor-pointer transition-all duration-300 ${
        isHovered ? "scale-110 z-20" : "scale-100 z-10"
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        playPreview();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        stopPreview();
      }}
      onTouchStart={(e) => {
        // tap to toggle preview on mobile
        if (!previewSrc) return;
        const v = videoRef.current;
        if (!v) return;
        // prevent immediate navigation if wrapped in a Link higher up
        e.preventDefault();
        if (v.paused) {
          setIsHovered(true);
          playPreview();
        } else {
          setIsHovered(false);
          stopPreview();
        }
      }}
      style={{
        transformOrigin: index === 0 ? "left center" : "center",
        marginRight: isHovered ? "2rem" : "0",
      }}
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary/20 border border-border/50">
        {/* Poster / Preview */}
        <div className="aspect-video relative">
          {/* Poster image */}
          {content.cover_url ? (
            <img
              src={content.cover_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Hover video preview (muted, loop) */}
          {previewSrc && (
            <video
              ref={videoRef}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 data-[show=true]:opacity-100"
              data-show={isHovered}
              src={previewSrc}
              muted
              loop
              playsInline
              preload="metadata"
              poster={content.cover_url}
            />
          )}

          {!imageLoaded && content.cover_url && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded" />
            </div>
          )}
        </div>

        {/* Expanded panel on hover */}
        {isHovered && (
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 space-y-3 relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay();
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>

              <Button
                type="button"
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

        {/* Title overlay when not hovered */}
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

// legacy alias if you used NetflixCard elsewhere
export { ContentCard as NetflixCard };
