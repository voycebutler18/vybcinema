import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";

interface Content {
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
        console.log('Fetching favorites for user ID:', user.id);

        // Direct approach - get favorite content IDs
        const { data: favoriteRows, error: favError } = await supabase
          .from('favorites')
          .select('content_id')
          .eq('user_id', user.id);

        console.log('Favorite rows result:', { favoriteRows, favError });

        if (favError) {
          console.error('Error fetching favorites:', favError);
          setFavorites([]);
          setLoading(false);
          return;
        }

        if (!favoriteRows || favoriteRows.length === 0) {
          console.log('No favorites found');
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Get unique content IDs
        const uniqueIds = [...new Set(favoriteRows.map(row => row.content_id))];
        console.log('Looking for content with IDs:', uniqueIds);

        // Fetch content for these IDs
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .in('id', uniqueIds);

        console.log('Content query result:', { contentData, contentError });

        if (contentError) {
          console.error('Error fetching content:', contentError);
          setFavorites([]);
        } else {
          console.log('Successfully fetched', contentData?.length || 0, 'favorite items');
          setFavorites(contentData || []);
        }

      } catch (error) {
        console.error('Unexpected error:', error);
        setFavorites([]);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (contentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId);

      if (!error) {
        setFavorites(prev => prev.filter(item => item.id !== contentId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-28 pb-16">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Please log in to view your favorites.</p>
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
                  onClick={() => {
                    // Handle more info/details
                    console.log('More info clicked for:', content.title);
                  }}
                  onPlay={() => {
                    // Handle play action
                    console.log('Play clicked for:', content.title);
                  }}
                />
                {/* Remove from favorites button */}
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
