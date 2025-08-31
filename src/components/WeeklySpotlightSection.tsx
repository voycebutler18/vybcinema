// src/components/WeeklySpotlightSection.tsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Play, Music, Tv, BookOpen, Sparkles, Trophy } from "lucide-react";

type Content = {
  id: string;
  title: string;
  description?: string | null;
  content_type: string;
  genre?: string | null;
  cover_url?: string | null;
  thumbnail_url?: string | null;
  file_url?: string | null;
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

type Cat = {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  match: { content_type?: string; genreLike?: string };
};

const CATS: Cat[] = [
  { key: "music", label: "Music", icon: Music, match: { content_type: "music_video" } },
  { key: "shows", label: "Shows", icon: Tv, match: { content_type: "tv_show" } },
  { key: "stories", label: "Stories", icon: BookOpen, match: { content_type: "story" } },
  { key: "talent", label: "Talent", icon: Sparkles, match: { content_type: "talent", genreLike: "%talent%" } },
  { key: "challenges", label: "Challenges", icon: Trophy, match: { content_type: "challenge", genreLike: "%challenge%" } },
];

const sinceISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
};

export const WeeklySpotlightSection: React.FC = () => {
  const [winners, setWinners] = useState<Record<string, Content | null>>({});
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Content | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const since = sinceISO();

      const results = await Promise.all(
        CATS.map(async (cat) => {
          let q = supabase
            .from<Content>("content")
            .select("*")
            .gte("created_at", since)
            .order("created_at", { ascending: false })
            .limit(12);

          if (cat.match.content_type) q = q.eq("content_type", cat.match.content_type);

          let { data, error } = await q;

          if (!error && (!data || data.length === 0) && cat.match.genreLike) {
            const alt = await supabase
              .from<Content>("content")
              .select("*")
              .gte("created_at", since)
              .ilike("genre", cat.match.genreLike)
              .order("created_at", { ascending: false })
              .limit(12);
            data = alt.data || [];
          }

          if (error) {
            console.error(`WeeklySpotlight ${cat.key} error:`, error);
            return [cat.key, null] as const;
          }

          const winner = data && data.length ? data[0] : null;
          return [cat.key, winner] as const;
        })
      );

      const map: Record<string, Content | null> = {};
      results.forEach(([k, v]) => (map[k] = v));
      setWinners(map);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const open = (item: Content) => {
    setActive(item);
    setShowPlayer(true);
  };

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/80 font-semibold mb-2">
              weekly spotlight
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Video of the Week <span className="text-primary">— voted by teens</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Fresh winners every week for each category. If there’s no winner yet,
              you’ll see “None yet.” Get your uploads in!
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CATS.map((cat) => {
            const Icon = cat.icon;
            const winner = winners[cat.key];

            return (
              <div
                key={cat.key}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 hover:border-white/20 transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-lg bg-white/10 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{cat.label}</p>
                </div>

                {loading ? (
                  <div className="aspect-[16/9] w-full rounded-xl bg-white/5 animate-pulse" />
                ) : winner ? (
                  <>
                    <div
                      className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black"
                      style={{
                        backgroundImage:
                          winner.cover_url || winner.thumbnail_url
                            ? `url(${winner.cover_url || winner.thumbnail_url})`
                            : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      <Button
                        size="sm"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600"
                        onClick={() => open(winner)}
                        aria-label={`Play ${winner.title}`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </Button>
                    </div>

                    <div className="mt-3">
                      <p className="line-clamp-2 font-semibold">{winner.title}</p>
                      {winner.genre ? (
                        <p className="text-xs text-muted-foreground mt-1">{winner.genre}</p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="aspect-[16/9] w-full rounded-xl bg-white/5 grid place-items-center text-sm text-muted-foreground">
                    None yet – be the first!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black">
          {active && (
            <VideoPlayer
              videoUrl={active.file_url || undefined}
              coverUrl={active.cover_url || undefined}
              trailerUrl={undefined}
              title={active.title}
              description={active.description || ""}
              genre={active.genre || ""}
              contentType={active.content_type}
              streamUrl={active.stream_url || undefined}
              streamStatus={active.stream_status || undefined}
              streamId={active.stream_id || undefined}
              streamThumbnailUrl={active.stream_thumbnail_url || undefined}
              playbackId={active.playback_id || undefined}
              vastTagUrl={active.vast_tag_url || undefined}
              adBreaks={active.ad_breaks || [0]}
              durationSeconds={active.duration_seconds || undefined}
              monetizationEnabled={!!active.monetization_enabled}
              contentId={active.id}
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WeeklySpotlightSection;
