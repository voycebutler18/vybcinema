import React, { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  contentId: string;
  className?: string;
  size?: "sm" | "md";
  // Optional: if you already have count from parent (e.g., content.likes_count)
  initialCount?: number;
};

export const LikeButton: React.FC<Props> = ({ contentId, className, size="md", initialCount }) => {
  const { user } = useAuth();
  const [count, setCount] = useState<number>(initialCount ?? 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // One channel per content id for realtime bumps
  const channel = useMemo(
    () => supabase.channel(`likes:${contentId}`),
    [contentId]
  );

  // Fetch whether I liked & the current count (fallback if column isn’t present)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 1) am I liked?
      if (user?.id) {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("content_id", contentId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (!cancelled) setLiked(!!data);
      } else {
        setLiked(false);
      }

      // 2) count
      if (initialCount === undefined) {
        // Try denormalized column
        const { data: c } = await supabase
          .from("content")
          .select("likes_count")
          .eq("id", contentId)
          .maybeSingle();

        if (!cancelled) {
          if (c && typeof c.likes_count === "number") {
            setCount(c.likes_count);
          } else {
            // fallback to aggregate count
            const { count: agg } = await supabase
              .from("likes")
              .select("*", { head: true, count: "exact" })
              .eq("content_id", contentId);
            setCount(agg ?? 0);
          }
        }
      }
    };

    load();

    // Realtime bumps
    channel
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "likes", filter: `content_id=eq.${contentId}` },
        () => setCount((c) => c + 1)
      )
      .on("postgres_changes",
        { event: "DELETE", schema: "public", table: "likes", filter: `content_id=eq.${contentId}` },
        () => setCount((c) => (c > 0 ? c - 1 : 0))
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [contentId, user?.id, initialCount, channel]);

  const toggle = async () => {
    if (!user) {
      // up to you: open login modal or route to /login
      window.location.href = "/login";
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      if (!liked) {
        // optimistic
        setLiked(true);
        setCount((c) => c + 1);

        const { error } = await supabase.from("likes").insert({
          user_id: user.id,
          content_id: contentId,
        } as any);

        if (error) {
          // rollback on error
          setLiked(false);
          setCount((c) => (c > 0 ? c - 1 : 0));
          // ignore duplicate like errors (unique constraint), everything is fine
          if (!String(error.message).includes("duplicate")) {
            console.error("like insert error", error);
          }
        }
      } else {
        // optimistic
        setLiked(false);
        setCount((c) => (c > 0 ? c - 1 : 0));

        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", contentId);

        if (error) {
          // rollback
          setLiked(true);
          setCount((c) => c + 1);
          console.error("like delete error", error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      className={cn(
        "flex items-center gap-2 text-white/80 hover:text-white",
        className
      )}
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn("h-5 w-5 transition-transform",
          liked ? "fill-pink-500 text-pink-500 scale-110" : "text-white"
        )}
      />
      <span className="text-sm tabular-nums">{count}</span>
    </Button>
  );
};
