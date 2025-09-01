// src/lib/views.ts
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "vyb_session_id";

function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // SSR / private mode fallback
    return crypto.randomUUID();
  }
}

export async function getViewCount(contentId: string): Promise<number> {
  const { error, count } = await supabase
    .from("views")
    .select("*", { count: "exact", head: true })
    .eq("content_id", contentId);

  if (error) {
    console.warn("getViewCount error:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function recordView(contentId: string, userId?: string | null) {
  const session_id = getOrCreateSessionId();
  const { error } = await supabase.from("views").insert({
    content_id: contentId,
    user_id: userId ?? null,
    session_id,
  });
  // Ignore daily-duplicate errors
  if (error && !/duplicate key/i.test(error.message)) {
    console.warn("recordView error:", error.message);
  }
}

export function subscribeToViewCount(
  contentId: string,
  onIncrement: () => void
) {
  const channel = supabase
    .channel(`views-${contentId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "views", filter: `content_id=eq.${contentId}` },
      () => onIncrement()
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
