import { Progress } from "@/components/ui/progress";
import { TranscodeProgress } from "@/hooks/useVideoTranscode";
import { CheckCircle, Upload, Settings, AlertCircle, Loader2 } from "lucide-react";

interface VideoProgressTrackerProps {
  progress: TranscodeProgress;
  fileName?: string;
}

export const VideoProgressTracker = ({ progress, fileName }: VideoProgressTrackerProps) => {
  const getIcon = () => {
    switch (progress.phase) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'transcoding':
        return <Settings className="h-5 w-5 animate-spin text-orange-500" />;
      case 'uploading':
        return <Upload className="h-5 w-5 animate-pulse text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (progress.phase) {
      case 'transcoding':
        return 'bg-orange-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="space-y-4 p-6 cinema-card">
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Processing Video</h3>
          {fileName && (
            <p className="text-sm text-muted-foreground">{fileName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{progress.message}</span>
          <span className="text-sm text-muted-foreground">{progress.percentage}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress.percentage} 
            className="h-3"
          />
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {(progress.speed || progress.eta) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            {progress.speed && <span>Speed: {progress.speed}</span>}
            {progress.eta && <span>ETA: {progress.eta}</span>}
          </div>
        )}
      </div>

      {progress.phase === 'transcoding' && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Why transcoding?</p>
          <p>We're optimizing your video for faster streaming and better compatibility across all devices.</p>
        </div>
      )}

      {progress.phase === 'complete' && (
        <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="font-medium">✅ Upload successful!</p>
          <p>Your video has been processed and is ready for streaming.</p>
        </div>
      )}
    </div>
  );
};