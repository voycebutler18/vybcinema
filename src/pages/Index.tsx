import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

type Row = Content & { created_at?: string };

const SECTION_LIMIT = 8;

async function fetchSection(filter:
  | { eq: [string, string] }
  | { in: [string, string[]] },
  limit = SECTION_LIMIT
) {
  let q = supabase
    .from("contents")
    .select("id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if ("eq" in filter) {
    const [col, val] = filter.eq;
    q = q.eq(col, val);
  } else {
    const [col, vals] = filter.in;
    q = q.in(col, vals);
  }

  const { data, error } = await q;
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
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
      setMusic(await fetchSection({ eq: ["content_type", "music"] }));
      setShows(await fetchSection({ in: ["content_type", ["show", "tv", "tv-show"]] }));
      setStories(await fetchSection({ eq: ["content_type", "story"] }));
      setTalent(await fetchSection({ eq: ["content_type", "talent"] }));
      setChallenges(await fetchSection({ eq: ["content_type", "challenge"] }));
      setLive(await fetchSection({ eq: ["content_type", "live"] }));
    })();
  }, []);

  const allCounts =
    music.length + shows.length + stories.length + talent.length + challenges.length + live.length;

  const renderSection = (
    title: string,
    data: Row[],
    typeLabel: string,
    basePath: string
  ) => {
    if (data.length === 0) return null;

    return (
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{title}</h2>
          <Button asChild size="sm" variant="ghost" className="text-gray-300 hover:text-white">
            <Link to={`/${basePath}`}>See all</Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((it, i) => (
            <ContentCard
              key={it.id}
              content={it}
              contentType={typeLabel}
              index={i}
              onClick={() => navigate(`/${basePath}/${it.id}`)}
              onPlay={() => navigate(`/${basePath}/${it.id}`)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold">VYB Cinema</h1>
        <p className="mt-2 text-gray-400">
          Teen culture hub. Music, shows, stories, talent, challenges, and live.
        </p>
      </header>

      {/* If everything is empty, show a friendly hero instead of blank sections */}
      {allCounts === 0 && (
        <div className="mt-8 rounded-2xl bg-white/5 p-6">
          <p className="text-gray-300">
            New drops are coming soon. Check back for Music, Shows, and Stories.
          </p>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link to="/create">Create</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/music">Explore Music</Link>
            </Button>
          </div>
        </div>
      )}

      {renderSection("Music", music, "Music", "music")}
      {renderSection("Shows", shows, "Shows", "shows")}
      {renderSection("Stories", stories, "Stories", "stories")}
      {renderSection("Talent", talent, "Talent", "talent")}
      {renderSection("Challenges", challenges, "Challenges", "challenges")}
      {renderSection("Live", live, "Live", "live")}
    </div>
  );
}
