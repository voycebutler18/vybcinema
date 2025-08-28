import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Upload as UploadIcon, Film, Tv, Music, BookOpen, Mic, Image, Link as LinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Upload = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    content_type: searchParams.get('type') || 'movie',
    is_featured: false,
    trailer_url: ""
  });
  
  const [files, setFiles] = useState({
    video: null as File | null,
    cover: null as File | null,
    thumbnail: null as File | null
  });
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ video: 0, cover: 0, thumbnail: 0 });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const contentTypes = [
    { value: 'movie', label: 'Movie', icon: Film },
    { value: 'tv_show', label: 'TV Show', icon: Tv },
    { value: 'music_video', label: 'Music Video', icon: Music },
    { value: 'story', label: 'Story', icon: BookOpen },
    { value: 'podcast', label: 'Podcast', icon: Mic }
  ];

  const genres = {
    movie: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'],
    tv_show: ['Comedy', 'Drama', 'Reality', 'Documentary', 'News', 'Kids', 'Sports'],
    music_video: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical'],
    story: ['Fiction', 'Non-Fiction', 'Biography', 'Mystery', 'Romance', 'Adventure', 'Fantasy'],
    podcast: ['Technology', 'Business', 'Comedy', 'Education', 'News', 'Sports', 'Health', 'Arts']
  };

  const handleFileChange = (type: 'video' | 'cover' | 'thumbnail', file: File | null) => {
    if (file && type === 'video') {
      // Check file size based on content type
      const fileSizeMB = file.size / (1024 * 1024);
      let maxSizeLimit = 50; // Default 50MB
      
      switch (formData.content_type) {
        case 'movie':
          maxSizeLimit = 5000; // 5GB for movies
          break;
        case 'tv_show':
          maxSizeLimit = 2000; // 2GB for TV shows
          break;
        case 'music_video':
          maxSizeLimit = 500; // 500MB for music videos
          break;
        case 'story':
          maxSizeLimit = 200; // 200MB for stories
          break;
        case 'podcast':
          maxSizeLimit = 300; // 300MB for podcasts
          break;
      }
      
      if (fileSizeMB > maxSizeLimit) {
        toast({
          title: "File too large",
          description: `${formData.content_type} files must be less than ${maxSizeLimit}MB (${(maxSizeLimit/1000).toFixed(1)}GB)`,
          variant: "destructive"
        });
        return;
      }
      
      // Check video format
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const supportedFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', 'wmv', 'flv'];
      
      if (!supportedFormats.includes(fileExtension || '')) {
        toast({
          title: "Unsupported format",
          description: "Please upload a video in MP4, MOV, AVI, MKV, WebM, M4V, WMV, or FLV format",
          variant: "destructive"
        });
        return;
      }
    }
    
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file: File, folder: string, type: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading ${type} file:`, file.name, `Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      const { data, error } = await supabase.storage
        .from('content-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);

      console.log(`Successfully uploaded ${type}:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.video) {
      toast({
        title: "Video Required",
        description: "Please select a video file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Upload video file
      const videoUrl = await uploadFile(files.video, 'videos', 'video');
      
      // Upload cover image if provided
      let coverUrl = null;
      if (files.cover) {
        coverUrl = await uploadFile(files.cover, 'covers', 'cover');
      }
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (files.thumbnail) {
        thumbnailUrl = await uploadFile(files.thumbnail, 'thumbnails', 'thumbnail');
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('content')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          genre: formData.genre || null,
          content_type: formData.content_type,
          is_featured: formData.is_featured,
          trailer_url: formData.trailer_url.trim() || null,
          file_url: videoUrl,
          cover_url: coverUrl,
          thumbnail_url: thumbnailUrl,
          user_id: user!.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful!",
        description: `Your ${contentTypes.find(t => t.value === formData.content_type)?.label.toLowerCase()} has been uploaded successfully.`
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        genre: "",
        content_type: 'movie',
        is_featured: false,
        trailer_url: ""
      });
      setFiles({ video: null, cover: null, thumbnail: null });
      setUploadProgress({ video: 0, cover: 0, thumbnail: 0 });
      
      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const selectedContentType = contentTypes.find(type => type.value === formData.content_type);
  const Icon = selectedContentType?.icon || UploadIcon;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ pointerEvents: 'auto' }}>
      <Navigation />
      
      <main className="pt-8 relative z-10" style={{ pointerEvents: 'auto' }}>
        <section className="py-16">
          <div className="container mx-auto px-6" style={{ pointerEvents: 'auto' }}>
            <div className="max-w-2xl mx-auto">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-glass mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-lg">Upload Content</span>
                </div>
                <h1 className="text-4xl font-display font-bold text-cinema-gradient mb-4">
                  Share Your Content
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload your videos, add details, and share with the world
                </p>
              </div>

              {/* Upload Form */}
              <div className="cinema-card p-8" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}>
                <form onSubmit={handleSubmit} className="space-y-6" style={{ pointerEvents: 'auto' }}>
                  
                  {/* Content Type */}
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select 
                      value={formData.content_type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value, genre: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => {
                          const TypeIcon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter the title of your content"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your content..."
                      rows={4}
                    />
                  </div>

                  {/* Genre */}
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select 
                      value={formData.genre} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres[formData.content_type as keyof typeof genres].map(genre => (
                          <SelectItem key={genre} value={genre.toLowerCase()}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                   {/* Video File */}
                   <div className="space-y-2">
                     <Label htmlFor="video">Video File *</Label>
                     <div className="border-2 border-dashed border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors">
                       <input
                         type="file"
                         id="video"
                         accept="video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.wmv,.flv"
                         onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)}
                         className="w-full"
                         style={{ pointerEvents: 'auto' }}
                       />
                       {files.video && (
                         <div className="mt-2 space-y-1">
                           <p className="text-sm text-muted-foreground">
                             Selected: {files.video.name}
                           </p>
                           <p className="text-xs text-muted-foreground">
                             Size: {(files.video.size / 1024 / 1024).toFixed(2)} MB
                           </p>
                         </div>
                       )}
                       <p className="text-xs text-muted-foreground mt-2">
                         Supported formats: MP4, MOV, AVI, MKV, WebM, M4V, WMV, FLV<br/>
                         Max size: {formData.content_type === 'movie' ? '5GB' : 
                                   formData.content_type === 'tv_show' ? '2GB' :
                                   formData.content_type === 'music_video' ? '500MB' :
                                   formData.content_type === 'podcast' ? '300MB' : '200MB'}
                       </p>
                     </div>
                   </div>

                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label htmlFor="cover">Cover Image</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="cover"
                        accept="image/*"
                        onChange={(e) => handleFileChange('cover', e.target.files?.[0] || null)}
                        className="w-full"
                        style={{ pointerEvents: 'auto' }}
                      />
                      {files.cover && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {files.cover.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnail', e.target.files?.[0] || null)}
                        className="w-full"
                        style={{ pointerEvents: 'auto' }}
                      />
                      {files.thumbnail && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {files.thumbnail.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trailer URL */}
                  <div className="space-y-2">
                    <Label htmlFor="trailer">Trailer URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="trailer"
                        value={formData.trailer_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, trailer_url: e.target.value }))}
                        placeholder="https://example.com/trailer.mp4"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="featured">Mark as Featured Content</Label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={uploading || !files.video || !formData.title.trim()}
                      className="btn-hero w-full text-lg py-4"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="h-5 w-5 mr-2" />
                          Upload {selectedContentType?.label}
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;