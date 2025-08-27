-- Update the content type check constraint to include podcast
ALTER TABLE public.content DROP CONSTRAINT content_content_type_check;

ALTER TABLE public.content ADD CONSTRAINT content_content_type_check 
CHECK (content_type IN ('movie', 'tv_show', 'music_video', 'story', 'podcast'));

-- Add live streaming functionality
CREATE TABLE public.live_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  stream_key TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on live streams
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

-- Live streams policies
CREATE POLICY "Live streams are viewable by everyone" 
ON public.live_streams 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own streams" 
ON public.live_streams 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streams" 
ON public.live_streams 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streams" 
ON public.live_streams 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for live streams timestamp updates
CREATE TRIGGER update_live_streams_updated_at
  BEFORE UPDATE ON public.live_streams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();