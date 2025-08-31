import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { NetflixRow as ContentRow } from "@/components/NetflixRow";
import { supabase } from "@/integrations/supabase/client";

const Live: React.FC = () => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("content").select("*").eq("content_type", "live").order("created_at", { ascending: false })
      .then(({ data }) => setContent(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pb-20 pt-20 container mx-auto px-4">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          </div>
        ) : content.length ? (
          <ContentRow title="Live" content={content} contentType="Live" onContentClick={()=>{}} onContentPlay={()=>{}}/>
        ) : (
          <div className="text-center py-20 text-muted-foreground">No live uploads yet.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Live;
