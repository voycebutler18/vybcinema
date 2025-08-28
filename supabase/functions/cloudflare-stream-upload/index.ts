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
    
    if (req.method === 'POST') {
      const formData = await req.formData();
      const videoFile = formData.get('video') as File;
      const contentId = formData.get('contentId') as string;
      
      if (!videoFile || !contentId) {
        return new Response(JSON.stringify({ error: 'Missing video file or content ID' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Starting Cloudflare Stream upload for content ${contentId}`);

      // Upload to Cloudflare Stream
      const uploadFormData = new FormData();
      uploadFormData.append('file', videoFile);
      
      const uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloudflareApiToken}`,
          },
          body: uploadFormData,
        }
      );

      const uploadResult = await uploadResponse.json();
      console.log('Cloudflare Stream upload result:', uploadResult);

      if (!uploadResult.success) {
        throw new Error(`Upload failed: ${uploadResult.errors?.[0]?.message || 'Unknown error'}`);
      }

      const streamId = uploadResult.result.uid;
      const streamUrl = `https://customer-${cloudflareAccountId.split('-')[0]}.cloudflarestream.com/${streamId}/manifest/video.m3u8`;
      const thumbnailUrl = `https://customer-${cloudflareAccountId.split('-')[0]}.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg`;

      // Update content record with stream info
      const { error: updateError } = await supabase
        .from('content')
        .update({
          stream_id: streamId,
          stream_status: 'processing',
          stream_url: streamUrl,
          stream_thumbnail_url: thumbnailUrl,
        })
        .eq('id', contentId);

      if (updateError) {
        console.error('Error updating content:', updateError);
        throw new Error('Failed to update content record');
      }

      return new Response(JSON.stringify({
        success: true,
        streamId,
        streamUrl,
        thumbnailUrl,
        status: 'processing'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET method - check stream status
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const streamId = url.searchParams.get('streamId');
      
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
      
      if (statusResult.success) {
        const status = statusResult.result.status?.state || 'processing';
        
        // Update database if stream is ready
        if (status === 'ready') {
          const { error: updateError } = await supabase
            .from('content')
            .update({ stream_status: 'ready' })
            .eq('stream_id', streamId);
            
          if (updateError) {
            console.error('Error updating stream status:', updateError);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          status,
          streamId
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