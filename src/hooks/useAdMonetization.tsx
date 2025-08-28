import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdBreakConfig {
  contentType: string;
  durationSeconds: number;
  adBreaks: number[];
}

export const useAdMonetization = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate ad breaks based on content type and duration
  const calculateAdBreaks = useCallback((contentType: string, durationSeconds: number): number[] => {
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
  }, []);

  // Update content with ad configuration
  const updateContentAdConfig = useCallback(async (
    contentId: string, 
    durationSeconds: number, 
    contentType: string,
    vastTagUrl?: string
  ) => {
    setIsUpdating(true);
    
    try {
      const adBreaks = calculateAdBreaks(contentType, durationSeconds);
      
      const updateData: any = {
        duration_seconds: durationSeconds,
        ad_breaks: adBreaks,
        monetization_enabled: true
      };

      // Only update VAST tag if provided
      if (vastTagUrl) {
        updateData.vast_tag_url = vastTagUrl;
      }

      const { error } = await supabase
        .from('content')
        .update(updateData)
        .eq('id', contentId);

      if (error) {
        console.error('Error updating ad config:', error);
        throw error;
      }

      console.log(`Ad config updated for content ${contentId}:`, {
        durationSeconds,
        adBreaks,
        contentType
      });

      return { adBreaks, success: true };
    } catch (error) {
      console.error('Failed to update ad config:', error);
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [calculateAdBreaks]);

  // Get default VAST tag URL based on channel
  const getDefaultVastTag = useCallback((channelSlug: string): string => {
    // You'll replace these with your actual GAM VAST tag URLs
    const vastTags = {
      movies: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
      'tv-shows': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
      'music-videos': 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
      stories: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
      default: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
    };

    return vastTags[channelSlug as keyof typeof vastTags] || vastTags.default;
  }, []);

  // Bulk update existing content with ad configuration
  const enableMonetizationForAllContent = useCallback(async () => {
    setIsUpdating(true);
    
    try {
      // Get all content without ad configuration
      const { data: content, error: fetchError } = await supabase
        .from('content')
        .select('id, content_type, stream_id')
        .or('ad_breaks.is.null,duration_seconds.is.null,vast_tag_url.is.null');

      if (fetchError) throw fetchError;

      if (!content || content.length === 0) {
        console.log('No content needs ad configuration update');
        return { success: true, updated: 0 };
      }

      // Update each content item
      const updates = content.map(async (item) => {
        // Estimate duration based on content type (you can improve this with actual video metadata)
        const estimatedDuration = item.content_type === 'Short Story' ? 120 : 1800; // 2min for shorts, 30min for others
        const adBreaks = calculateAdBreaks(item.content_type, estimatedDuration);
        const vastTagUrl = getDefaultVastTag(item.content_type.toLowerCase().replace(' ', '-'));

        return supabase
          .from('content')
          .update({
            duration_seconds: estimatedDuration,
            ad_breaks: adBreaks,
            vast_tag_url: vastTagUrl,
            monetization_enabled: true
          })
          .eq('id', item.id);
      });

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        console.error('Some updates failed:', errors);
      }

      console.log(`Monetization enabled for ${content.length - errors.length} content items`);
      return { success: true, updated: content.length - errors.length, errors: errors.length };
    } catch (error) {
      console.error('Failed to enable bulk monetization:', error);
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [calculateAdBreaks, getDefaultVastTag]);

  return {
    calculateAdBreaks,
    updateContentAdConfig,
    getDefaultVastTag,
    enableMonetizationForAllContent,
    isUpdating
  };
};