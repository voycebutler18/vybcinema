import React, { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentRow } from '@/components/NetflixRow';
import { NetflixDetailModal } from '@/components/NetflixDetailModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Movies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'movie')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
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
      // Delete from database
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete file from storage if exists
      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('content-files')
            .remove([`main/${fileName}`]);
        }
      }

      // Update local state
      setContent(prev => prev.filter(item => item.id !== id));
      setShowDetailModal(false);
      
      toast({
        title: "Content deleted",
        description: "Movie has been successfully deleted."
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
  const featuredMovie = content.find(movie => movie.is_featured) || content[0];
  const recentlyAdded = content.slice(0, 10);
  const actionMovies = content.filter(movie => movie.genre?.toLowerCase().includes('action'));
  const dramaMovies = content.filter(movie => movie.genre?.toLowerCase().includes('drama'));
  const comedyMovies = content.filter(movie => movie.genre?.toLowerCase().includes('comedy'));
  const myMovies = user ? content.filter(movie => movie.user_id === user.id) : [];

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
          <ContentRow
            title="Recently Added Movies"
            content={recentlyAdded}
            contentType="Movie"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {actionMovies.length > 0 && (
          <ContentRow
            title="Action Movies"
            content={actionMovies}
            contentType="Movie"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {dramaMovies.length > 0 && (
          <ContentRow
            title="Drama Movies"
            content={dramaMovies}
            contentType="Movie"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {comedyMovies.length > 0 && (
          <ContentRow
            title="Comedy Movies"
            content={comedyMovies}
            contentType="Movie"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {myMovies.length > 0 && (
          <ContentRow
            title="My Movies"
            content={myMovies}
            contentType="Movie"
            onContentClick={handleContentClick}
            onContentPlay={handlePlay}
          />
        )}

        {content.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Movies Available</h2>
            <p className="text-muted-foreground">Be the first to upload a movie!</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Detail Modal */}
      <NetflixDetailModal
        content={selectedContent}
        contentType="Movie"
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onPlay={() => selectedContent && handlePlay(selectedContent)}
        onDelete={() => selectedContent && deleteContent(selectedContent.id, selectedContent.file_url)}
        canDelete={user?.id === selectedContent?.user_id}
      />

      {/* Video Player */}
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
              contentType="Movie"
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Movies;