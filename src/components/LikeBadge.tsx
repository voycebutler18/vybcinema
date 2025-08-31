import { ThumbsUp } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Props = {
  contentId?: string;
  className?: string;
};

export const LikeBadge: React.FC<Props> = ({ contentId, className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { count, liked, toggle } = useLikes(contentId);

  const handle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in to like",
        description: "Create a free account to like videos.",
      });
      return;
    }
    await toggle();
  };

  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-black/60 backdrop-blur border border-white/15 text-white hover:bg-black/70 ${className || ""}`}
      aria-label="Like"
      title="Like"
    >
      <ThumbsUp className={`h-3.5 w-3.5 ${liked ? "text-pink-400" : "text-white"}`} />
      <span>{count}</span>
    </button>
  );
};
