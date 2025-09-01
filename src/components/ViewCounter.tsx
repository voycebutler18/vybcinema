import React, { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { Eye } from "lucide-react";

type ViewCounterProps = {
  contentId: string;
};

const ViewCounter: React.FC<ViewCounterProps> = ({ contentId }) => {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!contentId) return;

    // 1. Get the initial view count when the component loads
    const fetchInitialViews = async () => {
      const { data, error } = await supabase
        .from("content")
        .select("views_count")
        .eq("id", contentId)
        .single();

      if (error) {
        console.warn("Could not fetch initial view count:", error.message);
        setViewCount(0); // Default to 0 if there's an error
      } else {
        setViewCount(data?.views_count ?? 0);
      }
    };

    fetchInitialViews();

    // 2. Subscribe to real-time updates for this specific video's view count
    const channel = supabase
      .channel(`content-views-channel-${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "content",
          filter: `id=eq.${contentId}`,
        },
        (payload) => {
          // When an update happens, get the new views_count from the payload
          const newViewsCount = (payload.new as { views_count: number })
            .views_count;
          setViewCount(newViewsCount);
        }
      )
      .subscribe();

    // 3. Cleanup function to remove the subscription when the component is no longer displayed
    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId]);

  // Don't render anything until the count has been loaded to prevent a flicker
  if (viewCount === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>
        {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
      </span>
    </div>
  );
};

export default ViewCounter;

