import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useLikes(contentId?: string) {
  const { user } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!contentId) return;
    // Count total
    const { count: total } = await supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("content_id", contentId);

    setCount(total || 0);

    if (user?.id) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("content_id", contentId)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!data);
    } else {
      setLiked(false);
    }
  }, [contentId, user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    if (!contentId || !user?.id || loading) return;
    setLoading(true);
    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("content_id", contentId)
          .eq("user_id", user.id);
        if (!error) {
          setLiked(false);
          setCount(c => Math.max(0, c - 1));
        }
      } else {
        const { error } = await supabase.from("likes").insert({
          content_id: contentId,
          user_id: user.id,
        });
        if (!error) {
          setLiked(true);
          setCount(c => c + 1);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [contentId, user?.id, liked, loading]);

  return { count, liked, loading, toggle, refresh };
}
