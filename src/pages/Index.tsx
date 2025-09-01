import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";

type Row = Content & { created_at?: string };

const SECTION_LIMIT = 8;

async function fetchSection(contentTypes: string[], limit: number) {
  const { data, error } = await supabase
    .from("contents")
    .select("id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at")
    .in("content_type", contentTypes)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as Row[]) ?? [];
}

export default function Index() {
  const [music, setMusic] = useState<Row[]>([]);
  const [shows, setShows] = useState<Row[]>([]);
  const [stories, setStories] = useState<Row[]>([]);
  const [talent, setTalent] = useState<Row[]>([]);
  const [challenges, setChallenges] = useState<Row[]>([]);
  const [live, setLive] = useState<Row[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setMusic(await fetchSection(["music"], SECTION_LIMIT));
      setShows(await fetchSection(["show", "tv", "tv-show"], SECTION_LIMIT));
      setStories(await fetchSection(["story"], SECTION_LIMIT));
      setTalent(await fetchSection(["talent"], SECTION_LIMIT));
      setChallenges(await fetchSection(["challenge"], SECTION_LIMIT));
      setLive(await fetchSection(["live"], SECTION_LIMIT));
    })();
  }, []);

  const card = (item: Row, contentType: string, index: number, base: string) => (
    <ContentCard
      key={item.id}
      content={item}
      contentType={contentType}
      index={index}
      onClick={() => navigate(`/${base}/${item.id}`)}
      onPlay={() => navigate(`/${base}/${item.id}`)}
    />
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold">VYB Cinema</h1>
      <p className="mt-2 text-gray-400">Teen culture hub. Music, shows, stories, talent, challenges, and live.</p>

      {/* Section builder */}
      {[
        { title: "Music", data: music, type: "Music", base: "music" },
        { title: "Shows", data: shows, type: "Shows", base: "shows" },
        { title: "Stories", data: stories, type: "Stories", base: "stories" },
        { title: "Talent", data: talent, type: "Talent", base: "talent" },
        { title: "Challenges", data: challenges, type: "Challenges", base: "challenges" },
        { title: "Live", data: live, type: "Live", base: "live" },
      ].map((sec) => (
        <section key={sec.title} className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">{sec.title}</h2>
            <Button asChild size="sm" variant="ghost" className="text-gray-300 hover:text-white">
              <Link to={`/${sec.base}`}>See all</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sec.data.map((it, i) => card(it, sec.type, i, sec.base))}
            {sec.data.length === 0 && (
              <div className="col-span-full text-gray-400 text-sm">Nothing here yet. Check back soon.</div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
