// src/pages/Watch.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ThumbsUp, Share2 } from "lucide-react";

type Content = {
  id: string;
  title: string;
  description?: string | null;
  content_type: string;
  genre?: string | null;
  cover_url?: string | null;
  thumbnail_url?: string | null;
  file_url?: string | null;
  trailer_url?: string | null;
  stream_url?: string | null;
  stream_status?: string | null;
  stream_id?: string | null;
  stream_thumbnail_url?: string | null;
  playback_id?: string | null;
  vast_tag_url?: string | null;
  ad_breaks?: number[] | null;
  duration_seconds?: number | null;
  monetization_enabled?: boolean | null;
  created_at: string;
  user_id?: string | null;
  likes_count?: number | null;
};

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [item, setItem] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Content[]>([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likedByMe, setLikedByMe] = useState<boolean>(false);

  // creator display state (always render something)
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [creatorUsername, setCreatorUsername] = useState<string | null>(null);
  const [creatorDisplayName, setCreatorDisplayName] = useState<string>("Creator");

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);

      // 1) load the video row
      const { data, error } = await supabase.from("content").select("*").eq("id", id).single();

      if (error || !data) {
        setItem(null);
        setLoading(false);
        toast({
          title: "Not found",
          description: "That video doesn’t exist (or was removed).",
          variant: "destructive",
        });
        return;
      }

      const row = data as Content;
      setItem(row);
      setLikeCount(row.likes_count ?? 0);

      // 2) fetch creator profile (compute a display name)
      if (row.user_id) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("id, username, full_name, display_name_mode")
          .eq("id", row.user_id)
          .maybeSingle();

        if (prof) {
          const mode = prof.display_name_mode as "username" | "full_name" | null;
          const disp =
            mode === "username"
              ? prof.username || "Creator"
              : prof.full_name || prof.username || "Creator";

          setCreatorId(prof.id);
          setCreatorUsername(prof.username ?? null);
          setCreatorDisplayName(disp);
        } else {
          // profile missing but user_id exists
          setCreatorId(row.user_id);
          setCreatorUsername(null);
          setCreatorDisplayName("Creator");
        }
      } else {
        // no user_id on content
        setCreatorId(null);
        setCreatorUsername(null);
        setCreatorDisplayName("Creator");
      }

      // 3) related
      const { data: rel } = await supabase
        .from("content")
        .select("*")
        .neq("id", id)
        .eq("content_type", row.content_type)
        .order("created_at", { ascending: false })
        .limit(12);
      setRelated((rel as Content[]) || []);

      // 4) my like (only if signed in)
      if (user) {
        const { data: myLike } = await supabase
          .from("likes")
          .select("id")
          .eq("content_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        setLikedByMe(!!myLike);
      } else {
        setLikedByMe(false);
      }

      setLoading(false);
    })();
  }, [id, user, toast]);

  const toggleLike = async () => {
    if (!id) return;
    if (!user) {
      toast({ title: "Sign in to like videos" });
      return;
    }
    try {
      if (likedByMe) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("content_id", id)
          .eq("user_id", user.id);
        if (error) throw error;
        setLikedByMe(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        const { error } = await supabase.from("likes").insert({
          content_id: id,
          user_id: user.id,
        });
        if (error) throw error;
        setLikedByMe(true);
        setLikeCount((c) => c + 1);
      }
    } catch (e: any) {
      toast({
        title: "Couldn’t update like",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const share = async () => {
    try {
      const url = `${window.location.origin}/watch/${id}`;
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share it with friends!" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-24 pb-20">
          <div className="grid lg:grid-cols-[minmax(0,2fr),minmax(280px,1fr)] gap-8">
            <div className="space-y-4">
              <div className="aspect-video rounded-xl bg-card/60 animate-pulse" />
              <div className="h-6 w-2/3 bg-card/60 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-card/60 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-card/60 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-32 pb-20">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold">Video not found</h2>
            <p className="text-muted-foreground mt-2">
              It may have been removed or the link is wrong.
            </p>
            <Button className="mt-6" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-[minmax(0,2fr),minmax(300px,1fr)] gap-8">
          {/* LEFT: Player + details */}
          <div>
            <VideoPlayer
              inline
              showInlineMeta={false} // prevent duplicate title/meta
              videoUrl={item.file_url || undefined}
              trailerUrl={item.trailer_url || undefined}
              playbackId={item.playback_id || undefined}
              coverUrl={item.cover_url || undefined}
              streamThumbnailUrl={item.stream_thumbnail_url || undefined}
              title={item.title}
              description={item.description || undefined}
              genre={item.genre || undefined}
              contentType={item.content_type}
              streamUrl={item.stream_url || undefined}
              streamStatus={item.stream_status || undefined}
              streamId={item.stream_id || undefined}
              vastTagUrl={item.vast_tag_url || undefined}
              adBreaks={item.ad_breaks || undefined}
              durationSeconds={item.duration_seconds || undefined}
              monetizationEnabled={!!item.monetization_enabled}
              contentId={item.id}
              canDelete={false}
              creatorId={creatorId || undefined}
              creatorUsername={creatorUsername || undefined}
              creatorDisplayName={creatorDisplayName || undefined}
            />

            {/* Title */}
            <h1 className="mt-4 text-2xl font-bold">{item.title}</h1>

            {/* by … (always render) */}
            <div className="mt-1 text-sm text-muted-foreground">
              by{" "}
              {creatorId ? (
                <Link
                  to={`/creator/id/${creatorId}`}
                  className="text-primary hover:underline"
                >
                  {creatorDisplayName || creatorUsername || "Creator"}
                </Link>
              ) : (
                <span>Creator</span>
              )}
            </div>

            {/* chips + date + actions */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-medium capitalize">
                {item.content_type.replace("_", " ")}
              </Badge>
              {item.genre && <Badge variant="outline">{item.genre}</Badge>}
              <span className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </span>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant={likedByMe ? "default" : "secondary"}
                  size="sm"
                  onClick={toggleLike}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {likedByMe ? "Liked" : "Like"}
                  <span className="opacity-80">• {likeCount}</span>
                </Button>

                <Button variant="outline" size="sm" onClick={share} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {item.description && (
              <div className="mt-4 rounded-xl border border-border/50 bg-card/60 p-4">
                <p className="whitespace-pre-line text-sm text-foreground/90">
                  {item.description}
                </p>
              </div>
            )}

            {/* Comments */}
            {/* If you use your Comments component, render it here:
                <div className="mt-6"><Comments contentId={item.id} /></div>
            */}
          </div>

          {/* RIGHT: related */}
          <aside className="space-y-4">
            {related.map((r) => (
              <Link
                to={`/watch/${r.id}`}
                key={r.id}
                className="group grid grid-cols-[168px,1fr] gap-3 rounded-xl border border-border/40 bg-card/60 hover:bg-card transition"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-l-xl">
                  <img
                    src={r.cover_url || r.thumbnail_url || ""}
                    alt={r.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {typeof r.likes_count === "number" && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs">
                      <ThumbsUp className="h-3 w-3" />
                      {r.likes_count}
                    </div>
                  )}
                </div>
                <div className="py-2 pr-3">
                  <p className="line-clamp-2 font-semibold group-hover:underline">
                    {r.title}
                  </p>
                  {r.genre && (
                    <p className="mt-1 text-xs text-muted-foreground">{r.genre}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
            {related.length === 0 && (
              <div className="text-sm text-muted-foreground">No related videos yet.</div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Watch;
