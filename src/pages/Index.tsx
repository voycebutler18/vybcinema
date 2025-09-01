import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContentCard, Content } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";

type Row = Content & { created_at?: string };

const SECTION_LIMIT = 8;
const API_URL = import.meta.env.VITE_SUPABASE_URL as string; // e.g. https://xxxx.supabase.co
const API_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string);

// IMPORTANT: your DB table is singular
const REST_TABLE = "content";

function buildInFilter(values: string[]) {
  // -> in.("music","tv","tv-show")
  const quoted = values.map((v) => `"${v}"`).join(",");
  return `in.(${quoted})`;
}

async function fetchSection(contentTypes: string[], limit: number): Promise<Row[]> {
  if (!API_URL || !API_KEY) {
    console.warn("[Index] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY/ANON_KEY");
    return [];
  }

  const params = new URLSearchParams({
    select:
      "id,title,description,genre,cover_url,file_url,trailer_url,preview_url,content_type,created_at",
    order: "created_at.desc",
    limit: String(limit),
    content_type: buildInFilter(contentTypes),
  });

  const url = `${API_URL}/rest/v1/${REST_TABLE}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Index] REST error", res.status, text);
    return [];
  }

  return (await res.json()) as Row[];
}

export default function Index() {
  const [music, setMusic] = useState<Row[]>([]);
  const [shows, setShows] = useState<Row[]>([]);
  const [stories, setStories] = useState<Row[]>([]);
  const [talent, setTalent] = useState<Row[]>([]);
  const [challenges, setChallenges] = useState<Row[]>([]);
  const [live, setLive] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setMusic(await fetchSection(["music"], SECTION_LIMIT));
      setShows(await fetchSection(["show", "tv", "tv-show"], SECTION_LIMIT));
      setStories(await fetchSection(["story"], SECTION_LIMIT));
      setTalent(await fetchSection(["talent"], SECTION_LIMIT));
      setChallenges(await fetchSection(["challenge"], SECTION_LIMIT));
      setLive(await fetchSection(["live"], SECTION_LIMIT));
      setIsLoading(false);
    })();
  }, []);

  const sections = [
    { title: "Music", data: music, type: "Music", base: "music" },
    { title: "Shows", data: shows, type: "Shows", base: "shows" },
    { title: "Stories", data: stories, type: "Stories", base: "stories" },
    { title: "Talent", data: talent, type: "Talent", base: "talent" },
    { title: "Challenges", data: challenges, type: "Challenges", base: "challenges" },
    { title: "Live", data: live, type: "Live", base: "live" },
  ];

  const hasContent = sections.some(sec => sec.data.length > 0);

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

  // Show hero landing page if no content exists
  if (!isLoading && !hasContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-pink-400">VYB Cinema</h1>
            <span className="bg-purple-600 text-xs px-2 py-1 rounded-full">TEENS 13-19</span>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-pink-400 transition-colors">Home</Link>
              <Link to="/music" className="hover:text-pink-400 transition-colors">Music</Link>
              <Link to="/shows" className="hover:text-pink-400 transition-colors">Shows</Link>
              <Link to="/stories" className="hover:text-pink-400 transition-colors">Stories</Link>
              <Link to="/talent" className="hover:text-pink-400 transition-colors">Talent</Link>
              <Link to="/challenges" className="hover:text-pink-400 transition-colors">Challenges</Link>
              <Link to="/live" className="hover:text-pink-400 transition-colors">Live</Link>
            </nav>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              Create
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-600/30 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-300">✨</span>
              <span className="text-sm">Built for Teens • Ages 13-19</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
                VYB
              </span>
              <br />
              <span className="text-white">Cinema</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-300">
              Stream what <span className="text-purple-400 font-semibold">teens create</span>: music videos, shows, stories & 
              challenges. No boring stuff—just <span className="text-cyan-400 font-semibold">vibes</span>, <span className="text-pink-400 font-semibold">creativity</span>, and a safe 
              space to shine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold"
                onClick={() => navigate("/music")}
              >
                ▶ Watch Something Fire
              </Button>
              <Button 
                variant="outline"
                className="border-purple-400 text-purple-300 hover:bg-purple-600/20 px-8 py-4 rounded-full text-lg font-semibold"
                onClick={() => navigate("/create")}
              >
                ✨ Start Creating
              </Button>
              <Button 
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold"
                onClick={() => navigate("/about")}
              >
                ⓘ What is VYB?
              </Button>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl">
            {sections.map((section) => (
              <Button
                key={section.base}
                variant="ghost"
                className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 hover:border-pink-400/50 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-pink-500/30 text-white px-6 py-4 rounded-xl transition-all duration-300"
                onClick={() => navigate(`/${section.base}`)}
              >
                <span className="text-lg">
                  {section.title === "Music" && "🎵"}
                  {section.title === "Shows" && "📺"}
                  {section.title === "Stories" && "📖"}
                  {section.title === "Talent" && "⭐"}
                  {section.title === "Challenges" && "🏆"}
                  {section.title === "Live" && "🔴"}
                </span>
                <span className="ml-2">{section.title}</span>
              </Button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-col md:flex-row gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-gray-400">Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4K</div>
              <div className="text-gray-400">Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-gray-400">Vibes</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content sections if content exists
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold">VYB Cinema</h1>
      <p className="mt-2 text-gray-400">
        Teen culture hub. Music, shows, stories, talent, challenges, and live.
      </p>

      {sections.map((sec) => (
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
              <div className="col-span-full text-gray-400 text-sm">
                Nothing here yet. Check back soon.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
