import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Check, ThumbsUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; // still used for Favorites ONLY
import {
  getLikeCount,
  isLikedLocal,
  likeOnce,
  unlikeOnce,
} from "@/utils/likes";

/* ---------- Types ---------- */

export interface Content {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  cover_url?: string;
  file_url?: string;
  trailer_url?: string;
  content_type?: string;
}

interface ContentCardProps {
  content: Content;
  contentType: string;
  index: number;
  onClick: () => void;   // open details / “More”
  onPlay: () => void;    // start playback
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

  // Favorites UI (unchanged) — comment these lines out if you removed Favorites entirely
  const [isFavorited, setIsFavorited] = useState(false);

  // New: public like count + local liked state (no DB)
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean>(false);

  const { toast } = useToast();

  // Load initial states
  useEffect(() => {
    let cancelled = false;

    // Favorites check (DB) - keep only if you still use favorites
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("content_id", content.id)
        .maybeSingle();

      if (!cancelled) {
        if (error && error.code !== "PGRST116") {
          console.warn("Favorite check error:", error.message);
        }
        setIsFavorited(!!data);
      }
    })();

    // Likes (no DB)
    setLiked(isLikedLocal(content.id));
    getLikeCount(content.id)
      .then((n) => !cancelled && setLikeCount(n))
      .catch(() => !cancelled && setLikeCount(0));

    return () => {
      cancelled = true;
    };
  }, [content.id]);

  /* ------- Favorites toggle (kept as-is; remove if you don’t use favorites) ------- */
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in to save favorites." });
      return;
    }

    // try delete first
    const { data: removed, error: delErr } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("content_id", content.id)
      .select("id");

    if (delErr) {
      toast({ title: "Error", description: delErr.message, variant: "destructive" });
      return;
    }

    if (removed && removed.length > 0) {
      setIsFavorited(false);
      toast({ title: "Removed from Favorites" });
      return;
    }

    // insert if not removed
    const { error: insErr } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, content_id: content.id });

    if (insErr) {
      toast({ title: "Could not add to favorites", description: insErr.message, variant: "destructive" });
      return;
    }

    setIsFavorited(true);
    toast({ title: "Added to Favorites", description: content.title });
  };

  /* ------- NEW Like/Unlike (no Supabase) ------- */
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (liked) {
        const n = await unlikeOnce(content.id);
        setLiked(false);
        setLikeCount(n);
        toast({ title: "Like removed" });
      } else {
        const n = await likeOnce(content.id);
        setLiked(true);
        setLikeCount(n);
        toast({ title: "Thanks for the like", description: content.title });
      }
    } catch (err: any) {
      toast({
        title: "Could not update like",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

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
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary/20 border border-border/50">
        {/* Poster / Video */}
        <div className="aspect-video relative">
          {content.cover_url ? (
            <img
              src={content.cover_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
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
                console.warn("Video failed to load:", content.file_url);
                setImageLoaded(true);
              }}
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

          {isHovered && content.trailer_url && (
            <video
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={content.trailer_url} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Expanded panel on hover */}
        {isHovered && (
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 space-y-3 relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
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

                {/* Favorites (keep/remove as you like) */}
                <Button
                  type="button"
                  size="sm"
                  variant={isFavorited ? "default" : "outline"}
                  className="rounded-full p-2"
                  onClick={toggleFavorite}
                  title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {isFavorited ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>

                {/* Likes (no DB) */}
                <Button
                  type="button"
                  size="sm"
                  variant={liked ? "default" : "outline"}
                  className="rounded-full px-3"
                  onClick={handleLike}
                  title={liked ? "Unlike" : "Like"}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="ml-2 text-xs">{likeCount ?? "…"}</span>
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

/* Optional alias for legacy imports */
export { ContentCard as NetflixCard };
