// src/pages/CreatorVideosPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Profile = {
  user_id: string;               // AUTH UID (route param)
  username?: string | null;
  display_name?: string | null;
};

type Content = {
  id: string;
  title: string;
  cover_url?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
  genre?: string | null;
  content_type: string;
};

const CreatorVideosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // /creator/id/:id  (AUTH UID)
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);

      // 1) profile by AUTH UID
      const { data: p } = await supabase
        .from("profiles")
        .select("user_id, username, display_name")
        .eq("user_id", id)
        .maybeSingle();
      setProfile((p as Profile) ?? null);

      // 2) videos by AUTH UID
      const { data: rows } = await supabase
        .from("content")
        .select("id, title, cover_url, thumbnail_url, created_at, genre, content_type")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      setVideos((rows as Content[]) || []);

      setLoading(false);
    })();
  }, [id]);

  const displayName =
    profile?.display_name?.trim() ||
    profile?.username?.trim() ||
    "Creator";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-24 pb-20">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center uppercase font-semibold">
              {displayName?.[0]?.toUpperCase() || "C"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground">@{profile?.username ?? "creator"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <Link key={v.id} to={`/watch/${v.id}`} className="group">
              <Card className="overflow-hidden hover:bg-card/70 transition">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={v.cover_url || v.thumbnail_url || ""}
                    alt={v.title}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {v.content_type.replace("_", " ")}
                    </Badge>
                    {v.genre && <Badge variant="outline">{v.genre}</Badge>}
                  </div>
                  <div className="font-semibold line-clamp-2">{v.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(v.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {!loading && videos.length === 0 && (
            <div className="col-span-full rounded-lg border border-border/50 bg-card/60 p-6 text-sm text-muted-foreground">
              No videos yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatorVideosPage;
