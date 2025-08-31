import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import { Share2, Maximize2 } from "lucide-react";

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
  created_at: string;
};

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Content | null>(null);
  const [related, setRelated] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const poster = useMemo(() => {
    if (!item) return undefined;
    return (
      item.cover_url ||
      item.thumbnail_url ||
      (item.playback_id
        ? `https://videodelivery.net/${item.playback_id}/thumbnails/thumbnail.jpg?time=1s&height=720`
        : undefined)
    );
  }, [item]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      // current video
      const { data } = await supabase.from("content").select("*").eq("id", id).maybeSingle();
      if (active) setItem((data as Content) || null);

      // related: same type (or same genre) and not current
      if (data) {
        const { data: rel } = await supabase
          .from("content")
          .select("*")
          .neq("id", id)
          .or(
            `content_type.eq.${data.content_type},and(genre.ilike.%${data.genre || ""}%)`
          )
          .order("created_at", { ascending: false })
          .limit(18);
        if (active) setRelated((rel as Content[]) || []);
      }

      if (active) setLoading(false);
    };
    run();
    return () => {
      active = false;
    };
  }, [id]);

  const playerShellRef = useRef<HTMLDivElement>(null);

  const copyShare = async () => {
    const url = `${window.location.origin}/watch/${id}`;
    await navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 py-10">
          <div className="h-[56vw] max-h-[70vh] rounded-xl bg-white/5 animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Video not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT: player + meta */}
        <section>
          {/* Player shell so our Fullscreen button can target the container for <video>; Cloudflare iframe has its own FS button */}
          <div ref={playerShellRef} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
            {item.playback_id ? (
              <iframe
                key={item.playback_id}
                title={`${item.title} player`}
                src={`https://iframe.cloudflarestream.com/${item.playback_id}?controls=true&autoplay=false`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={item.file_url || undefined}
                poster={poster}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                controls
                playsInline
              />
            )}
          </div>

          {/* Meta bar (YouTube-like) */}
          <div className="mt-4 flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-bold">{item.title}</h1>

            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="text-sm text-muted-foreground">
                {item.content_type.toUpperCase()}
                {item.genre ? <> • {item.genre}</> : null}
              </div>

              <div className="flex items-center gap-2">
                <LikeButton contentId={item.id} />
                <Button variant="secondary" onClick={copyShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>

                {/* Extra fullscreen for native <video>. CF iframe already has a FS control. */}
                {!item.playback_id && (
                  <Button
                    variant="secondary"
                    onClick={() => playerShellRef.current?.requestFullscreen?.()}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" /> Fullscreen
                  </Button>
                )}
              </div>
            </div>

            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}
          </div>
        </section>

        {/* RIGHT: Up Next / related */}
        <aside className="space-y-3">
          <h2 className="font-semibold mb-2">Up next</h2>
          {related.map((v) => {
            const thumb =
              v.cover_url ||
              v.thumbnail_url ||
              (v.playback_id
                ? `https://videodelivery.net/${v.playback_id}/thumbnails/thumbnail.jpg?time=1s&height=200`
                : undefined);

            return (
              <button
                key={v.id}
                onClick={() => navigate(`/watch/${v.id}`)}
                className="w-full text-left flex gap-3 rounded-lg hover:bg-white/5 p-2"
              >
                <div className="relative w-44 aspect-video rounded-md overflow-hidden bg-white/5 shrink-0">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold line-clamp-2">{v.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {v.content_type.toUpperCase()}
                    {v.genre ? <> • {v.genre}</> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default Watch;
