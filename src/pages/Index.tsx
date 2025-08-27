import React, { useState, useEffect } from 'react';
import { NetflixNavigation } from '@/components/NetflixNavigation';
import { NetflixHero } from '@/components/NetflixHero';
import { NetflixRow } from '@/components/NetflixRow';
import { NetflixDetailModal } from '@/components/NetflixDetailModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allContent, setAllContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [playingContent, setPlayingContent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
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
      const { error } = await supabase.from('content').delete().eq('id', id);
      if (error) throw error;
      setAllContent(prev => prev.filter(item => item.id !== id));
      setShowDetailModal(false);
      toast({ title: "Content deleted", description: "Content has been successfully deleted." });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const featuredContent = allContent.find(item => item.is_featured) || allContent[0];
  const recentlyAdded = allContent.slice(0, 12);
  const movies = allContent.filter(item => item.content_type === 'movie');
  const tvShows = allContent.filter(item => item.content_type === 'tv_show');
  const musicVideos = allContent.filter(item => item.content_type === 'music_video');

  const getContentTypeDisplayName = (contentType: string) => {
    switch (contentType) {
      case 'tv_show': return 'TV Show';
      case 'music_video': return 'Music Video';
      default: return contentType.charAt(0).toUpperCase() + contentType.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NetflixNavigation />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NetflixNavigation />
      <NetflixHero
        content={featuredContent}
        contentType={featuredContent ? getContentTypeDisplayName(featuredContent.content_type) : 'Content'}
        onPlay={() => featuredContent && handlePlay(featuredContent)}
        onMoreInfo={() => featuredContent && handleContentClick(featuredContent)}
      />
      <div className="pb-20 -mt-32 relative z-10">
        {recentlyAdded.length > 0 && (
          <NetflixRow title="Trending Now" content={recentlyAdded} contentType="Mixed" onContentClick={handleContentClick} onContentPlay={handlePlay} />
        )}
        {movies.length > 0 && (
          <NetflixRow title="Movies" content={movies.slice(0, 10)} contentType="Movie" onContentClick={handleContentClick} onContentPlay={handlePlay} />
        )}
        {tvShows.length > 0 && (
          <NetflixRow title="TV Shows" content={tvShows.slice(0, 10)} contentType="TV Show" onContentClick={handleContentClick} onContentPlay={handlePlay} />
        )}
        {musicVideos.length > 0 && (
          <NetflixRow title="Music Videos" content={musicVideos.slice(0, 10)} contentType="Music Video" onContentClick={handleContentClick} onContentPlay={handlePlay} />
        )}
      </div>
      <NetflixDetailModal
        content={selectedContent}
        contentType={selectedContent ? getContentTypeDisplayName(selectedContent.content_type) : 'Content'}
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
              contentType={getContentTypeDisplayName(playingContent.content_type)}
              canDelete={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;