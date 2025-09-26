import { useState } from 'react';
import { ArrowLeft, Check, MapPin, Plus, X, Target, ZoomIn, ZoomOut, Layers, Navigation, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ServiceAreaProps {
  onBack: () => void;
}

export default function ServiceArea({ onBack }: ServiceAreaProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');
  const [primaryZoneActive, setPrimaryZoneActive] = useState(true);
  const [extendedZoneActive, setExtendedZoneActive] = useState(true);
  const [primaryRadius, setPrimaryRadius] = useState([15]);
  const [extendedRadius, setExtendedRadius] = useState([25]);
  const [maxTravelTime, setMaxTravelTime] = useState([35]);
  const [rushHourAdjustment, setRushHourAdjustment] = useState(false);
  const [routeOptimization, setRouteOptimization] = useState(true);
  const [returnTripPlanning, setReturnTripPlanning] = useState(true);
  const [trafficConsideration, setTrafficConsideration] = useState(false);
  const [fuelEfficiencyToggle, setFuelEfficiencyToggle] = useState(true);

  const [notifications, setNotifications] = useState({
    primaryZoneJobs: true,
    extendedZoneJobs: true,
    highValueJobs: true,
    lastMinuteJobs: false,
    trafficDelays: true,
    weatherImpacts: true,
    surgePricing: true
  });

  const handleSliderChange = (field: string, value: number[]) => {
    if (field === 'primaryRadius') setPrimaryRadius(value);
    else if (field === 'extendedRadius') setExtendedRadius(value);
    else if (field === 'maxTravelTime') setMaxTravelTime(value);

    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 2000);
  };

  const handleToggleChange = (field: string, checked: boolean) => {
    if (field === 'primaryZoneActive') setPrimaryZoneActive(checked);
    else if (field === 'extendedZoneActive') setExtendedZoneActive(checked);
    else if (field === 'rushHourAdjustment') setRushHourAdjustment(checked);
    else if (field === 'routeOptimization') setRouteOptimization(checked);
    else if (field === 'returnTripPlanning') setReturnTripPlanning(checked);
    else if (field === 'trafficConsideration') setTrafficConsideration(checked);
    else if (field === 'fuelEfficiencyToggle') setFuelEfficiencyToggle(checked);

    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 2000);
  };

  const handleNotificationToggle = (field: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: checked }));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 2000);
  };

  const excludedAreas = [
    {
      id: '1',
      name: 'Downtown Financial District',
      reason: 'Parking difficulties',
      coverage: '0.8 sq miles excluded'
    },
    {
      id: '2',
      name: 'Highway 101 Corridor',
      reason: 'Safety concerns',
      coverage: '2.1 sq miles excluded'
    }
  ];

  const demandZones = [
    { name: 'Residential Hills', benefit: '+25% higher tips' },
    { name: 'University District', benefit: 'Quick jobs, frequent bookings' },
    { name: 'Business Park', benefit: 'Weekend premium rates' }
  ];

  return (
    <div className="pb-5 relative" data-testid="screen-service-area">
      <main className="pt-[44px] px-5">
        {/* Header */}
        <header className="bg-background-dark p-5 flex items-center justify-between fixed top-0 left-0 right-0 z-10 max-w-mobile mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 text-white"
            data-testid="back-button"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Service Area</h1>
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1 text-success-green text-sm">
                <Check className="h-4 w-4" />
                <span>Auto-saved</span>
              </div>
            )}
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Saving...</span>
              </div>
            )}
          </div>
        </header>

        {/* Current Status Overview */}
        <section className="mt-6 bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-white">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Active in 2 zones</h2>
            <p className="text-sm opacity-80">~20 mile radius</p>
            <p className="text-sm opacity-80">15-25 jobs available</p>
            <p className="text-sm opacity-70">Average 18 min drive time</p>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="mt-6 bg-card rounded-2xl p-4">
          <div className="relative h-62 bg-gray-800 rounded-xl overflow-hidden">
            {/* Mock Map Interface */}
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
                <p className="text-white text-sm">Interactive Map</p>
                <p className="text-gray-400 text-xs">Service Area Coverage</p>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-100">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-100">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-100">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-4">
                <Button size="sm" className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-100">
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Service Zone */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Primary Service Area</h3>
            <Switch
              checked={primaryZoneActive}
              onCheckedChange={(checked) => handleToggleChange('primaryZoneActive', checked)}
            />
          </div>

          {primaryZoneActive && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="text-sm text-white">{primaryRadius[0]} miles from home</span>
                </div>
                <Slider
                  value={primaryRadius}
                  onValueChange={(value) => handleSliderChange('primaryRadius', value)}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-success-green">Higher paying jobs offered first</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">2-minute response window</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">No additional mileage fees</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-white">12-18 available</p>
                  <p className="text-xs text-muted-foreground">Weekly jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-success-green">$45-65 per job</p>
                  <p className="text-xs text-muted-foreground">Average earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average 12 min</p>
                  <p className="text-xs text-muted-foreground">Drive time</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Extended Service Zone */}
        <section className="mt-4 bg-card rounded-2xl p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Extended Service Area</h3>
            <Switch
              checked={extendedZoneActive}
              onCheckedChange={(checked) => handleToggleChange('extendedZoneActive', checked)}
            />
          </div>

          {extendedZoneActive && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Total Radius</span>
                  <span className="text-sm text-white">{extendedRadius[0]} miles total radius</span>
                </div>
                <Slider
                  value={extendedRadius}
                  onValueChange={(value) => handleSliderChange('extendedRadius', value)}
                  max={50}
                  min={16}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {extendedRadius[0] - primaryRadius[0]} miles beyond primary zone
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-500">$75 minimum job value</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-500">+$0.65 per mile over 20 miles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">5-minute response window</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-white">3-7 per week</p>
                  <p className="text-xs text-muted-foreground">Additional jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-success-green">$85-120 per job</p>
                  <p className="text-xs text-muted-foreground">Average earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average 28 min</p>
                  <p className="text-xs text-muted-foreground">Drive time</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Zone Exclusions */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Excluded Areas</h3>
            <p className="text-sm text-muted-foreground">Areas you don't want to service</p>
          </div>

          <div className="space-y-3 mb-4">
            {excludedAreas.map((area) => (
              <div key={area.id} className="flex items-center justify-between p-3 bg-background-dark rounded-xl">
                <div className="flex-1">
                  <p className="font-medium">{area.name}</p>
                  <p className="text-sm text-muted-foreground">{area.reason}</p>
                  <p className="text-xs text-muted-foreground">{area.coverage}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-red-500 p-1">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-dashed border-2 border-gray-600 text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Excluded Area
          </Button>
        </section>

        {/* Travel & Timing Preferences */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4">Travel & Timing Preferences</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Maximum travel time</span>
                <span className="text-sm text-white">{maxTravelTime[0]} minutes maximum drive</span>
              </div>
              <Slider
                value={maxTravelTime}
                onValueChange={(value) => handleSliderChange('maxTravelTime', value)}
                max={60}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Rush hour adjustment</p>
                <p className="text-xs text-muted-foreground">+15 minutes during peak hours</p>
              </div>
              <Switch
                checked={rushHourAdjustment}
                onCheckedChange={(checked) => handleToggleChange('rushHourAdjustment', checked)}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm">Accept clustered jobs</span>
                <Switch
                  checked={routeOptimization}
                  onCheckedChange={(checked) => handleToggleChange('routeOptimization', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Consider return distance</span>
                <Switch
                  checked={returnTripPlanning}
                  onCheckedChange={(checked) => handleToggleChange('returnTripPlanning', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avoid high-traffic times</span>
                <Switch
                  checked={trafficConsideration}
                  onCheckedChange={(checked) => handleToggleChange('trafficConsideration', checked)}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <p className="text-sm text-muted-foreground mb-2">Current local average: $4.85/gal</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Decline jobs under $2.00/mile</span>
                <Switch
                  checked={fuelEfficiencyToggle}
                  onCheckedChange={(checked) => handleToggleChange('fuelEfficiencyToggle', checked)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Demand & Pricing Intelligence */}
        <section className="mt-6 bg-card rounded-2xl p-5 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4">Area Insights</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">High-demand zones (within your area):</h4>
              <div className="space-y-2">
                {demandZones.map((zone, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{zone.name}:</span>
                    <span className="text-sm text-success-green">{zone.benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Market competition:</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">12 other providers nearby</p>
                <p className="text-sm text-yellow-500">Moderate competition</p>
                <p className="text-sm text-success-green">7.2/10 earning potential</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Seasonal patterns:</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Peak seasons: Spring cleaning (Mar-May)</p>
                <p className="text-sm text-muted-foreground">Slow periods: Post-holidays (Jan-Feb)</p>
                <p className="text-sm text-success-green">Current trend: Above average demand</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4">Job Alert Configuration</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">New job notifications:</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">Primary zone jobs</span>
                    <p className="text-xs text-muted-foreground">Immediate notifications</p>
                  </div>
                  <Switch
                    checked={notifications.primaryZoneJobs}
                    onCheckedChange={(checked) => handleNotificationToggle('primaryZoneJobs', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">Extended zone jobs</span>
                    <p className="text-xs text-muted-foreground">Immediate notifications</p>
                  </div>
                  <Switch
                    checked={notifications.extendedZoneJobs}
                    onCheckedChange={(checked) => handleNotificationToggle('extendedZoneJobs', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">High-value jobs</span>
                    <p className="text-xs text-muted-foreground">Even outside normal hours</p>
                  </div>
                  <Switch
                    checked={notifications.highValueJobs}
                    onCheckedChange={(checked) => handleNotificationToggle('highValueJobs', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">Last-minute jobs</span>
                    <p className="text-xs text-muted-foreground">Within 2 hours of start time</p>
                  </div>
                  <Switch
                    checked={notifications.lastMinuteJobs}
                    onCheckedChange={(checked) => handleNotificationToggle('lastMinuteJobs', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-3">Location-based alerts:</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warn of delays to job sites</span>
                  <Switch
                    checked={notifications.trafficDelays}
                    onCheckedChange={(checked) => handleNotificationToggle('trafficDelays', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert for weather affecting travel</span>
                  <Switch
                    checked={notifications.weatherImpacts}
                    onCheckedChange={(checked) => handleNotificationToggle('weatherImpacts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notify when rates increase in your area</span>
                  <Switch
                    checked={notifications.surgePricing}
                    onCheckedChange={(checked) => handleNotificationToggle('surgePricing', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area Analytics */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4">30-Day Performance</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-white">47 jobs</p>
                <p className="text-xs text-muted-foreground">Jobs completed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">16.2 minutes</p>
                <p className="text-xs text-muted-foreground">Average drive time</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">$3.20 per job</p>
                <p className="text-xs text-muted-foreground">Fuel cost</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">74%</p>
                <p className="text-xs text-muted-foreground">Time utilization</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Zone performance comparison:</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Primary zone:</span>
                  <span className="text-sm text-success-green">38 jobs, $52 avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Extended zone:</span>
                  <span className="text-sm text-success-green">9 jobs, $89 avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue per mile:</span>
                  <span className="text-sm text-muted-foreground">$4.85 primary, $3.20 extended</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Optimization suggestions:</h4>
              <div className="space-y-1">
                <p className="text-sm text-orange-500">Consider reducing extended zone by 3 miles</p>
                <p className="text-sm text-orange-500">Add exclusion for Industrial District (low-value jobs)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Save & Apply Changes */}
        <section className="mt-6 bg-card rounded-2xl p-5">
          <Button className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold">
            Update Service Area
          </Button>

          <div className="mt-3 text-center">
            <p className="text-sm text-muted-foreground">Changes take effect immediately for new job offers</p>
            <p className="text-sm text-success-green mt-1">+2 jobs per week with current settings</p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="ghost" className="text-muted-foreground text-sm p-0">
              Reset to Defaults
            </Button>
            <Button variant="ghost" className="text-primary text-sm p-0">
              Export Settings
            </Button>
          </div>
        </section>

        <div className="h-20" /> {/* Bottom padding for navigation */}
      </main>
    </div>
  );
}