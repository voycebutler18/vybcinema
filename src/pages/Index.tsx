// pages/Stories/index.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ContentCard } from "@/components/ContentCard";

type Row = {
  id: string;
  title: string;
  thumbnail_url: string;
  preview_url?: string;
  slug?: string;
};

export default function StoriesPage() {
  const [recent, setRecent] = useState<Row[]>([]);
  const [mystery, setMystery] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      // adjust queries to your schema
      const { data: r } = await supabase
        .from("contents")
        .select("id,title,thumbnail_url,preview_url,slug")
        .eq("type", "story")
        .order("created_at", { ascending: false })
        .limit(12);

      const { data: m } = await supabase
        .from("contents")
        .select("id,title,thumbnail_url,preview_url,slug")
        .eq("type", "story")
        .eq("genre", "mystery")
        .order("created_at", { ascending: false })
        .limit(12);

      setRecent(r ?? []);
      setMystery(m ?? []);
    })();
  }, []);

  const mapItem = (x: Row) => ({
    ...x,
    href: `/stories/${x.slug || x.id}`,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h2 className="mb-4 text-2xl font-extrabold text-white">Recently Added Stories</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((it) => (
          <ContentCard key={it.id} item={mapItem(it)} />
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-extrabold text-white">Mystery & Thriller Stories</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mystery.map((it) => (
          <ContentCard key={it.id} item={mapItem(it)} />
        ))}
      </div>
    </div>
  );
}
