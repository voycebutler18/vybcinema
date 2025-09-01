import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ContentRow = {
  id: string;
  title: string;
  created_at: string;
  user_id: string | null;
  cover_url?: string | null;
  thumbnail_url?: string | null;
};

type ProfileRow = {
  user_id: string;
  username?: string | null;
  display_name?: string | null; // if you have this
  full_name?: string | null;    // if you have this
};

const CreatorVideosPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<ContentRow[]>([]);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  // Friendly display name: prefer display_name → username → full_name → "Creator"
  const displayName = useMemo(() => {
    if (!profile) return "Creator";
    return (
      (profile as any).display_name ||
      (profile as any).username ||
      (profile as any).full_name ||
      "Creator"
    );
  }, [profile]);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    (async () => {
      setLoading(true);

      // 1) Fetch creator's profile name (best-effort; if missing/blocked we fall back)
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, full_name")
          .eq("user_id", userId)
          .maybeSingle();

        if (isMounted) setProfile(prof as ProfileRow | null);
      } catch {
        if (isMounted) setProfile(null);
      }

      // 2) Fetch all content by this user
      try {
        const { data: rows } = await supabase
          .from("content")
          .select("id, title, created_at, user_id, cover_url, thumbnail_url")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (isMounted) setVideos((rows as ContentRow[]) || []);
      } catch {
        if (isMounted) setVideos([]);
      }

      if (isMounted) setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const initial = (displayName?.[0] || "C").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Creator profile
            </p>
          </div>
        </div>

        {/* Videos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-border/50 bg-card/60 animate-pulse h-56"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Card className="p-6 bg-card/60 border border-border/50">
            <p className="text-muted-foreground">No videos yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => {
              const thumb = v.cover_url || v.thumbnail_url || "";
              return (
                <Link
                  key={v.id}
                  to={`/watch/${v.id}`}
                  className="group rounded-xl border border-border/40 bg-card/60 hover:bg-card transition"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={v.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary/20" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold group-hover:underline line-clamp-2">
                      {v.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(v.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back home */}
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatorVideosPage;
