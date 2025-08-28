import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const cloudflareAccountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')!;
const cloudflareApiToken = Deno.env.get('CLOUDFLARE_API_TOKEN')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.text();
    const data = JSON.parse(body);
    
    if (data.action === 'get_upload_url') {
      // Create direct upload URL
      const uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            maxDurationSeconds: 3600,
            requireSignedURLs: false,
          }),
        }
      );

      const uploadResult = await uploadResponse.json();
      console.log('Cloudflare Stream direct upload result:', uploadResult);

      if (!uploadResult.success) {
        throw new Error(`Upload URL creation failed: ${uploadResult.errors?.[0]?.message || 'Unknown error'}`);
      }

      const streamId = uploadResult.result.uid;
      const uploadURL = uploadResult.result.uploadURL;

      // Create content record
      const { data: content, error: contentError } = await supabase
        .from('content')
        .insert({
          title: data.title,
          description: data.description,
          content_type: data.content_type,
          genre: data.genre,
          user_id: data.user_id,
          stream_id: streamId,
          stream_status: 'pending'
        })
        .select()
        .single();

      if (contentError) throw contentError;

      return new Response(JSON.stringify({
        success: true,
        streamId,
        uploadURL,
        contentId: content.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (data.action === 'check_status') {
      const streamId = data.streamId;
      
      if (!streamId) {
        return new Response(JSON.stringify({ error: 'Missing stream ID' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const statusResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${streamId}`,
        {
          headers: {
            'Authorization': `Bearer ${cloudflareApiToken}`,
          },
        }
      );

      const statusResult = await statusResponse.json();
      console.log('Stream status check:', statusResult);
      
      if (statusResult.success) {
        const status = statusResult.result.status?.state || 'pending';
        const playbackId = statusResult.result.playback?.id;
        
        // Update database when stream is ready
        if (status === 'ready' && playbackId) {
          const { error: updateError } = await supabase
            .from('content')
            .update({ 
              stream_status: 'ready',
              playback_id: playbackId,
              stream_thumbnail_url: `https://videodelivery.net/${playbackId}/thumbnails/thumbnail.jpg`
            })
            .eq('stream_id', streamId);
            
          if (updateError) {
            console.error('Error updating stream status:', updateError);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          status,
          streamId,
          playbackId,
          ready: status === 'ready'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cloudflare Stream error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});