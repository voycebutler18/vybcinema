import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdMonetization } from '@/hooks/useAdMonetization';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign } from 'lucide-react';

export const AdMonetizationManager = () => {
  const { toast } = useToast();
  const { enableMonetizationForAllContent, isUpdating } = useAdMonetization();
  const [stats, setStats] = useState({ total: 0, monetized: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from('content')
        .select('monetization_enabled');
      
      const total = data?.length || 0;
      const monetized = data?.filter(item => item.monetization_enabled).length || 0;
      setStats({ total, monetized });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEnableMonetization = async () => {
    const result = await enableMonetizationForAllContent();
    
    if (result.success) {
      await fetchStats();
      toast({
        title: "Monetization Enabled",
        description: `Successfully enabled ads for ${result.updated} videos. Revenue will start generating automatically.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to enable monetization. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="cinema-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Ad Monetization</h2>
        <Badge variant="secondary" className="bg-green-500/10 text-green-400">
          Active
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-cinema-gradient">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Videos</div>
          </div>
          <div className="text-center p-4 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-cinema-gradient">{stats.monetized}</div>
            <div className="text-sm text-muted-foreground">Monetized</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>✓ Google AdSense integrated</p>
          <p>✓ Pre-roll ads on all videos</p>
          <p>✓ Revenue sharing: 68% to you, 32% to ads</p>
          <p>✓ Automatic ad optimization</p>
        </div>

        <Button 
          onClick={handleEnableMonetization}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Enable Ads on All Videos
            </>
          )}
        </Button>
      </div>
    </div>
  );
};