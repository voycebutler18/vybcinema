import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { NetflixRow as ContentRow } from "@/components/NetflixRow";
import { NetflixDetailModal } from "@/components/NetflixDetailModal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Live: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [playing, setPlaying] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("content")
          .select("*")
          .eq("content_type", "live") // <- SINGULAR
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContent(data || []);
      } catch (e) {
        console.error(e);
        toast({ title: "Error", description: "Failed to load Live videos.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const onCardClick = (item: any) => { setSelected(item); setShowDetail(true); };
  const onPlay = (item: any) => { setPlaying(item); setShowPlayer(true); setShowDetail(false); };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pb-20 pt-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Live</h1>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
          ) : content.length ? (
            <ContentRow
              title="Latest Live"
              content={content}
              contentType="Live"
              onContentClick={onCardClick}
              onContentPlay={onPlay}
            />
          ) : (
            <p className="text-muted-foreground">No live uploads yet.</p>
          )}
        </div>
      </div>
      <Footer />

      <NetflixDetailModal
        content={selected}
        contentType="Live"
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onPlay={() => selected && onPlay(selected)}
        onDelete={() => {}}
        canDelete={user?.id === selected?.user_id}
      />

      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black">
          {playing && (
            <VideoPlayer
              videoUrl={playing.file_url}
              coverUrl={playing.cover_url}
              trailerUrl={playing.trailer_url}
              title={playing.title}
              description={playing.description}
              genre={playing.genre}
              contentType={playing.content_type}
              streamUrl={playing.stream_url}
              streamStatus={playing.stream_status}
              streamId={playing.stream_id}
              streamThumbnailUrl={playing.stream_thumbnail_url}
              playbackId={playing.playback_id}
              vastTagUrl={playing.vast_tag_url}
              adBreaks={playing.ad_breaks}
              durationSeconds={playing.duration_seconds}
              monetizationEnabled={playing.monetization_enabled}
              contentId={playing.id}
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Live;
