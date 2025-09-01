// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type ProfileRow = {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  age: number | null;
  show_full_name: boolean | null;
  created_at: string;
  updated_at: string | null;
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [showFullName, setShowFullName] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle<ProfileRow>();

      if (!error && data) {
        setUsername(data.username ?? "");
        setFullName(data.full_name ?? "");
        setAge((data.age as number) ?? "");
        setShowFullName(!!data.show_full_name);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!username.trim()) {
      toast({ title: "Username is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        username: username.trim(),
        full_name: fullName.trim() || null,
        age: typeof age === "number" ? age : null,
        show_full_name: !!showFullName,
        updated_at: new Date().toISOString(),
      };

      // Upsert profile row
      const { error } = await supabase.from("profiles").upsert(payload, {
        onConflict: "user_id",
      });
      if (error) throw error;

      toast({ title: "Profile saved" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const displayName = (() => {
    // How your name is shown elsewhere:
    // Under 18 -> always username
    // 18+     -> username unless "show full name" is checked and fullName present
    if (typeof age === "number" && age >= 18 && showFullName && fullName.trim()) {
      return fullName.trim();
    }
    return username || "Anonymous";
  })();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 animate-pulse h-64" />
            <Card className="p-6 animate-pulse h-64" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: public preview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Public Preview</h2>
              <p className="text-sm text-muted-foreground mb-1">
                This is how your name appears across VYB:
              </p>
              <div className="text-2xl font-bold">{displayName}</div>

              <div className="mt-6">
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            </Card>

            {/* Right: edit form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              {!user ? (
                <p className="text-sm text-muted-foreground">
                  Please sign in to edit your profile.
                </p>
              ) : (
                <form className="space-y-4" onSubmit={save}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (visible if you’re under 18)</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. vibez_kai"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name (optional)</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Only shown if you’re 18+ and opt in"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min={13}
                      max={120}
                      value={age === "" ? "" : age}
                      onChange={(e) =>
                        setAge(e.target.value === "" ? "" : Math.max(13, Math.min(120, Number(e.target.value))))
                      }
                      placeholder="Your age"
                    />
                    <p className="text-xs text-muted-foreground">
                      Under 18? We’ll always show your username. If you’re 18+, you can choose to show your full name.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="showFullName"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={showFullName}
                      onChange={(e) => setShowFullName(e.target.checked)}
                      disabled={!(typeof age === "number" && age >= 18)}
                    />
                    <Label htmlFor="showFullName">
                      If I’m 18+, show my full name instead of my username
                    </Label>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
