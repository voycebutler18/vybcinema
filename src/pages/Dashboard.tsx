import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Film, Tv, BookOpen, Edit, Trash2, Plus, DollarSign } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AdMonetizationManager } from "@/components/AdMonetizationManager";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  genre?: string;
  is_featured: boolean;
  created_at: string;
  file_url?: string;
  thumbnail_url?: string;
  cover_url?: string;
  stream_url?: string;
  stream_status?: string;
  stream_id?: string;
  stream_thumbnail_url?: string;
  playback_id?: string;
  // Ad monetization fields
  vast_tag_url?: string;
  ad_breaks?: number[];
  duration_seconds?: number;
  monetization_enabled?: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchUserContent();
    }
  }, [user, loading, navigate]);

  const fetchUserContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched content:', data);
      setContent(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your content",
        variant: "destructive"
      });
    } finally {
      setLoadingContent(false);
    }
  };

  // Auto-refresh content every 10 seconds to check for ready videos
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchUserContent();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="h-5 w-5" />;
      case 'tv_show': return <Tv className="h-5 w-5" />;
      case 'story': return <BookOpen className="h-5 w-5" />;
      default: return <Upload className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Movie';
      case 'tv_show': return 'TV Show';
      case 'story': return 'Short Story';
      default: return type;
    }
  };

  const navigateToUpload = (type: string) => {
    navigate(`/upload?type=${type}`);
  };

  const deleteContent = async (contentId: string, fileUrl?: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);

      if (dbError) throw dbError;

      // Delete file from storage if exists
      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('content-files')
            .remove([`content/${fileName}`]);
        }
      }

      // Update local state
      setContent(prev => prev.filter(item => item.id !== contentId));
      
      toast({
        title: "Content Deleted",
        description: "Your content has been permanently removed."
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Your Dashboard</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your uploaded content and create new uploads
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Quick Upload Section */}
              <div className="cinema-card p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Quick Upload</h2>
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button 
                    onClick={() => navigateToUpload('movie')}
                    className="btn-secondary h-20 flex-col space-y-2"
                  >
                    <Film className="h-6 w-6" />
                    <span className="text-sm">Upload Movie</span>
                  </Button>
                  <Button 
                    onClick={() => navigateToUpload('tv_show')}
                    className="btn-secondary h-20 flex-col space-y-2"
                  >
                    <Tv className="h-6 w-6" />
                    <span className="text-sm">Upload TV Show</span>
                  </Button>
                  <Button 
                    onClick={() => navigateToUpload('story')}
                    className="btn-secondary h-20 flex-col space-y-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Upload Short Story</span>
                  </Button>
                </div>
              </div>

              {/* Your Content Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-foreground">Your Content</h2>
                  <div className="text-sm text-muted-foreground">
                    {content.length} {content.length === 1 ? 'item' : 'items'}
                  </div>
                </div>

                {loadingContent ? (
                  <div className="cinema-card p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your content...</p>
                  </div>
                ) : content.length === 0 ? (
                  <div className="cinema-card p-12 text-center">
                    <Upload className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">No Content Yet</h3>
                    <p className="text-muted-foreground mb-8">
                      Start uploading your movies, TV shows, and short stories to see them here.
                    </p>
                    <Button onClick={() => navigate('/upload')} className="btn-hero">
                      <Plus className="h-5 w-5 mr-2" />
                      Upload Your First Content
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item) => (
                      <VideoPlayer
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        contentType={item.content_type}
                        genre={item.genre}
                        videoUrl={item.file_url}
                        coverUrl={item.cover_url}
                        streamUrl={item.stream_url}
                        streamStatus={item.stream_status}
                        streamId={item.stream_id}
                        streamThumbnailUrl={item.stream_thumbnail_url}
                    playbackId={item.playback_id}
                    vastTagUrl={item.vast_tag_url}
                    adBreaks={item.ad_breaks || [0]}
                    durationSeconds={item.duration_seconds}
                    monetizationEnabled={item.monetization_enabled}
                    contentId={item.id}
                        canDelete={true}
                        onDelete={() => deleteContent(item.id, item.file_url)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Ad Monetization Section */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <h2 className="text-3xl font-bold text-foreground">Ad Monetization</h2>
                </div>
                <AdMonetizationManager />
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;