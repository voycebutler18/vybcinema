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

const Podcasts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'podcast')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
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
        description: "Podcast has been successfully deleted."
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
  const featuredPodcast = content.find(podcast => podcast.is_featured) || content[0];
  const recentlyAdded = content.slice(0, 10);
  const businessPodcasts = content.filter(podcast => podcast.genre?.toLowerCase().includes('business'));
  const techPodcasts = content.filter(podcast => podcast.genre?.toLowerCase().includes('technology'));
  const comedyPodcasts = content.filter(podcast => podcast.genre?.toLowerCase().includes('comedy'));
  const myPodcasts = user ? content.filter(podcast => podcast.user_id === user.id) : [];

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
            title="Recently Added Podcasts"
            content={recentlyAdded}
            contentType="Podcast"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {businessPodcasts.length > 0 && (
          <NetflixRow
            title="Business & Entrepreneurship"
            content={businessPodcasts}
            contentType="Podcast"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {techPodcasts.length > 0 && (
          <NetflixRow
            title="Technology & Science"
            content={techPodcasts}
            contentType="Podcast"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {comedyPodcasts.length > 0 && (
          <NetflixRow
            title="Comedy Podcasts"
            content={comedyPodcasts}
            contentType="Podcast"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {myPodcasts.length > 0 && (
          <NetflixRow
            title="My Podcasts"
            content={myPodcasts}
            contentType="Podcast"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {content.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Podcasts Available</h2>
            <p className="text-muted-foreground">Be the first to upload a podcast!</p>
          </div>
        )}
      </div>

      <Footer />

      <NetflixDetailModal
        content={selectedContent}
        contentType="Podcast"
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
              contentType="Podcast"
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Podcasts;