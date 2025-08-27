import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, ThumbsUp, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NetflixDetailModalProps {
  content: any;
  contentType: string;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const NetflixDetailModal: React.FC<NetflixDetailModalProps> = ({
  content,
  contentType,
  isOpen,
  onClose,
  onPlay,
  onDelete,
  canDelete = false
}) => {
  const { user } = useAuth();

  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-gray-900 border-gray-700">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Hero Video/Image */}
          <div className="relative aspect-video">
            {content.trailer_url ? (
              <video
                className="w-full h-full object-cover rounded-t-lg"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={content.trailer_url} type="video/mp4" />
              </video>
            ) : content.cover_url ? (
              <img
                src={content.cover_url}
                alt={content.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : content.file_url ? (
              <video
                className="w-full h-full object-cover rounded-t-lg"
                muted
                preload="metadata"
              >
                <source src={content.file_url} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-lg flex items-center justify-center">
                <Play className="h-24 w-24 text-gray-400" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-t-lg"></div>

            {/* Action Buttons Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                  onClick={onPlay}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play
                </Button>
                
                <Button 
                  size="lg"
                  variant="ghost"
                  className="rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/30 p-3"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="ghost"
                  className="rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/30 p-3"
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>

                {canDelete && user && (
                  <Button 
                    size="lg"
                    variant="destructive"
                    className="ml-auto"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white">
                    {contentType.toUpperCase()}
                  </Badge>
                  {content.genre && (
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {content.genre}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {content.title}
                </h1>

                {content.description && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {content.description}
                  </p>
                )}

                {/* Upload Date */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Uploaded: {new Date(content.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Additional Actions */}
                <div className="space-y-3">
                  {content.trailer_url && content.file_url && (
                    <div className="text-gray-300 text-sm">
                      <p className="font-medium mb-2">Available:</p>
                      <ul className="space-y-1">
                        <li>• Full {contentType}</li>
                        <li>• Trailer Preview</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="text-gray-400 text-sm space-y-2">
                  <div>
                    <span className="text-gray-300">Type: </span>
                    {contentType}
                  </div>
                  {content.genre && (
                    <div>
                      <span className="text-gray-300">Genre: </span>
                      {content.genre}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};