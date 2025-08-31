// src/pages/Stories.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard, type Content } from "@/components/ContentCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Stories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("content")
          .select("*")
          .eq("content_type", "story")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContent((data as Content[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openWatch = (c: Content) => navigate(`/watch/${c.id}`);

  // sections
  const recentlyAdded = content.slice(0, 12);
  const dramaStories = content.filter((s) => s.genre?.toLowerCase().includes("drama"));
  const comedyStories = content.filter((s) => s.genre?.toLowerCase().includes("comedy"));
  const mysteryStories = content.filter((s) => s.genre?.toLowerCase().includes("mystery"));
  const myStories = user ? content.filter((s: any) => s.user_id === user.id) : [];

  const Section = ({ title, items }: { title: string; items: Content[] }) =>
    !items.length ? null : (
      <section className="container mx-auto px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <ContentCard
              key={c.id}
              content={c}
              contentType="Story"
              index={i % 4}
              onClick={() => openWatch(c)}     // ← go to /watch/:id
              onPlay={() => openWatch(c)}      // ← same
            />
          ))}
        </div>
      </section>
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-28 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Recently Added Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-card/60 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-20">
        <Section title="Recently Added Stories" items={recentlyAdded} />
        <Section title="Mystery & Thriller Stories" items={mysteryStories} />
        <Section title="Drama Stories" items={dramaStories} />
        <Section title="Comedy Stories" items={comedyStories} />
        <Section title="My Stories" items={myStories as Content[]} />

        {!content.length && (
          <div className="container mx-auto px-6">
            <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">No Stories Available</h2>
              <p className="text-muted-foreground">Be the first to upload a story!</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Stories;
