import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mic, Radio, Upload, Play, Users, Eye } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";

const Podcasts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState<any[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [creatingStream, setCreatingStream] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    fileUrl: '',
    fileName: ''
  });
  const [streamData, setStreamData] = useState({
    title: '',
    description: ''
  });

  const podcastCategories = [
    'Technology', 'Business', 'Comedy', 'News', 'Sports', 'Health & Fitness',
    'Education', 'True Crime', 'History', 'Science', 'Arts', 'Society & Culture',
    'Music', 'Self-Improvement', 'Politics', 'Entertainment', 'Religion',
    'Kids & Family', 'Gaming', 'Food', 'Travel', 'Interviews'
  ];

  useEffect(() => {
    fetchPodcasts();
    fetchLiveStreams();
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

  const fetchLiveStreams = async () => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLiveStreams(data || []);
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleStreamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStreamData(prev => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.fileUrl) {
      toast({
        title: "Upload Required",
        description: "Please upload a podcast file before submitting.",
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
          content_type: 'podcast',
          genre: formData.genre,
          file_url: formData.fileUrl
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your podcast has been uploaded successfully."
      });

      setFormData({ title: '', description: '', genre: '', fileUrl: '', fileName: '' });
      fetchPodcasts();
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

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreatingStream(true);

    try {
      const { data, error } = await supabase
        .from('live_streams')
        .insert({
          user_id: user.id,
          title: streamData.title,
          description: streamData.description,
          is_live: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Stream Created!",
        description: `Your stream "${streamData.title}" is ready. Stream key: ${data.stream_key}`
      });

      setStreamData({ title: '', description: '' });
      fetchLiveStreams();
    } catch (error: any) {
      toast({
        title: "Stream Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreatingStream(false);
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
                <span className="text-cinema-gradient">Podcasts</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Share your voice through podcasts and live streaming
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Upload/Streaming Section - Protected */}
              {user ? (
                <Tabs defaultValue="upload" className="cinema-card p-8">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Podcast</TabsTrigger>
                    <TabsTrigger value="stream">Go Live</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload">
                    <div className="flex items-center space-x-3 mb-6">
                      <Upload className="h-8 w-8 text-primary" />
                      <h2 className="text-3xl font-bold text-foreground">Upload Your Podcast</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FileUpload
                        onFileUploaded={handleFileUploaded}
                        acceptedTypes="audio/*,video/*"
                        maxSizeMB={500}
                        label="Podcast File (Audio or Video)"
                      />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="title">Podcast Title *</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter podcast title"
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
                            {podcastCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                          placeholder="Describe your podcast episode..."
                          rows={4}
                        />
                      </div>
                      <Button type="submit" disabled={uploading} className="btn-hero">
                        {uploading ? "Uploading..." : "Upload Podcast"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="stream">
                    <div className="flex items-center space-x-3 mb-6">
                      <Radio className="h-8 w-8 text-primary" />
                      <h2 className="text-3xl font-bold text-foreground">Create Live Stream</h2>
                    </div>
                    <form onSubmit={handleCreateStream} className="space-y-6">
                      <div>
                        <Label htmlFor="streamTitle">Stream Title *</Label>
                        <Input
                          id="streamTitle"
                          name="title"
                          value={streamData.title}
                          onChange={handleStreamInputChange}
                          placeholder="Enter stream title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="streamDescription">Stream Description</Label>
                        <Textarea
                          id="streamDescription"
                          name="description"
                          value={streamData.description}
                          onChange={handleStreamInputChange}
                          placeholder="What will you be streaming about?"
                          rows={4}
                        />
                      </div>
                      <Button type="submit" disabled={creatingStream} className="btn-hero">
                        {creatingStream ? "Creating..." : "Create Stream"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="cinema-card p-8 text-center">
                  <Mic className="h-16 w-16 mx-auto text-primary/50 mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Podcast?</h2>
                  <p className="text-muted-foreground mb-6">
                    Join VYB Cinema to upload podcasts and go live with your audience
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

              {/* Live Streams */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Live Now</h2>
                {liveStreams.filter(stream => stream.is_live).length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {liveStreams.filter(stream => stream.is_live).map((stream) => (
                      <Card key={stream.id} className="cinema-card border-2 border-red-500/50 animate-pulse">
                        <CardHeader>
                          <div className="aspect-video bg-red-900/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            <Radio className="h-12 w-12 text-red-500" />
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-red-500 text-white">LIVE</Badge>
                            </div>
                            <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                              <Eye className="h-3 w-3 text-white" />
                              <span className="text-xs text-white">{stream.viewer_count}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{stream.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {stream.description || 'Live streaming now'}
                          </p>
                          <Button className="w-full">
                            <Users className="h-4 w-4 mr-2" />
                            Join Live Stream
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="cinema-card p-8 text-center mb-12">
                    <Radio className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                    <p className="text-muted-foreground">No live streams at the moment</p>
                  </div>
                )}
              </div>

              {/* Podcasts Display */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  {content.length > 0 ? 'Featured Podcasts' : 'Podcasts Coming Soon'}
                </h2>
                
                {loading ? (
                  <div className="cinema-card p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading podcasts...</p>
                  </div>
                ) : content.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((podcast) => (
                      <Card key={podcast.id} className="cinema-card">
                        <CardHeader>
                          <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            <Mic className="h-12 w-12 text-primary" />
                            <div className="absolute inset-0 bg-gradient-overlay"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">Podcast</Badge>
                            {podcast.genre && (
                              <Badge variant="outline">{podcast.genre}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{podcast.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {podcast.description || 'No description available'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(podcast.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="cinema-card p-12 text-center">
                    <Mic className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
                    <p className="text-muted-foreground mb-8">
                      Engaging podcasts and live streams will be featured here. Be the first to share yours!
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

export default Podcasts;