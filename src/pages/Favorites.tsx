import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("content:content_id(*)")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavorites(data.map((row: any) => row.content));
      }
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
      </main>
      <Footer />
    </div>
  );
}
