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

const Stories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'story')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
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
        description: "Story has been successfully deleted."
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
  const featuredStory = content.find(story => story.is_featured) || content[0];
  const recentlyAdded = content.slice(0, 10);
  const dramaStories = content.filter(story => story.genre?.toLowerCase().includes('drama'));
  const comedyStories = content.filter(story => story.genre?.toLowerCase().includes('comedy'));
  const mysteryStories = content.filter(story => story.genre?.toLowerCase().includes('mystery'));
  const myStories = user ? content.filter(story => story.user_id === user.id) : [];

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
            title="Recently Added Stories"
            content={recentlyAdded}
            contentType="Story"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {dramaStories.length > 0 && (
          <NetflixRow
            title="Drama Stories"
            content={dramaStories}
            contentType="Story"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {comedyStories.length > 0 && (
          <NetflixRow
            title="Comedy Stories"
            content={comedyStories}
            contentType="Story"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {mysteryStories.length > 0 && (
          <NetflixRow
            title="Mystery & Thriller Stories"
            content={mysteryStories}
            contentType="Story"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {myStories.length > 0 && (
          <NetflixRow
            title="My Stories"
            content={myStories}
            contentType="Story"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {content.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Stories Available</h2>
            <p className="text-muted-foreground">Be the first to upload a story!</p>
          </div>
        )}
      </div>

      <Footer />

      <NetflixDetailModal
        content={selectedContent}
        contentType="Story"
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
              contentType="Story"
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stories;