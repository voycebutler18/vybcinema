import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  contentId: string;
  className?: string;
};

export default function ViewCounter({ contentId, className }: Props) {
  const [count, setCount] = useState<number | null>(null);

  // fetch initial count
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { count, error } = await supabase
        .from("views")
        .select("*", { head: true, count: "exact" })
        .eq("content_id", contentId);

      if (!isMounted) return;
      if (!error) setCount(count ?? 0);
      else console.warn("views count error:", error);
    })();

    return () => {
      isMounted = false;
    };
  }, [contentId]);

  // realtime updates when new views rows insert
  useEffect(() => {
    const channel = supabase
      .channel(`views-${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "views",
          filter: `content_id=eq.${contentId}`,
        },
        () => setCount((c) => (typeof c === "number" ? c + 1 : 1))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId]);

  // optional fallback polling every 15s (helps if realtime is off)
  useEffect(() => {
    const t = setInterval(async () => {
      const { count, error } = await supabase
        .from("views")
        .select("*", { head: true, count: "exact" })
        .eq("content_id", contentId);
      if (!error) setCount(count ?? 0);
    }, 15000);
    return () => clearInterval(t);
  }, [contentId]);

  return (
    <span className={["inline-flex items-center gap-1 text-sm text-muted-foreground", className].filter(Boolean).join(" ")}>
      <Eye className="h-4 w-4" />
      {count === null ? "—" : count.toLocaleString()}
    </span>
  );
}
