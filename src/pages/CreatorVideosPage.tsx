
// src/pages/CreatorVideosPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  playback_id: string | null; // Cloudflare Stream id (if used)
  video_url: string | null;   // direct mp4 (if used)
  genre: string | null;
  content_type: string | null;
  user_id: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
  } | null;
};

export default function CreatorVideosPage() {
  // supports /creator/:username and /creator/id/:id (optional second route)
  const { username, id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);

      // 1) Resolve the profile
      let userId = id ?? null;

      if (!userId && username) {
        const { data: p, error: pErr } = await supabase
          .from("profiles")
          .select("id, username, display_name, bio, avatar_url")
          .eq("username", username)
          .maybeSingle();
        if (pErr) console.error(pErr);
        if (!p || !p.id) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProfile(p as Profile);
        userId = p.id;
      }

      if (!userId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!profile) {
        // If we came via /creator/id/:id, also fetch the profile
        const { data: p2 } = await supabase
          .from("profiles")
          .select("id, username, display_name, bio, avatar_url")
          .eq("id", userId)
          .maybeSingle();
        if (p2) setProfile(p2 as Profile);
      }

      // 2) Fetch videos for that user, joined with profile (for username/display name)
      const { data: vids, error: vErr } = await supabase
        .from("content") // <- your videos table
        .select(
          `
            id, title, description, cover_url, playback_id, video_url, genre, content_type, user_id,
            profiles:profiles!content_user_id_fkey ( username, display_name )
          `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (vErr) {
        console.error(vErr);
        setVideos([]);
      } else {
        setVideos((vids ?? []) as unknown as VideoRow[]);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, id]);

  if (loading) {
    return <div className="container py-10">Loading…</div>;
  }

  if (notFound) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-2">Creator not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn’t find that username.
        </p>
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    );
  }

  const displayName =
    profile?.display_name ||
    (profile?.username ? `@${profile.username}` : "Creator");

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center text-lg font-semibold">
            {(profile?.display_name?.[0] ||
              profile?.username?.[0] ||
              "C"
            ).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold leading-tight">{displayName}</h1>
          {profile?.username && (
            <div className="text-muted-foreground">@{profile.username}</div>
          )}
        </div>
      </div>

      {/* Videos */}
      {videos.length === 0 ? (
        <Card className="p-6 text-muted-foreground">No videos yet.</Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoPlayer
              key={v.id}
              title={v.title}
              description={v.description ?? undefined}
              contentType={v.content_type || "Video"}
              coverUrl={v.cover_url ?? undefined}
              playbackId={v.playback_id ?? undefined}
              videoUrl={v.video_url ?? undefined}
              genre={v.genre ?? undefined}
              // pass creator props so byline in the card remains clickable
              creatorId={v.user_id}
              creatorUsername={v.profiles?.username ?? profile?.username ?? undefined}
              creatorDisplayName={v.profiles?.display_name ?? profile?.display_name ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
