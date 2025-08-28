import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";

export interface Content {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  cover_url?: string;
  file_url?: string;
  trailer_url?: string;
  content_type?: string;
  thumbnail_url?: string;
  stream_url?: string;
  stream_status?: string;
  stream_id?: string;
  stream_thumbnail_url?: string;
  playback_id?: string;
  vast_tag_url?: string;
  ad_breaks?: number[];
  duration_seconds?: number;
  monetization_enabled?: boolean;
}

type FavoriteRow = {
  id?: number;
  user_id: string;
  content_id: string;
  created_at?: string;
  // joined object from content table
  content: Content | null;
};

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Join favorites → content via content_id
        const { data, error } = await supabase
          .from("favorites")
          .select("id, created_at, content:content_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Favorites query error:", error);
          setFavorites([]);
          setLoading(false);
          return;
        }

        const rows = (data as FavoriteRow[]) || [];
        const joinedContent = rows
          .map((r) => r.content)
          .filter((c): c is Content => !!c);

        setFavorites(joinedContent);
      } catch (err) {
        console.error("Favorites fetch failed:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (contentId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("content_id", contentId);

    if (error) {
      console.error("Remove favorite error:", error);
      return;
    }
    setFavorites((prev) => prev.filter((c) => c.id !== contentId));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-28 pb-16">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Please log in to view your favorites.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-card/60 animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-lg mb-2">
              You haven't added any favorites yet.
            </p>
            <p className="text-muted-foreground text-sm">
              Browse content and click the + button to add favorites.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((content) => (
              <div key={content.id} className="relative group">
                <ContentCard
                  content={content}
                  contentType={content.content_type || "Content"}
                  index={0}
                  onClick={() => {}}
                  onPlay={() => {}}
                />
                <button
                  onClick={() => removeFavorite(content.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20"
                  title="Remove from favorites"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
