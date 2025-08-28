import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAdMonetization } from '@/hooks/useAdMonetization';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Play, Settings, Zap } from 'lucide-react';

interface AdMonetizationManagerProps {
  className?: string;
}

export const AdMonetizationManager: React.FC<AdMonetizationManagerProps> = ({ className }) => {
  const [vastTagUrl, setVastTagUrl] = useState('');
  const { enableMonetizationForAllContent, isUpdating } = useAdMonetization();
  const { toast } = useToast();

  const handleEnableMonetization = async () => {
    const result = await enableMonetizationForAllContent();
    
    if (result.success) {
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
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Ad Monetization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Status</p>
                    <p className="text-2xl font-bold text-green-700">Active</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Ad Types</p>
                    <p className="text-lg font-semibold text-blue-700">Pre & Mid-roll</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Revenue</p>
                    <p className="text-lg font-semibold text-purple-700">Auto-Split</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ad Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Google Ad Manager Configuration</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Current Setup:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Pre-roll ads:</strong> All videos (5-15 second skip after 5s)</li>
                <li>• <strong>Mid-roll ads:</strong> Long videos (every 12 minutes)</li>
                <li>• <strong>Revenue share:</strong> 55-68% to you, 32-45% to ad network</li>
                <li>• <strong>Ad format:</strong> Skippable video ads via Google IMA SDK</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vast-tag">Custom VAST Tag URL (Optional)</Label>
              <Input
                id="vast-tag"
                placeholder="https://pubads.g.doubleclick.net/gampad/ads?iu=..."
                value={vastTagUrl}
                onChange={(e) => setVastTagUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default Google Ad Manager configuration
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleEnableMonetization} 
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enabling Ads...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Enable Ads on All Videos
                </>
              )}
            </Button>
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">How Automatic Monetization Works:</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Ads are automatically added to all video uploads</li>
              <li>Google IMA SDK serves targeted ads to viewers</li>
              <li>Revenue is automatically split between you and the ad network</li>
              <li>Payments are processed monthly via Google Ad Manager</li>
              <li>Viewers can skip ads after 5 seconds (industry standard)</li>
            </ol>
          </div>

          {/* Setup Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Next Steps for Maximum Revenue:</h4>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Create your Google Ad Manager account (free)</li>
              <li>Set up ad units for your video categories</li>
              <li>Replace the demo VAST tag with your real GAM tag</li>
              <li>Add ads.txt file to your domain</li>
              <li>Connect AdSense for Video for automatic fill</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};