import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

/** Shape from DB */
type DbComment = {
  id: string;
  content_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

type Props = {
  contentId: string;
  className?: string;
};

export default function Comments({ contentId, className }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<DbComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [body, setBody] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);

  // fetch all comments for this content
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("id,content_id,user_id,body,created_at")
      .eq("content_id", contentId)
      .order("created_at", { ascending: false });

    if (!error) setItems((data as DbComment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // realtime (optional but nice): listen for inserts/deletes on this content
    const channel = supabase
      .channel(`comments:${contentId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `content_id=eq.${contentId}` },
        (payload) => setItems((prev) => [payload.new as DbComment, ...prev]),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "comments", filter: `content_id=eq.${contentId}` },
        (payload) => setItems((prev) => prev.filter((c) => c.id !== (payload.old as any)?.id)),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId]);

  const submit = async () => {
    if (!user) {
      // nudge to login
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    const text = body.trim();
    if (!text) {
      boxRef.current?.focus();
      return;
    }
    setPosting(true);
    const { error, data } = await supabase
      .from("comments")
      .insert({
        content_id: contentId,
        user_id: user.id,
        body: text,
      })
      .select()
      .single();

    if (!error && data) {
      setBody("");
      // optimistic update is handled by realtime insert too;
      // but keep a local push in case realtime is delayed
      setItems((prev) => [data as DbComment, ...prev]);
    }
    setPosting(false);
  };

  const remove = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    // realtime handler will remove; local fallback:
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const header = useMemo(
    () => (items.length === 1 ? "1 comment" : `${items.length} comments`),
    [items.length],
  );

  return (
    <div className={`rounded-2xl border border-border/40 bg-card/60 ${className || ""}`}>
      {/* Write box */}
      <div className="p-4 border-b border-border/30">
        <div className="text-sm font-semibold mb-2">Comments</div>
        {!user ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button size="sm" onClick={() => navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`)}>
              Log in
            </Button>
            <span>or</span>
            <Button size="sm" variant="secondary" onClick={() => navigate(`/signup?next=${encodeURIComponent(location.pathname + location.search)}`)}>
              Sign up
            </Button>
            <span>to join the conversation.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Textarea
              ref={boxRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a public comment…"
              className="min-h-[72px] resize-y"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setBody("")} disabled={posting || body.trim().length === 0}>
                Clear
              </Button>
              <Button size="sm" onClick={submit} disabled={posting || body.trim().length === 0}>
                {posting ? "Posting…" : "Comment"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-3">{loading ? "Loading…" : header}</div>

        <ul className="space-y-4">
          {items.map((c) => (
            <li key={c.id} className="group">
              <div className="flex items-start gap-3">
                {/* Avatar placeholder */}
                <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  {c.user_id.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      {c.user_id === user?.id ? "You" : `@${c.user_id.slice(0, 8)}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                    </div>

                    {c.user_id === user?.id && (
                      <button
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        title="Delete"
                        onClick={() => remove(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm whitespace-pre-wrap mt-1">{c.body}</div>
                </div>
              </div>
            </li>
          ))}

          {!loading && items.length === 0 && (
            <li className="text-sm text-muted-foreground">Be the first to comment.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
