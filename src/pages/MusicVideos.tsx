import React, { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { NetflixRow } from '@/components/NetflixRow';
import { NetflixDetailModal } from '@/components/NetflixDetailModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const MusicVideos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchMusicVideos();
  }, []);

  const fetchMusicVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'music_video')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching music videos:', error);
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
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (fileUrl) {
        // Extract the path from the full URL
        const urlParts = fileUrl.split('/storage/v1/object/public/content-files/');
        if (urlParts[1]) {
          await supabase.storage
            .from('content-files')
            .remove([urlParts[1]]);
        }
      }

      setContent(prev => prev.filter(item => item.id !== id));
      setShowDetailModal(false);
      
      toast({
        title: "Content deleted",
        description: "Music video has been successfully deleted."
      });
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Organize content into categories
  const featuredVideo = content.find(video => video.is_featured) || content[0];
  const recentlyAdded = content.slice(0, 10);
  const popVideos = content.filter(video => video.genre?.toLowerCase().includes('pop'));
  const rockVideos = content.filter(video => video.genre?.toLowerCase().includes('rock'));
  const hipHopVideos = content.filter(video => video.genre?.toLowerCase().includes('hip hop'));
  const myVideos = user ? content.filter(video => video.user_id === user.id) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pb-20 pt-20 relative z-10">
        {recentlyAdded.length > 0 && (
          <NetflixRow
            title="Recently Added Music Videos"
            content={recentlyAdded}
            contentType="Music Video"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {popVideos.length > 0 && (
          <NetflixRow
            title="Pop Music Videos"
            content={popVideos}
            contentType="Music Video"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {rockVideos.length > 0 && (
          <NetflixRow
            title="Rock & Alternative"
            content={rockVideos}
            contentType="Music Video"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {hipHopVideos.length > 0 && (
          <NetflixRow
            title="Hip Hop & R&B"
            content={hipHopVideos}
            contentType="Music Video"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {myVideos.length > 0 && (
          <NetflixRow
            title="My Music Videos"
            content={myVideos}
            contentType="Music Video"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {content.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Music Videos Available</h2>
            <p className="text-muted-foreground">Be the first to upload a music video!</p>
          </div>
        )}
      </div>

      <Footer />

      <NetflixDetailModal
        content={selectedContent}
        contentType="Music Video"
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
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MusicVideos;