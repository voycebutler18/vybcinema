import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Upload as UploadIcon,
  Music2,
  Tv,
  BookOpen,
  Sparkles,
  Trophy,
  Radio,
  Link as LinkIcon,
} from "lucide-react";
import { VideoProgressTracker } from "@/components/VideoProgressTracker";

/* ----------------------- Types & constants ----------------------- */

type ContentType = "music" | "show" | "story" | "talent" | "challenge" | "live";

const TYPE_OPTIONS: { value: ContentType; label: string; icon: any }[] = [
  { value: "music", label: "Music", icon: Music2 },
  { value: "show", label: "Shows", icon: Tv },
  { value: "story", label: "Stories", icon: BookOpen },
  { value: "talent", label: "Talent", icon: Sparkles },
  { value: "challenge", label: "Challenges", icon: Trophy },
  { value: "live", label: "Live", icon: Radio },
];

const GENRES: Record<ContentType, string[]> = {
  music: ["Hip-Hop", "Pop", "R&B", "Gospel", "Country", "Afrobeats", "Latin", "Electronic"],
  show: ["Comedy", "Drama", "Reality", "Docuseries", "News", "Kids", "Sports"],
  story: ["Mystery", "Horror", "Adventure", "Romance", "Comedy", "Sci-Fi", "Fantasy"],
  talent: ["Dance", "Singing", "Acting", "Beatbox", "Comedy", "Magic", "Other"],
  challenge: ["Dance", "Prank", "Fitness", "Food", "Trend", "Other"],
  live: ["Music", "Talk", "Gaming", "IRL", "Sports", "Other"],
};

// max file size in MB per content type
const MAX_SIZE_MB: Record<ContentType, number> = {
  music: 1000,      // 1 GB
  show: 2000,       // 2 GB
  story: 300,       // 300 MB
  talent: 800,      // 0.8 GB
  challenge: 1200,  // 1.2 GB
  live: 3000,       // 3 GB (VOD upload)
};

const SUPPORTED_VIDEO_EXT = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "wmv", "flv"];

/* ----------------------------- Component ----------------------------- */

