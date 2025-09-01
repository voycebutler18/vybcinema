// src/pages/Dashboard.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Upload,
  Music2,
  Tv,
  BookOpen,
  Sparkles,
  Trophy,
  Radio,
  Plus,
  BadgeInfo,
  Image as ImageIcon,
  Shield,
  KeyRound,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { VideoPlayer } from "@/components/VideoPlayer";

/* -------------------------------- Types ---------------------------------- */

type VYBType =
  | "music"
  | "show"
  | "story"
  | "talent"
  | "challenge"
  | "live"
  | string; // keep string to avoid crashes if older rows exist

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: VYBType;
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

type ProfileRow = {
  id: string;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  is_private: boolean | null;
  last_username_change: string | null; // ISO date string
  created_at: string;
  updated_at: string | null;
};

const typeMeta: Record<
  VYBType,
  { label: string; icon: JSX.Element; param: string }
> = {
  music: { label: "Music", icon: <Music2 className="h-5 w-5" />, param: "music" },
  show: { label: "Shows", icon: <Tv className="h-5 w-5" />, param: "show" },
  story: { label: "Stories", icon: <BookOpen className="h-5 w-5" />, param: "story" },
  talent: { label: "Talent", icon: <Sparkles className="h-5 w-5" />, param: "talent" },
  challenge: { label: "Challenges", icon: <Trophy className="h-5 w-5" />, param: "challenge" },
  live: { label: "Live", icon: <Radio className="h-5 w-5" />, param: "live" },
};

const order: VYBType[] = ["music", "show", "story", "talent", "challenge", "live"];

const getMeta = (t: VYBType) =>
  typeMeta[t] ?? { label: t || "Other", icon: <Upload className="h-5 w-5" />, param: t || "other" };

