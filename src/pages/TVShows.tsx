import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard, type Content } from "@/components/ContentCard";
import { NetflixDetailModal } from "@/components/NetflixDetailModal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const TVShows = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchTVShows();
  }, []);

  const fetchTVShows = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("content_type", "tv_show")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent((data as Content[]) || []);
    } catch (err) {
      console.error("Error fetching TV shows:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (item: Content) => {
    setSelectedContent(item);
    setShowDetailModal(true);
  };

  const handlePlay = (item: Content) => {
    setPlayingContent(item);
    setShowVideoPlayer(true);
    setShowDetailModal(false);
  };

  const deleteContent = async (id: string, fileUrl?: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;

      if (fileUrl) {
        const parts = fileUrl.split("/storage/v1/object/public/content-files/");
        if (parts[1]) {
          await supabase.storage.from("content-files").remove([parts[1]]);
        }
      }

      setContent((prev) => prev.filter((c) => c.id !== id));
      setShowDetailModal(false);

      toast({
        title: "Content deleted",
        description: "TV show has been successfully deleted.",
      });
    } catch (err: any) {
      console.error("Error deleting content:", err);
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Sections for grid layout
  const recentlyAdded = content.slice(0, 12);
  const dramaShows = content.filter((s) =>
    s.genre?.toLowerCase().includes("drama")
  );
  const comedyShows = content.filter((s) =>
    s.genre?.toLowerCase().includes("comedy")
  );
  const sciFiShows = content.filter((s) =>
    s.genre?.toLowerCase().includes("sci")
  );
  const myShows = user ? (content as any[]).filter((s) => s.user_id === user.id) : [];

  const SectionGrid = ({
    title,
    items,
  }: {
    title: string;
    items: Content[];
  }) => {
    if (!items.length) return null;
    return (
      <section className="container mx-auto px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <ContentCard
              key={c.id}
              content={c}
              contentType="TV Show"
              index={i % 4}
              onClick={() => handleContentClick(c)}
              onPlay={() => handlePlay(c)}
            />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-28 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Recently Added TV Shows
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-card/60 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        {recentlyAdded.length > 0 && (
          <SectionGrid title="Recently Added TV Shows" items={recentlyAdded} />
        )}
        {dramaShows.length > 0 && (
          <SectionGrid title="Drama Series" items={dramaShows} />
        )}
        {comedyShows.length > 0 && (
          <SectionGrid title="Comedy Shows" items={comedyShows} />
        )}
        {sciFiShows.length > 0 && (
          <SectionGrid title="Sci-Fi & Fantasy" items={sciFiShows} />
        )}
        {myShows.length > 0 && (
          <SectionGrid title="My TV Shows" items={myShows as Content[]} />
        )}

        {content.length === 0 && (
          <div className="container mx-auto px-6">
            <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No TV Shows Available
              </h2>
              <p className="text-muted-foreground">
                Be the first to upload a TV show!
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <NetflixDetailModal
        content={selectedContent as any}
        contentType="TV Show"
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onPlay={() => selectedContent && handlePlay(selectedContent)}
        onDelete={() =>
          selectedContent &&
          deleteContent((selectedContent as any).id, (selectedContent as any).file_url)
        }
        canDelete={(user?.id ?? "") === ((selectedContent as any)?.user_id ?? "")}
      />

      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black">
          {playingContent && (
            <VideoPlayer
              videoUrl={playingContent.file_url}
              coverUrl={playingContent.cover_url}
              trailerUrl={playingContent.trailer_url}
              title={playingContent.title}
              description={playingContent.description}
              genre={playingContent.genre}
              contentType={playingContent.content_type}
              streamUrl={(playingContent as any).stream_url}
              streamStatus={(playingContent as any).stream_status}
              streamId={(playingContent as any).stream_id}
              streamThumbnailUrl={(playingContent as any).stream_thumbnail_url}
              playbackId={(playingContent as any).playback_id}
              vastTagUrl={(playingContent as any).vast_tag_url}
              adBreaks={(playingContent as any).ad_breaks}
              durationSeconds={(playingContent as any).duration_seconds}
              monetizationEnabled={(playingContent as any).monetization_enabled}
              contentId={playingContent.id}
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TVShows;
