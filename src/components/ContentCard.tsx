import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ChevronDown } from "lucide-react";

/* ---------- Types ---------- */

export interface Content {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  cover_url?: string;
  file_url?: string;
  trailer_url?: string;
  preview_url?: string;
  content_type?: string;
}

interface ContentCardProps {
  content: Content;
  contentType: string;
  index: number;
  onClick: () => void;   // “More” / details
  onPlay: () => void;    // Play action
}

/* ---------- Component ---------- */

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  contentType,
  index,
  onClick,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasPoster = Boolean(content.cover_url);
  const hasVideo = Boolean(content.file_url);

  // what to show on hover: preview > trailer > file
  const hoverPreview =
    content.preview_url || content.trailer_url || content.file_url || "";

  return (
    <div
      className={`flex-shrink-0 w-64 cursor-pointer transition-all duration-300 ${
        isHovered ? "scale-110 z-20" : "scale-100 z-10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformOrigin: index === 0 ? "left center" : "center",
        marginRight: isHovered ? "2rem" : "0",
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary/20 border border-border/50">
        {/* Poster / Video */}
        <div className="aspect-video relative">
          {hasPoster ? (
            <img
              src={content.cover_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : hasVideo ? (
            <video
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              controls={false}
              poster=""
              onLoadedMetadata={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  try {
                    const v = e.currentTarget;
                    v.currentTime = 2;
                    v.muted = true;
                    v.play().catch(() => {});
                  } catch {}
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  try {
                    const v = e.currentTarget;
                    v.pause();
                    v.currentTime = 2;
                  } catch {}
                }
              }}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            >
              <source src={content.file_url} type="video/mp4" />
              <source src={content.file_url} type="video/webm" />
              <source src={content.file_url} type="video/ogg" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded" />
            </div>
          )}

          {isHovered && hoverPreview && (
            <video
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={hoverPreview} type="video/mp4" />
            </video>
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

/* Optional alias for older imports */
export { ContentCard as NetflixCard };