/* ------------------------------ Page Component --------------------------- */

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [filter, setFilter] = useState<VYBType | "all">("all");

  // Profile state
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchUserContent();
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const fetchUserContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your content.",
        variant: "destructive",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // not found vs error
      let row = data as ProfileRow | null;

      if (!row) {
        // create a new row if missing
        const insert = {
          user_id: user.id,
          username: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "user",
          avatar_url: null,
          is_private: false,
          last_username_change: null,
        };
        const { data: created, error: insertErr } = await supabase
          .from("profiles")
          .insert(insert)
          .select("*")
          .single();
        if (insertErr) throw insertErr;
        row = created as ProfileRow;
      }

      setProfile(row);
      setDisplayName(row.username ?? "");
      setIsPrivate(Boolean(row.is_private));
    } catch (e: any) {
      toast({
        title: "Profile error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Refresh content often to catch processing changes
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchUserContent, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const navigateToCreate = (type: VYBType) => {
    const p = getMeta(type).param;
    navigate(`/create?type=${encodeURIComponent(p)}`);
  };

  const deleteContent = async (contentId: string, fileUrl?: string) => {
    try {
      const { error: dbError } = await supabase.from("content").delete().eq("id", contentId);
      if (dbError) throw dbError;

      if (fileUrl) {
        // remove from storage if path is within our public bucket
        const parts = fileUrl.split("/storage/v1/object/public/");
        if (parts[1]) {
          const path = parts[1].split("?")[0]; // strip any qs
          const [bucket, ...rest] = path.split("/");
          if (bucket && rest.length) {
            await supabase.storage.from(bucket).remove([rest.join("/")]);
          }
        }
      }

      setContent((prev) => prev.filter((i) => i.id !== contentId));
      toast({ title: "Deleted", description: "Your content was removed." });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const filtered = filter === "all" ? content : content.filter((c) => c.content_type === filter);

  const counts = order.reduce<Record<string, number>>((acc, t) => {
    acc[t] = content.filter((c) => c.content_type === t).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-pink-500 mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  /* ----------------------- Profile helper functions ---------------------- */

  const canChangeUsername = () => {
    if (!profile?.last_username_change) return true;
    const last = new Date(profile.last_username_change).getTime();
    const now = Date.now();
    const days = (now - last) / (1000 * 60 * 60 * 24);
    return days >= 30;
  };

  const usernameCooldownLeft = () => {
    if (!profile?.last_username_change) return 0;
    const last = new Date(profile.last_username_change).getTime();
    const now = Date.now();
    const days = Math.max(0, 30 - Math.floor((now - last) / (1000 * 60 * 60 * 24)));
    return days;
  };

  const saveProfile = async () => {
    if (!user || !profile) return;
    setSavingProfile(true);
    try {
      // username guard
      const wantsUsernameChange = displayName.trim() !== (profile.username ?? "");
      if (wantsUsernameChange && !canChangeUsername()) {
        toast({
          title: "Username lock",
          description: `You can change your username again in ${usernameCooldownLeft()} day(s).`,
          variant: "destructive",
        });
        setSavingProfile(false);
        return;
      }

      const updates: Partial<ProfileRow> = {
        username: displayName.trim(),
        is_private: isPrivate,
        updated_at: new Date().toISOString(),
      };

      if (wantsUsernameChange) {
        (updates as any).last_username_change = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select("*")
        .single();
      if (error) throw error;

      setProfile(data as ProfileRow);
      toast({ title: "Saved", description: "Profile updated successfully." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext ?? "jpg"}`;

      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        cacheControl: "3600",
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = pub?.publicUrl;

      const { error: profErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (profErr) throw profErr;

      setProfile((p) => (p ? { ...p, avatar_url: publicUrl } : p));
      toast({ title: "Avatar updated", description: "Your profile photo has been changed." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Please use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      toast({ title: "Password changed", description: "Use your new password next time you log in." });
    } catch (e: any) {
      toast({ title: "Change failed", description: e.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  // UPDATED: send users to Contact page to request deletion (24–48h)
  const requestAccountDeletion = async () => {
    if (!user) return;
    const confirm = window.confirm(
      "We'll take you to the Contact page to submit a deletion request. Your account will be permanently deleted within 24–48 hours after submission. Continue?"
    );
    if (!confirm) return;

    setDeleting(true);
    try {
      navigate("/contact?subject=delete-account");
    } finally {
      setDeleting(false);
    }
  };

  /* --------------------------------- Render -------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <header className="pt-24 pb-10 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Creator Dashboard</h1>
            <p className="mt-3 text-white/90 text-lg">
              Upload your <b>Music</b>, <b>Shows</b>, <b>Stories</b>, showcase your <b>Talent</b>, start a <b>Challenge</b>, or go <b>Live</b>.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => navigateToCreate("music")} className="bg-white text-neutral-900 hover:bg-white/90">
                <Music2 className="h-4 w-4 mr-2" />
                Upload Music
              </Button>
              <Button onClick={() => navigateToCreate("show")} variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Tv className="h-4 w-4 mr-2" />
                Upload Show
              </Button>
              <Button onClick={() => navigateToCreate("story")} variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Upload Story
              </Button>
            </div>

            <div className="mt-6 text-sm flex items-start gap-2">
              <BadgeInfo className="h-5 w-5 mt-0.5" />
              <p className="text-white/90">Tip: Choose the category that matches your upload — you can switch categories later in Edit.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          {/* QUICK CREATE GRID (all six) */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">Create something new</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <CreateCard color="bg-pink-500" label="Music" icon={<Music2 className="h-6 w-6" />} onClick={() => navigateToCreate("music")} />
              <CreateCard color="bg-indigo-500" label="Shows" icon={<Tv className="h-6 w-6" />} onClick={() => navigateToCreate("show")} />
              <CreateCard color="bg-emerald-500" label="Stories" icon={<BookOpen className="h-6 w-6" />} onClick={() => navigateToCreate("story")} />
              <CreateCard color="bg-amber-500" label="Talent" icon={<Sparkles className="h-6 w-6" />} onClick={() => navigateToCreate("talent")} />
              <CreateCard color="bg-violet-500" label="Challenges" icon={<Trophy className="h-6 w-6" />} onClick={() => navigateToCreate("challenge")} />
              <CreateCard color="bg-rose-500" label="Live" icon={<Radio className="h-6 w-6" />} onClick={() => navigateToCreate("live")} />
            </div>
          </section>

          {/* FILTERS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl md:text-3xl font-bold">Your uploads</h2>
              <div className="text-sm text-muted-foreground">
                {content.length} {content.length === 1 ? "item" : "items"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
              {order.map((t) => (
                <FilterChip
                  key={t}
                  active={filter === t}
                  onClick={() => setFilter(t)}
                  label={`${getMeta(t).label} ${counts[t] ? `(${counts[t]})` : ""}`}
                  icon={getMeta(t).icon}
                />
              ))}
            </div>

            {/* LIST */}
            {loadingContent ? (
              <div className="cinema-card p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your uploads…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="cinema-card p-10 text-center">
                <Upload className="h-16 w-16 mx-auto text-pink-500/60 mb-4" />
                <h3 className="text-xl font-bold mb-1">Nothing here yet</h3>
                <p className="text-muted-foreground mb-6">Start by creating something in the category you love.</p>
                <Button onClick={() => navigateToCreate("music")} className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload now
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Type badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/70 text-white">
                        {getMeta(item.content_type).icon}
                        {getMeta(item.content_type).label}
                      </span>
                    </div>

                    <VideoPlayer
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
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ========================== PROFILE SECTION ========================== */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Profile</h2>

            {/* Profile card */}
            <div className="cinema-card rounded-2xl border bg-card p-6">
              {profileLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading profile…
                </div>
              ) : (
                <>
                  {/* Top row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted overflow-hidden border">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Signed in as</div>
                        <div className="font-semibold">{user?.email}</div>
                        {profile?.username ? (
                          <div className="text-sm text-muted-foreground">Display name: {profile.username}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadAvatar(f);
                        }}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarUploading}
                      >
                        {avatarUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                        {avatarUploading ? "Uploading…" : "Change photo"}
                      </Button>
                    </div>
                  </div>

                  {/* Editable fields */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Display name</label>
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your public display name"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      {!canChangeUsername() ? (
                        <p className="text-xs text-muted-foreground">
                          You can change your username again in {usernameCooldownLeft()} day(s).
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">You can change your username now.</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Privacy
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="private"
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="private" className="text-sm">
                          Make my profile private
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        When private, only approved users can see your full profile and uploads.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={saveProfile} disabled={savingProfile}>
                      {savingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save changes
                    </Button>
                  </div>

                  {/* Password */}
                  <div className="mt-10 border-t pt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <KeyRound className="h-5 w-5" />
                      Change password
                    </h3>
                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 8 characters)"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <Button onClick={changePassword} disabled={changingPassword}>
                        {changingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Update password
                      </Button>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="mt-10 border-t pt-6">
                    <h3 className="text-lg font-semibold text-red-600">Danger zone</h3>
                    <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">Delete account</div>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all content. This cannot be undone.
                          <br />
                          <span className="text-foreground">
                            Clicking the button will take you to the Contact page to submit a request —
                            your account will be deleted permanently within 24–48 hours after submission.
                          </span>
                        </p>
                      </div>
                      <Button variant="destructive" onClick={requestAccountDeletion} disabled={deleting}>
                        {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        Delete account
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ---------- Small presentational bits ---------- */

const CreateCard = ({
  color,
  label,
  icon,
  onClick,
}: {
  color: string;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-2xl ${color} text-white p-5 flex items-center justify-between shadow-sm hover:opacity-90 transition-opacity`}
  >
    <div className="text-left">
      <div className="text-sm opacity-90">Upload</div>
      <div className="text-xl font-extrabold">{label}</div>
    </div>
    <div className="shrink-0">{icon}</div>
  </button>
);

const FilterChip = ({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: JSX.Element;
}) => (
  <button
    onClick={onClick}
    className={[
      "px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border",
      active
        ? "bg-pink-600 text-white border-pink-600"
        : "bg-background text-foreground/80 border-border hover:bg-muted",
    ].join(" ")}
  >
    {icon ? <span className="opacity-90">{icon}</span> : null}
    {label}
  </button>
);

export default Dashboard;
