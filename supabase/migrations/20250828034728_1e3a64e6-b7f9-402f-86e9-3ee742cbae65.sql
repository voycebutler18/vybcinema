-- Add ad-related fields to content table
ALTER TABLE public.content 
ADD COLUMN vast_tag_url TEXT,
ADD COLUMN ad_breaks INTEGER[] DEFAULT '{}',
ADD COLUMN duration_seconds INTEGER,
ADD COLUMN monetization_enabled BOOLEAN DEFAULT true;

-- Add index for performance
CREATE INDEX idx_content_monetization ON public.content(monetization_enabled) WHERE monetization_enabled = true;

-- Update existing content to have default ad breaks based on content type
UPDATE public.content 
SET ad_breaks = CASE 
  WHEN content_type = 'Short Story' THEN '{0}'::INTEGER[] -- preroll only for shorts
  ELSE '{0, 720, 1440, 2160}'::INTEGER[] -- preroll + midrolls every 12min for long content
END
WHERE ad_breaks IS NULL OR ad_breaks = '{}';

-- Set a default VAST tag URL (you'll replace this with your actual GAM tag)
UPDATE public.content 
SET vast_tag_url = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
WHERE vast_tag_url IS NULL;