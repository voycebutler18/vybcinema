import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  contentId: string;
  className?: string;
};

export default function ViewCounter({ contentId, className }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [pending, setPending] = useState(true);

  // stable session id (once per browser)
  const sessionId = useMemo(() => {
    let sid = localStorage.getItem("vyb_view_session");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("vyb_view_session", sid);
    }
    return sid;
  }, []);

  // fetch total count
  const fetchCount = async () => {
    const { count: total, error } = await supabase
      .from("views")
      .select("id", { head: true, count: "exact" })
      .eq("content_id", contentId);
    if (!error) setCount(total ?? 0);
  };

  // record a view immediately on mount, then refresh count
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setPending(true);

      // call RPC — deduped by (content_id, session_id, viewed_on)
      await supabase.rpc("increment_view", {
        p_content_id: contentId,
        p_session: sessionId,
      });

      if (!alive) return;

      await fetchCount();
      setPending(false);
    };

    run();

    // optional: keep the number fresh if others are watching
    const t = setInterval(fetchCount, 30000);

    return () => {
      alive = false;
      clearInterval(t);
    };
    // run once per contentId
  }, [contentId, sessionId]);

  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-sm text-muted-foreground",
        className || "",
      ].join(" ")}
      title="Views"
    >
      <Eye className="h-4 w-4" />
      {pending && count === null ? "…" : count ?? 0}
    </span>
  );
}
