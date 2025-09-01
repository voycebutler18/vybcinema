// src/hooks/useViewCounter.ts
import { useEffect, useRef, useState } from "react";
import { getViewCount, recordView, subscribeToViewCount } from "@/lib/views";
import { useAuth } from "@/hooks/useAuth";

const VIEW_QUALIFY_MS = 5000; // 5 seconds

export function useViewCounter(contentId: string) {
  const { user } = useAuth();
  const [views, setViews] = useState<number>(0);

  const countedThisLoadRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    countedThisLoadRef.current = false;

    (async () => {
      const initial = await getViewCount(contentId);
      setViews(initial);
      unsubscribe = subscribeToViewCount(contentId, () => {
        setViews((v) => v + 1);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      countedThisLoadRef.current = false;
    };
  }, [contentId]);

  const qualifyAndRecord = () => {
    if (countedThisLoadRef.current) return;
    countedThisLoadRef.current = true;
    recordView(contentId, user?.id);
  };

  const onPlay = () => {
    if (countedThisLoadRef.current) return;
    if (timerRef.current == null) {
      timerRef.current = window.setTimeout(qualifyAndRecord, VIEW_QUALIFY_MS);
    }
  };

  const onPauseOrStop = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return { views, onPlay, onPauseOrStop };
}
