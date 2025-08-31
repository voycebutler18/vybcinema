// src/pages/Watch.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
};

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Content | null>(null);
  const [upNext, setUpNext] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setLoading(true);

      // fetch the selected video
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        navigate("/"); // fallback if bad id
        return;
      }
      setItem(data as Content);

      // fetch "up next" (same type if possible)
      const { data: more } = await supabase
        .from("content")
        .select("*")
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(12);

      setUpNext((more || []) as Content[]);
      setLoading(false);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-24 pb-20">
        {loading && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="aspect-video rounded-xl bg-card/60 animate-pulse" />
              <div className="h-6 w-2/3 mt-4 bg-card/60 rounded animate-pulse" />
              <div className="h-4 w-1/2 mt-2 bg-card/60 rounded animate-pulse" />
            </div>
            <div className="lg:col-span-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-card/60 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!loading && item && (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Player + details */}
            <section className="lg:col-span-8">
              <VideoPlayer
                videoUrl={item.file_url || undefined}
                coverUrl={item.cover_url || undefined}
                trailerUrl={item.trailer_url || undefined}
                title={item.title}
                description={item.description || ""}
                genre={item.genre || ""}
                contentType={item.content_type}
                streamUrl={item.stream_url || undefined}
                streamStatus={item.stream_status || undefined}
                streamId={item.stream_id || undefined}
                streamThumbnailUrl={item.stream_thumbnail_url || undefined}
                playbackId={item.playback_id || undefined}
                vastTagUrl={item.vast_tag_url || undefined}
                adBreaks={item.ad_breaks || [0]}
                durationSeconds={item.duration_seconds || undefined}
                monetizationEnabled={!!item.monetization_enabled}
                contentId={item.id}
                canDelete={false}
              />

              <div className="mt-4">
                <h1 className="text-2xl md:text-3xl font-bold">{item.title}</h1>
                {item.genre && (
                  <p className="text-sm text-muted-foreground mt-1">{item.genre}</p>
                )}
                {item.description && (
                  <p className="mt-3 text-foreground/80">{item.description}</p>
                )}
              </div>
            </section>

            {/* Up next rail */}
            <aside className="lg:col-span-4">
              <h3 className="text-lg font-semibold mb-3">Up next</h3>
              <div className="space-y-3">
                {upNext.map((c) => (
                  <Link
                    to={`/watch/${c.id}`}
                    key={c.id}
                    className="group flex gap-3 rounded-lg border border-border/40 bg-card/60 hover:bg-card transition p-2"
                  >
                    <div className="relative w-40 shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
                      {c.cover_url || c.thumbnail_url ? (
                        <img
                          src={c.cover_url || c.thumbnail_url || ""}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold line-clamp-2">{c.title}</p>
                      {c.genre && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {c.genre}
                        </p>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        className="mt-2 opacity-0 group-hover:opacity-100 transition"
                      >
                        Watch
                      </Button>
                    </div>
                  </Link>
                ))}
                {upNext.length === 0 && (
                  <p className="text-sm text-muted-foreground">No more videos yet.</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Watch;
