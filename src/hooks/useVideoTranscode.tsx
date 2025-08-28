import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useToast } from './use-toast';

export interface TranscodeProgress {
  phase: 'loading' | 'transcoding' | 'uploading' | 'complete' | 'error';
  percentage: number;
  message: string;
  speed?: string;
  eta?: string;
}

export const useVideoTranscode = () => {
  const [progress, setProgress] = useState<TranscodeProgress>({
    phase: 'loading',
    percentage: 0,
    message: 'Ready to process'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const { toast } = useToast();

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    
    if (!ffmpeg.loaded) {
      setProgress({ phase: 'loading', percentage: 10, message: 'Loading video processor...' });
      
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setProgress({ phase: 'loading', percentage: 100, message: 'Video processor ready' });
    }
  };

  const transcodeVideo = async (
    file: File,
    onTranscoded: (transcodedFile: File) => Promise<void>
  ): Promise<void> => {
    setIsProcessing(true);

    try {
      // Skip transcoding for small files (< 50MB) to speed up process
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB < 50) {
        setProgress({
          phase: 'uploading',
          percentage: 50,
          message: 'File is small, skipping transcoding for faster upload...'
        });
        
        // Upload original file directly
        await onTranscoded(file);
        
        setProgress({
          phase: 'complete',
          percentage: 100,
          message: 'Upload completed successfully!'
        });
        
        return;
      }

      const ffmpeg = ffmpegRef.current;

      // Load FFmpeg if not loaded
      await loadFFmpeg();

      setProgress({ 
        phase: 'transcoding', 
        percentage: 0, 
        message: 'Starting ultra-fast transcoding...' 
      });

      // Set up progress tracking
      ffmpeg.on('progress', ({ progress, time }) => {
        const percentage = Math.round(progress * 100);
        const speed = time > 0 ? `${(time / 1000000).toFixed(1)}x` : '';
        
        setProgress({
          phase: 'transcoding',
          percentage,
          message: `Ultra-fast transcoding... ${percentage}%`,
          speed,
          eta: percentage > 10 ? `${Math.round((100 - percentage) / (percentage / (Date.now() / 1000)))}s` : undefined
        });
      });

      // Write input file
      const inputFileName = 'input.' + file.name.split('.').pop();
      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      // Transcode with ultra-fast settings optimized for speed
      const outputFileName = 'output.mp4';
      
      // Ultra-fast preset for maximum speed
      await ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', 'libx264',           // H.264 codec
        '-preset', 'ultrafast',      // Fastest possible preset
        '-crf', '30',                // Higher CRF for faster encoding
        '-c:a', 'aac',               // AAC audio
        '-b:a', '96k',               // Lower audio bitrate for speed
        '-vf', 'scale=-2:720',       // Scale to 720p for faster processing
        '-r', '24',                  // Limit to 24fps for speed
        '-movflags', '+faststart',   // Web optimization
        '-f', 'mp4',                 // MP4 format
        outputFileName
      ]);

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName);
      const transcodedBlob = new Blob([data], { type: 'video/mp4' });
      const transcodedFile = new File([transcodedBlob], `transcoded_${file.name}.mp4`, {
        type: 'video/mp4'
      });

      setProgress({
        phase: 'transcoding',
        percentage: 100,
        message: 'Ultra-fast transcoding complete! Starting upload...'
      });

      // Clean up FFmpeg files
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      // Now upload the transcoded file
      setProgress({
        phase: 'uploading',
        percentage: 0,
        message: 'Uploading optimized video...'
      });

      await onTranscoded(transcodedFile);

      setProgress({
        phase: 'complete',
        percentage: 100,
        message: 'Upload complete!'
      });

    } catch (error) {
      console.error('Transcoding error:', error);
      setProgress({
        phase: 'error',
        percentage: 0,
        message: 'Transcoding failed. Please try again.'
      });
      
      toast({
        title: "Transcoding Failed",
        description: "There was an error processing your video. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateUploadProgress = (percentage: number) => {
    setProgress(prev => ({
      ...prev,
      phase: 'uploading',
      percentage,
      message: `Uploading... ${percentage}%`
    }));
  };

  return {
    progress,
    isProcessing,
    transcodeVideo,
    updateUploadProgress
  };
};