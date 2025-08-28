import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  uid: string;
  status: {
    state: string;
  };
  meta: {
    name?: string;
  };
  duration?: number;
  playback?: {
    hls?: string;
    dash?: string;
  };
  thumbnail?: string;
  preview?: string;
}

// Calculate ad breaks based on content type and duration
function calculateAdBreaks(contentType: string, durationSeconds: number): number[] {
  const breaks: number[] = [0]; // Always include preroll

  // Short content (under 3 minutes) - preroll only
  if (durationSeconds < 180) {
    return breaks;
  }

  // Long content - add midrolls every 12 minutes (720 seconds)
  const midrollInterval = 720; // 12 minutes
  let nextBreak = midrollInterval;
  
  while (nextBreak < durationSeconds - 60) { // Don't put ads in last minute
    breaks.push(nextBreak);
    nextBreak += midrollInterval;
  }

  return breaks;
}

// Get VAST tag URL based on content type
function getVastTagUrl(contentType: string): string {
  // Default Google Ad Manager VAST tag (replace with your actual GAM tags)
  const vastTags = {
    'Movie': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
    'TV Show': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
    'Music Video': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
    'Short Story': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
    'default': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
  };

  return vastTags[contentType as keyof typeof vastTags] || vastTags.default;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const webhookData: WebhookPayload = await req.json();
    console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

    // Only process when video is ready
    if (webhookData.status?.state !== 'ready') {
      console.log('Video not ready yet, skipping ad configuration');
      return new Response(JSON.stringify({ message: 'Video not ready' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const streamId = webhookData.uid;
    const durationSeconds = webhookData.duration || 0;

    // Find the content record with this stream ID
    const { data: contentData, error: fetchError } = await supabaseAdmin
      .from('content')
      .select('id, content_type, vast_tag_url, ad_breaks')
      .eq('stream_id', streamId)
      .single();

    if (fetchError) {
      console.error('Error finding content:', fetchError);
      return new Response(JSON.stringify({ error: 'Content not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Calculate ad breaks for this content
    const adBreaks = calculateAdBreaks(contentData.content_type, durationSeconds);
    const vastTagUrl = contentData.vast_tag_url || getVastTagUrl(contentData.content_type);

    console.log('Configuring ads:', {
      contentId: contentData.id,
      contentType: contentData.content_type,
      durationSeconds,
      adBreaks,
      vastTagUrl: vastTagUrl.substring(0, 100) + '...'
    });

    // Update content with ad configuration
    const { error: updateError } = await supabaseAdmin
      .from('content')
      .update({
        duration_seconds: durationSeconds,
        ad_breaks: adBreaks,
        vast_tag_url: vastTagUrl,
        monetization_enabled: true,
        // Also update with stream metadata if available
        stream_thumbnail_url: webhookData.thumbnail || null,
        playback_id: streamId // Cloudflare Stream uses UID as playback ID
      })
      .eq('id', contentData.id);

    if (updateError) {
      console.error('Error updating content with ad config:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to configure ads' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`Successfully configured ads for content ${contentData.id}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Ad configuration completed',
      contentId: contentData.id,
      adBreaks,
      durationSeconds,
      monetizationEnabled: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in auto-configure-ads function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});