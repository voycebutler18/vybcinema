import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { NetflixDetailModal } from "@/components/NetflixDetailModal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContentCard, type Content } from "@/components/ContentCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Shows = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .or("content_type.eq.tv_show,genre.ilike.%show%")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent((data as Content[]) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (item: Content) => {
    // Route directly to the watch page
    navigate(`/watch/${item.id}`);
  };

  const handlePlay = (item: Content) => {
    // Route directly to the watch page
    navigate(`/watch/${item.id}`);
  };

  const deleteContent = async (id: string, fileUrl?: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;

      if (fileUrl) {
        const parts = fileUrl.split("/storage/v1/object/public/content-files/");
        if (parts[1]) await supabase.storage.from("content-files").remove([parts[1]]);
      }

      setContent((prev) => prev.filter((c) => c.id !== id));
      setShowDetailModal(false);
      toast({ title: "Deleted", description: "Show removed." });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const recentlyAdded = content.slice(0, 12);
  const drama = content.filter((v) => v.genre?.toLowerCase().includes("drama"));
  const comedy = content.filter((v) => v.genre?.toLowerCase().includes("comedy"));
  const reality = content.filter((v) => v.genre?.toLowerCase().includes("reality"));
  const myShows = user ? content.filter((s: any) => s.user_id === user.id) : [];

  const Section = ({ title, items }: { title: string; items: Content[] }) =>
    !items.length ? null : (
      <section className="container mx-auto px-6 mb-12">
        {/* Hide like badge & like/unlike buttons inside cards on this page */}
        <style>{`
          .hide-likes [title$="likes"],
          .hide-likes button[title="Like"],
          .hide-likes button[title="Unlike"] {
            display: none !important;
          }
        `}</style>

        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
        <div className="hide-likes grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <ContentCard
              key={c.id}
              content={c}
              contentType="Show"
              index={i % 4}
              onClick={() => handleContentClick(c)}  // -> /watch/:id
              onPlay={() => handlePlay(c)}          // -> /watch/:id
            />
          ))}
        </div>
      </section>
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-28 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Recently Added Shows</h2>
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
        <Section title="Recently Added Shows" items={recentlyAdded} />
        <Section title="Drama Series" items={drama} />
        <Section title="Comedy Series" items={comedy} />
        <Section title="Reality & Unscripted" items={reality} />
        <Section title="My Shows" items={myShows as Content[]} />

        {!content.length && (
          <div className="container mx-auto px-6">
            <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold">No Shows Yet</h2>
              <p className="text-muted-foreground">Be the first to upload a show!</p>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Keeping modal/player intact; clicks now route to /watch/:id */}
      <NetflixDetailModal
        content={selectedContent as any}
        contentType="Show"
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
              trailerUrl={(playingContent as any).trailer_url}
              title={playingContent.title}
              description={playingContent.description}
              genre={playingContent.genre}
              contentType={playingContent.content_type}
              streamUrl={(playingContent as any).stream_url}
              streamStatus={(playingContent as any).stream_status}
              streamId={(playingContent as any).stream_id}
              streamThumbnailUrl={(playingContent as any).stream_thumbnail_url}
              playbackId={(playingContent as any).playback_id}
              contentId={playingContent.id}
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shows;
