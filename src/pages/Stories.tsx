import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookOpen, Camera, Play, Upload } from "lucide-react";
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

const Stories = () => {
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

  const storyCategories = [
    'Drama', 'Comedy', 'Documentary', 'Animation', 'Short Film', 'Web Series',
    'Narrative', 'Experimental', 'Historical', 'Biography', 'Horror', 'Romance',
    'Thriller', 'Sci-Fi', 'Fantasy', 'Adventure', 'Coming of Age', 'Social Issues'
  ];

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
          content_type: 'story',
          genre: formData.genre
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your story has been uploaded successfully."
      });

      setFormData({ title: '', description: '', genre: '' });
      fetchStories();
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
                <span className="text-cinema-gradient">Stories</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Character-driven narratives and cinematic skits
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
                    <h2 className="text-3xl font-bold text-foreground">Share Your Story</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Story Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter your story title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="genre">Category</Label>
                        <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border z-50">
                            {storyCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Story Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tell us about your story..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" disabled={uploading} className="btn-hero">
                      {uploading ? "Uploading..." : "Upload Story"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="cinema-card p-8 text-center">
                  <Camera className="h-16 w-16 mx-auto text-primary/50 mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">Share Your Stories</h2>
                  <p className="text-muted-foreground mb-6">
                    Join VYB Cinema to upload and share your narrative content
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

              {/* Stories Display */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  {content.length > 0 ? 'Featured Stories' : 'Stories Coming Soon'}
                </h2>
                
                {loading ? (
                  <div className="cinema-card p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading stories...</p>
                  </div>
                ) : content.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((story) => (
                      <Card key={story.id} className="cinema-card">
                        <CardHeader>
                          <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            <BookOpen className="h-12 w-12 text-primary" />
                            <div className="absolute inset-0 bg-gradient-overlay"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">Story</Badge>
                            {story.genre && (
                              <Badge variant="outline">{story.genre}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {story.description || 'No description available'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(story.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="cinema-card p-12 text-center">
                    <BookOpen className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
                    <p className="text-muted-foreground mb-8">
                      Compelling stories and character-driven content will be featured here. Share yours today!
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

export default Stories;