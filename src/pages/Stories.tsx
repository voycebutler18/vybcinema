import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Row = Content & { created_at?: string };
const PAGE_SIZE = 24;

export default function Stories() {
  const [items, setItems] = useState<Row[]>([]);
  const [from, setFrom] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const load = async (append: boolean) => {
    if (loading) return;
    setLoading(true);
    const start = append ? from : 0;
    const end = start + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("contents")
      .select("id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at")
      .eq("content_type", "story")
      .order("created_at", { ascending: false })
      .range(start, end);

    if (!error) {
      const rows = (data as Row[]) ?? [];
      setItems(append ? [...items, ...rows] : rows);
      setFrom(end + 1);
      if (rows.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Stories</h1>
      <p className="mt-2 text-gray-400">Short-form stories and episodic drops.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((it, i) => (
          <ContentCard
            key={it.id}
            content={it}
            contentType="Stories"
            index={i}
            onClick={() => navigate(`/stories/${it.id}`)}
            onPlay={() => navigate(`/stories/${it.id}`)}
          />
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="mt-6 text-sm text-gray-400">No stories yet.</div>
      )}

      {hasMore && (
        <div className="mt-8">
          <Button onClick={() => load(true)} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
