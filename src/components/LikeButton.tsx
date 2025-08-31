import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Props = {
  contentId?: string;
  size?: "sm" | "default";
};

export const LikeButton: React.FC<Props> = ({ contentId, size = "default" }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { count, liked, loading, toggle } = useLikes(contentId);

  const onClick = async () => {
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
    <Button
      variant={liked ? "default" : "secondary"}
      size={size}
      onClick={onClick}
      disabled={loading || !contentId}
      className={liked ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}
    >
      <ThumbsUp className="h-4 w-4 mr-2" />
      Like
      <span className="ml-2 text-xs opacity-90">{count}</span>
    </Button>
  );
};
