import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Film, Play, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Movies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);

    try {
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          content_type: 'movie',
          genre: formData.genre
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your movie has been uploaded successfully."
      });

      setFormData({ title: '', description: '', genre: '' });
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
                    <Button className="btn-hero" onClick={() => window.location.href = '/signup'}>
                      Sign Up
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/login'}>
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
                      <Card key={movie.id} className="cinema-card">
                        <CardHeader>
                          <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            <Play className="h-12 w-12 text-primary" />
                            <div className="absolute inset-0 bg-gradient-overlay"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">Movie</Badge>
                            {movie.genre && (
                              <Badge variant="outline">{movie.genre}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{movie.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {movie.description || 'No description available'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(movie.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
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