const Upload: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // support both /create/:type and ?type=type
  const params = useParams();
  const [search] = useSearchParams();
  const initialTypeFromUrl = (params.type || search.get("type") || "").toLowerCase();

  const initialType: ContentType =
    (TYPE_OPTIONS.find((t) => t.value === initialTypeFromUrl)?.value as ContentType) || "music";

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    genre: string;
    content_type: ContentType;
    is_featured: boolean;
    trailer_url: string;
  }>({
    title: "",
    description: "",
    genre: "",
    content_type: initialType,
    is_featured: false,
    trailer_url: "",
  });

  const [files, setFiles] = useState<{ video: File | null; cover: File | null; thumbnail: File | null }>({
    video: null,
    cover: null,
    thumbnail: null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const selectedTypeMeta = TYPE_OPTIONS.find((t) => t.value === formData.content_type)!;
  const TypeIcon = selectedTypeMeta.icon;

  const maxSizeLabel = (t: ContentType) => {
    const mb = MAX_SIZE_MB[t];
    return mb >= 1000 ? `${(mb / 1000).toFixed(1)}GB` : `${mb}MB`;
    }

  const handleFileChange = (kind: "video" | "cover" | "thumbnail", file: File | null) => {
    if (file && kind === "video") {
      const sizeMB = file.size / (1024 * 1024);
      const limit = MAX_SIZE_MB[formData.content_type];
      if (sizeMB > limit) {
        toast({
          title: "File too large",
          description: `Max for ${selectedTypeMeta.label.toLowerCase()} is ${maxSizeLabel(formData.content_type)}.`,
          variant: "destructive",
        });
        return;
      }
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!SUPPORTED_VIDEO_EXT.includes(ext)) {
        toast({
          title: "Unsupported format",
          description: `Use: ${SUPPORTED_VIDEO_EXT.join(", ").toUpperCase()}`,
          variant: "destructive",
        });
        return;
      }
    }
    setFiles((prev) => ({ ...prev, [kind]: file }));
  };

  const uploadToBucket = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${folder}/${name}`;
    const { error } = await supabase.storage.from("content-files").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("content-files").getPublicUrl(path);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.video) {
      toast({ title: "Video required", description: "Select a video file.", variant: "destructive" });
      return;
    }
    if (!formData.title.trim()) {
      toast({ title: "Title required", description: "Please add a title.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // create direct upload URL via Edge Function
      const { data: cfData, error: cfErr } = await supabase.functions.invoke("cloudflare-stream-upload", {
        body: JSON.stringify({
          action: "get_upload_url",
          title: formData.title.trim(),
          description: formData.description.trim(),
          content_type: formData.content_type, // <-- save new categories
          genre: formData.genre,
          user_id: user?.id,
        }),
      });
      if (cfErr) throw cfErr;

      // POST file to Cloudflare Stream
      const fd = new FormData();
      fd.append("file", files.video);
      const resp = await fetch(cfData.uploadURL, { method: "POST", body: fd });
      if (!resp.ok) throw new Error("Failed to upload to Cloudflare Stream");

      // optional uploads (cover/thumbnail) to Supabase bucket
      let coverUrl: string | null = null;
      let thumbUrl: string | null = null;
      if (files.cover) coverUrl = await uploadToBucket(files.cover, "covers");
      if (files.thumbnail) thumbUrl = await uploadToBucket(files.thumbnail, "thumbnails");

      if (coverUrl || thumbUrl || formData.trailer_url || formData.is_featured) {
        const { error: updErr } = await supabase
          .from("content")
          .update({
            cover_url: coverUrl,
            thumbnail_url: thumbUrl,
            trailer_url: formData.trailer_url.trim() || null,
            is_featured: formData.is_featured,
          })
          .eq("id", cfData.contentId);
        if (updErr) console.warn("Post-upload update error:", updErr.message);
      }

      // tiny status poll (non-blocking)
      let attempts = 0;
      const poll = async () => {
        attempts++;
        const { data: status } = await supabase.functions.invoke("cloudflare-stream-upload", {
          body: JSON.stringify({ action: "check_status", streamId: cfData.streamId }),
        });
        if (status?.ready || attempts > 60) return;
        setTimeout(poll, 3000);
      };
      setTimeout(poll, 1500);

      toast({
        title: "Upload complete",
        description: "Processing your video—available shortly.",
      });

      // reset
      setFormData({
        title: "",
        description: "",
        genre: "",
        content_type: "music",
        is_featured: false,
        trailer_url: "",
      });
      setFiles({ video: null, cover: null, thumbnail: null });

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-glass mb-6">
              <TypeIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Upload Content</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Share Your <span className="text-cinema-gradient">{selectedTypeMeta.label}</span>
            </h1>
            <p className="text-muted-foreground mt-2">Upload your video, add details, and share with the world.</p>
          </div>

          {uploading && (
            <VideoProgressTracker
              progress={{ phase: "uploading", percentage: 50, message: "Uploading to Cloudflare Stream..." }}
              fileName={files.video?.name}
            />
          )}

          {/* Form */}
          <div className="cinema-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, content_type: val as ContentType, genre: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="h-4 w-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder={`Title of your ${selectedTypeMeta.label.toLowerCase()}`}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Tell viewers what it's about…"
                  rows={4}
                />
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label>Genre</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(val) => setFormData((p) => ({ ...p, genre: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {(GENRES[formData.content_type] || []).map((g) => (
                      <SelectItem key={g} value={g.toLowerCase()}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label htmlFor="video">Video File *</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="video"
                    accept="video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.wmv,.flv"
                    onChange={(e) => handleFileChange("video", e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {files.video && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Selected: {files.video.name} • {(files.video.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Max size: {maxSizeLabel(formData.content_type)} • Formats: {SUPPORTED_VIDEO_EXT.join(", ").toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Cover */}
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image (optional)</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="cover"
                    accept="image/*"
                    onChange={(e) => handleFileChange("cover", e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {files.cover && <p className="text-sm text-muted-foreground mt-2">Selected: {files.cover.name}</p>}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={(e) => handleFileChange("thumbnail", e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {files.thumbnail && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {files.thumbnail.name}</p>
                  )}
                </div>
              </div>

              {/* Trailer */}
              <div className="space-y-2">
                <Label htmlFor="trailer">Trailer URL (optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="trailer"
                    value={formData.trailer_url}
                    onChange={(e) => setFormData((p) => ({ ...p, trailer_url: e.target.value }))}
                    placeholder="https://example.com/trailer.mp4"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((p) => ({ ...p, is_featured: checked }))}
                />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={uploading || !files.video || !formData.title.trim()}
                  className="btn-hero w-full text-lg py-4"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5 mr-2" />
                      Upload {selectedTypeMeta.label}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
