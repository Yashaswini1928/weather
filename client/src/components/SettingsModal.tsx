import { useState, useEffect } from "react";
import { UserSettings } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SettingsModalProps {
  open: boolean;
  settings: UserSettings;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: UserSettings) => void;
}

export default function SettingsModal({
  open,
  settings,
  onOpenChange,
  onSave,
}: SettingsModalProps) {
  const [tempSettings, setTempSettings] = useState<UserSettings>(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(tempSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-darkest">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-6">
          <div>
            <h4 className="font-medium mb-2 text-neutral-darkest">Units</h4>
            <div className="flex items-center justify-between">
              <span>Temperature</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Celsius</span>
                <Switch
                  checked={tempSettings.useImperial}
                  onCheckedChange={(checked) => handleChange('useImperial', checked)}
                />
                <span className="text-sm">Fahrenheit</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span>Wind Speed</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">km/h</span>
                <Switch
                  checked={tempSettings.useImperialWind}
                  onCheckedChange={(checked) => handleChange('useImperialWind', checked)}
                />
                <span className="text-sm">mph</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-neutral-darkest">Appearance</h4>
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Light</span>
                <Switch
                  checked={tempSettings.darkMode}
                  onCheckedChange={(checked) => handleChange('darkMode', checked)}
                />
                <span className="text-sm">Dark</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span>Dynamic Backgrounds</span>
              <Switch
                checked={tempSettings.dynamicBg}
                onCheckedChange={(checked) => handleChange('dynamicBg', checked)}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-neutral-darkest">Notifications</h4>
            <div className="flex items-center justify-between">
              <span>Severe Weather Alerts</span>
              <Switch
                checked={tempSettings.weatherAlerts}
                onCheckedChange={(checked) => handleChange('weatherAlerts', checked)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
