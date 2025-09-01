import React, { useEffect, useState } from "react";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Row = Content & { created_at?: string };

const PAGE_SIZE = 24;
const API_URL = import.meta.env.VITE_SUPABASE_URL as string;
const API_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || (import.meta.env.VITE_SUPABASE_ANON_KEY as string);
const REST_TABLE = "contents";

export default function Challenges() {
  const [items, setItems] = useState<Row[]>([]);
  const [from, setFrom] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchPage = async (start: number, size: number) => {
    if (!API_URL || !API_KEY) {
      console.warn("[Challenges] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
      return [];
    }
    const params = new URLSearchParams({
      select: "id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at",
      order: "created_at.desc",
      limit: String(size),
      offset: String(start),
      content_type: "in.(challenge)",
    });
    const res = await fetch(`${API_URL}/rest/v1/${REST_TABLE}?${params.toString()}`, {
      headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) {
      console.error("[Challenges] REST error", res.status, await res.text());
      return [];
    }
    return (await res.json()) as Row[];
  };

  const load = async (append: boolean) => {
    if (loading) return;
    setLoading(true);
    const start = append ? from : 0;
    const rows = await fetchPage(start, PAGE_SIZE);
    setItems(append ? [...items, ...rows] : rows);
    setFrom(start + rows.length);
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Challenges</h1>
      <p className="mt-2 text-gray-400">Join trending challenges and compete.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((it, i) => (
          <ContentCard
            key={it.id}
            content={it}
            contentType="Challenges"
            index={i}
            onClick={() => navigate(`/challenges/${it.id}`)}
            onPlay={() => navigate(`/challenges/${it.id}`)}
          />
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="mt-6 text-sm text-gray-400">No challenges yet.</div>
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
