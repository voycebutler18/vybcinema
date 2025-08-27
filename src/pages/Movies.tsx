import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Film, Play, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { VideoPlayer } from "@/components/VideoPlayer";

const Movies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    fileUrl: '',
    fileName: '',
    coverUrl: '',
    trailerUrl: ''
  });

  const movieGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller',
    'Sci-Fi', 'Fantasy', 'Mystery', 'Crime', 'Documentary', 'Animation',
    'Family', 'Western', 'War', 'Biography', 'Musical', 'Historical'
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUploaded = (url: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      fileUrl: url,
      fileName: fileName
    }));
  };

  const handleCoverUploaded = (url: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      coverUrl: url
    }));
  };

  const handleTrailerUploaded = (url: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      trailerUrl: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.fileUrl) {
      toast({
        title: "Upload Required",
        description: "Please upload a movie file before submitting.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          content_type: 'movie',
          genre: formData.genre,
          file_url: formData.fileUrl,
          cover_url: formData.coverUrl || null,
          trailer_url: formData.trailerUrl || null
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your movie has been uploaded successfully."
      });

      setFormData({ 
        title: '', 
        description: '', 
        genre: '', 
        fileUrl: '', 
        fileName: '', 
        coverUrl: '', 
        trailerUrl: '' 
      });
      fetchMovies();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteContent = async (contentId: string, fileUrl?: string) => {
    try {
      const { error: dbError } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);

      if (dbError) throw dbError;

      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('content-files')
            .remove([`content/${fileName}`]);
        }
      }

      setContent(prev => prev.filter(item => item.id !== contentId));
      
      toast({
        title: "Content Deleted",
        description: "Your movie has been permanently removed."
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Movies</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Independent films and cinematic experiences
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Upload Section - Protected */}
              {user ? (
                <div className="cinema-card p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Upload className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">Upload Your Movie</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="main" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="main">Main Video</TabsTrigger>
                        <TabsTrigger value="cover">Cover Image</TabsTrigger>
                        <TabsTrigger value="trailer">Trailer</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="main" className="mt-6">
                        <FileUpload
                          onFileUploaded={handleFileUploaded}
                          acceptedTypes=".mp4,.mov,.avi,.wmv,.flv,.webm,.mkv,.m4v,.3gp,.mpg,.mpeg,.ogv,.ts,.mts,.m2ts,.vob,video/*"
                          maxSizeMB={500}
                          label="Movie File"
                          uploadType="main"
                        />
                      </TabsContent>
                      
                      <TabsContent value="cover" className="mt-6">
                        <FileUpload
                          onFileUploaded={handleCoverUploaded}
                          acceptedTypes="image/*,.jpg,.jpeg,.png,.webp"
                          maxSizeMB={10}
                          label="Cover Image (Optional)"
                          uploadType="cover"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Upload a cover image to display as the movie thumbnail
                        </p>
                      </TabsContent>
                      
                      <TabsContent value="trailer" className="mt-6">
                        <FileUpload
                          onFileUploaded={handleTrailerUploaded}
                          acceptedTypes=".mp4,.mov,.avi,.wmv,.flv,.webm,.mkv,.m4v,.3gp,.mpg,.mpeg,.ogv,.ts,.mts,.m2ts,.vob,video/*"
                          maxSizeMB={100}
                          label="Trailer Video (Optional)"
                          uploadType="trailer"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Upload a short trailer to preview your movie
                        </p>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Movie Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter movie title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="genre">Genre</Label>
                        <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border z-50">
                            {movieGenres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your movie..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" disabled={uploading} className="btn-hero">
                      {uploading ? "Uploading..." : "Upload Movie"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="cinema-card p-8 text-center">
                  <Upload className="h-16 w-16 mx-auto text-primary/50 mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">Want to Upload?</h2>
                  <p className="text-muted-foreground mb-6">
                    Sign up to share your movies with the VYB Cinema community
                  </p>
                  <div className="space-x-4">
                    <Button className="btn-hero" onClick={() => navigate('/signup')}>
                      Sign Up
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Login
                    </Button>
                  </div>
                </div>
              )}

              {/* Movies Display */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  {content.length > 0 ? 'Featured Movies' : 'Movies Coming Soon'}
                </h2>
                
                {loading ? (
                  <div className="cinema-card p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading movies...</p>
                  </div>
                ) : content.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((movie) => (
                      <VideoPlayer
                        key={movie.id}
                        videoUrl={movie.file_url}
                        coverUrl={movie.cover_url}
                        trailerUrl={movie.trailer_url}
                        title={movie.title}
                        description={movie.description}
                        genre={movie.genre}
                        contentType="Movie"
                        canDelete={user?.id === movie.user_id}
                        onDelete={() => deleteContent(movie.id, movie.file_url)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cinema-card p-12 text-center">
                    <Film className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
                    <p className="text-muted-foreground mb-8">
                      Independent films and cinematic experiences will be featured here. Be the first to share yours!
                    </p>
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

export default Movies;