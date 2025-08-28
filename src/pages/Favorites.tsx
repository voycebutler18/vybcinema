import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard, type Content } from "@/components/ContentCard";

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

      // Try relation join first (requires FK)
      const { data: joined, error: joinError } = await supabase
        .from("favorites")
        .select("content:content_id(*)")
        .eq("user_id", user.id);

      if (!joinError && joined) {
        const contents = (joined as any[])
          .map((r) => r.content)
          .filter(Boolean) as Content[];

        if (contents.length > 0) {
          setFavorites(contents);
          setLoading(false);
          return;
        }
      }

      // Fallback: 2-step fetch if no FK/relation
      const { data: favRows, error: favErr } = await supabase
        .from("favorites")
        .select("content_id")
        .eq("user_id", user.id);

      if (favErr || !favRows || favRows.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const ids = favRows.map((r: any) => r.content_id);
      const { data: contents, error: contentErr } = await supabase
        .from("content")
        .select("*")
        .in("id", ids);

      if (contentErr || !contents) {
        setFavorites([]);
      } else {
        setFavorites(contents as Content[]);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return <p className="p-6">Please log in to view your favorites.</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-card/60 animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">You haven’t added any favorites yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((c) => (
              <ContentCard
                key={c.id}
                content={c}
                contentType={c.content_type ?? "content"}
                index={0}
                onClick={() => {}}
                onPlay={() => {}}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
