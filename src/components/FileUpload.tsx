import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void;
  acceptedTypes: string;
  maxSizeMB?: number;
  label: string;
  currentFile?: string;
  uploadType?: 'main' | 'cover' | 'trailer';
}

export const FileUpload = ({ 
  onFileUploaded, 
  acceptedTypes, 
  maxSizeMB = 500, 
  label,
  currentFile,
  uploadType = 'main'
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    // Enhanced file type validation for video files
    if (acceptedTypes.includes('video/*')) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const videoExtensions = [
        'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', 
        '3gp', 'mpg', 'mpeg', 'ogv', 'ts', 'mts', 'm2ts', 'vob'
      ];
      
      const videoMimeTypes = [
        'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
        'video/x-flv', 'video/webm', 'video/x-matroska', 'video/3gpp',
        'video/mpeg', 'video/ogg', 'video/mp2t'
      ];

      const isVideoFile = videoExtensions.includes(fileExtension || '') || 
                          videoMimeTypes.includes(file.type) ||
                          file.type.startsWith('video/');

      if (!isVideoFile) {
        toast({
          title: "Invalid file type",
          description: `Please upload a video file. Supported formats: ${videoExtensions.join(', ').toUpperCase()}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Enhanced file type validation for audio files
    if (acceptedTypes.includes('audio/*')) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const audioExtensions = [
        'mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus'
      ];
      
      const audioMimeTypes = [
        'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac',
        'audio/ogg', 'audio/x-ms-wma', 'audio/mp4', 'audio/opus'
      ];

      const isAudioFile = audioExtensions.includes(fileExtension || '') || 
                          audioMimeTypes.includes(file.type) ||
                          file.type.startsWith('audio/');

      if (!isAudioFile && !acceptedTypes.includes('video/*')) {
        toast({
          title: "Invalid file type",
          description: `Please upload an audio file. Supported formats: ${audioExtensions.join(', ').toUpperCase()}`,
          variant: "destructive"
        });
        return;
      }
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: file.name.split('.').pop()?.toLowerCase()
    });

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${uploadType}/${fileName}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('content-files')
        .upload(filePath, selectedFile);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      onFileUploaded(data.publicUrl, selectedFile.name);
      
      toast({
        title: "Upload successful!",
        description: `${selectedFile.name} has been uploaded.`
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label} *</Label>
      
      {/* File Input */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {!selectedFile && !currentFile ? (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Choose File
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: {acceptedTypes}. Max size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <File className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">
                {selectedFile?.name || (currentFile ? 'File uploaded' : '')}
              </span>
              {!uploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {selectedFile && !uploading && (
              <Button type="button" onClick={uploadFile} className="w-full">
                Upload File
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};