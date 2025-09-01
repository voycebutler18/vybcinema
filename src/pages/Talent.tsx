import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContentCard, type Content } from "@/components/ContentCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Talent = () => {
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
          .or("content_type.eq.talent,genre.ilike.%talent%")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContent((data as Content[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openWatch = (c: Content) => navigate(`/watch/${c.id}`);

  const recent = content.slice(0, 12);
  const dance = content.filter((v) => v.genre?.toLowerCase().includes("dance"));
  const singing = content.filter(
    (v) => v.genre?.toLowerCase().includes("sing") || v.genre?.toLowerCase().includes("vocal")
  );
  const comedy = content.filter((v) => v.genre?.toLowerCase().includes("comedy"));
  const myTalent = user ? content.filter((s: any) => s.user_id === user.id) : [];

  const Section = ({ title, items }: { title: string; items: Content[] }) =>
    !items.length ? null : (
      <section className="container mx-auto px-6 mb-12">
        {/* Hide like badge & like/unlike buttons inside cards on this page */}
        <style>{`
          .hide-likes [title$="likes"],
          .hide-likes button[title="Like"],
          .hide-likes button[title="Unlike"] {
            display: none !important;
          }
        `}</style>

        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
        <div className="hide-likes grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <ContentCard
              key={c.id}
              content={c}
              contentType="Talent"
              index={i % 4}
              onClick={() => openWatch(c)}
              onPlay={() => openWatch(c)}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6">New Talent</h2>
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
        <Section title="New Talent" items={recent} />
        <Section title="Dance" items={dance} />
        <Section title="Singing" items={singing} />
        <Section title="Comedy" items={comedy} />
        <Section title="My Talent" items={myTalent as Content[]} />

        {!content.length && (
          <div className="container mx-auto px-6">
            <div className="bg-card/60 border border-border/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold">No Talent Videos Yet</h2>
              <p className="text-muted-foreground">Show off your skills!</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Talent;
