import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

type Row = Content & { created_at?: string };

const LIMIT = 8;

/** Broader helpers so we match existing data */
const MUSIC_TYPES = ["music", "song", "track", "audio", "video-music"];
const SHOW_TYPES = ["show", "tv", "tv-show", "series", "movie"]; // include movie so old data appears
const STORY_TYPES = ["story", "short", "short-story", "storytime"];
const TALENT_TYPES = ["talent", "performance", "skills"];
const CHALLENGE_TYPES = ["challenge", "trend"];
const LIVE_TYPES = ["live", "stream"];

async function fetchTypes(types: string[]) {
  const { data, error } = await supabase
    .from("contents")
    .select("id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at")
    .in("content_type", types)
    .order("created_at", { ascending: false })
    .limit(LIMIT);

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
      setMusic(await fetchTypes(MUSIC_TYPES));
      setShows(await fetchTypes(SHOW_TYPES));
      setStories(await fetchTypes(STORY_TYPES));
      setTalent(await fetchTypes(TALENT_TYPES));
      setChallenges(await fetchTypes(CHALLENGE_TYPES));
      setLive(await fetchTypes(LIVE_TYPES));
    })();
  }, []);

  const renderSection = (
    title: string,
    data: Row[],
    typeLabel: string,
    basePath: string
  ) => (
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

        {/* If a section is temporarily empty, just show nothing (no big warning). */}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold">VYB Cinema</h1>
        <p className="mt-2 text-gray-400">
          Teen culture hub. Music, shows, stories, talent, challenges, and live.
        </p>
      </header>

      {renderSection("Music", music, "Music", "music")}
      {renderSection("Shows", shows, "Shows", "shows")}
      {renderSection("Stories", stories, "Stories", "stories")}
      {renderSection("Talent", talent, "Talent", "talent")}
      {renderSection("Challenges", challenges, "Challenges", "challenges")}
      {renderSection("Live", live, "Live", "live")}
    </div>
  );
}
