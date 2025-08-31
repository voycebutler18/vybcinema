import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentRow } from "@/components/NetflixRow";
import { NetflixDetailModal } from "@/components/NetflixDetailModal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Shows = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
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
        .in("content_type", ["tv_show", "show", "series"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (item: any) => {
    setSelectedContent(item);
    setShowDetailModal(true);
  };

  const handlePlay = (item: any) => {
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

      setContent((prev) => prev.filter((i) => i.id !== id));
      setShowDetailModal(false);
      toast({ title: "Content deleted", description: "Show removed." });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const recentlyAdded = content.slice(0, 10);
  const drama = content.filter((c) => c.genre?.toLowerCase().includes("drama"));
  const comedy = content.filter((c) => c.genre?.toLowerCase().includes("comedy"));
  const scifi = content.filter((c) => c.genre?.toLowerCase().includes("sci"));
  const myShows = user ? content.filter((c) => c.user_id === user.id) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pb-20 pt-20 relative z-10">
        {recentlyAdded.length > 0 && (
          <ContentRow
            title="Recently Added Shows"
            content={recentlyAdded}
            contentType="TV Show"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {drama.length > 0 && (
          <ContentRow
            title="Drama"
            content={drama}
            contentType="TV Show"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {comedy.length > 0 && (
          <ContentRow
            title="Comedy"
            content={comedy}
            contentType="TV Show"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {scifi.length > 0 && (
          <ContentRow
            title="Sci-Fi & Fantasy"
            content={scifi}
            contentType="TV Show"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {myShows.length > 0 && (
          <ContentRow
            title="My Shows"
            content={myShows}
            contentType="TV Show"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {content.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Shows Yet</h2>
            <p className="text-muted-foreground">Upload your first show or series.</p>
          </div>
        )}
      </div>

      <Footer />

      <NetflixDetailModal
        content={selectedContent}
        contentType="TV Show"
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onPlay={() => selectedContent && handlePlay(selectedContent)}
        onDelete={() => selectedContent && deleteContent(selectedContent.id, selectedContent.file_url)}
        canDelete={user?.id === selectedContent?.user_id}
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
              streamUrl={playingContent.stream_url}
              streamStatus={playingContent.stream_status}
              streamId={playingContent.stream_id}
              streamThumbnailUrl={playingContent.stream_thumbnail_url}
              playbackId={playingContent.playback_id}
              vastTagUrl={playingContent.vast_tag_url}
              adBreaks={playingContent.ad_breaks}
              durationSeconds={playingContent.duration_seconds}
              monetizationEnabled={playingContent.monetization_enabled}
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
