import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Film, Tv, Music, BookOpen, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string; // Changed from strict union to string
  genre?: string;
  is_featured: boolean;
  created_at: string;
  file_url?: string;
  thumbnail_url?: string;
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

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="h-5 w-5" />;
      case 'tv_show': return <Tv className="h-5 w-5" />;
      case 'music_video': return <Music className="h-5 w-5" />;
      case 'story': return <BookOpen className="h-5 w-5" />;
      default: return <Upload className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Movie';
      case 'tv_show': return 'TV Show';
      case 'music_video': return 'Music Video';
      case 'story': return 'Story';
      default: return type;
    }
  };

  const navigateToUpload = (type: string) => {
    switch (type) {
      case 'movie': 
        navigate('/movies');
        break;
      case 'tv_show':
        navigate('/tv-shows');
        break;
      case 'music_video':
        navigate('/music-videos');
        break;
      case 'story':
        navigate('/stories');
        break;
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
                <div className="grid md:grid-cols-4 gap-6">
                  <Button 
                    onClick={() => navigateToUpload('movie')}
                    className="btn-secondary h-24 flex-col space-y-2"
                  >
                    <Film className="h-8 w-8" />
                    <span>Upload Movie</span>
                  </Button>
                  <Button 
                    onClick={() => navigateToUpload('tv_show')}
                    className="btn-secondary h-24 flex-col space-y-2"
                  >
                    <Tv className="h-8 w-8" />
                    <span>Upload TV Show</span>
                  </Button>
                  <Button 
                    onClick={() => navigateToUpload('music_video')}
                    className="btn-secondary h-24 flex-col space-y-2"
                  >
                    <Music className="h-8 w-8" />
                    <span>Upload Music Video</span>
                  </Button>
                  <Button 
                    onClick={() => navigateToUpload('story')}
                    className="btn-secondary h-24 flex-col space-y-2"
                  >
                    <BookOpen className="h-8 w-8" />
                    <span>Upload Story</span>
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
                      Start uploading your movies, TV shows, music videos, and stories to see them here.
                    </p>
                    <Button onClick={() => navigate('/movies')} className="btn-hero">
                      <Plus className="h-5 w-5 mr-2" />
                      Upload Your First Content
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item) => (
                      <Card key={item.id} className="cinema-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getContentIcon(item.content_type)}
                              <Badge variant="secondary">
                                {getContentTypeLabel(item.content_type)}
                              </Badge>
                            </div>
                            {item.is_featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {item.description || 'No description provided'}
                          </p>
                          {item.genre && (
                            <p className="text-xs text-muted-foreground mb-3">
                              Genre: {item.genre}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mb-4">
                            Uploaded: {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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