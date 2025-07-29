import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Share, Navigation, Clock } from "lucide-react";

interface LocationShare {
  id: string;
  user: string;
  latitude: number;
  longitude: number;
  address: string;
  status: string;
  timestamp: string;
}

const mockLocations: LocationShare[] = [
  {
    id: "1",
    user: "Sarah",
    latitude: 40.7829,
    longitude: -73.9654,
    address: "Central Park, NYC",
    status: "Walking in the park 🌳",
    timestamp: "2024-01-20T14:30:00Z"
  }
];

export function LocationSharing() {
  const [locations, setLocations] = useState<LocationShare[]>(mockLocations);
  const [customStatus, setCustomStatus] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const shareLocation = () => {
    if ('geolocation' in navigator) {
      setIsSharing(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: Save to Supabase and reverse geocode
          const newLocation: LocationShare = {
            id: Date.now().toString(),
            user: "You",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Your current location",
            status: customStatus || "Shared my location ❤️",
            timestamp: new Date().toISOString()
          };
          setLocations(prev => [newLocation, ...prev]);
          setCustomStatus("");
          setIsSharing(false);
        },
        () => setIsSharing(false)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Location Sharing</h2>
        <p className="text-muted-foreground">Share your whereabouts with your partner</p>
      </div>

      <Card className="shadow-romantic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="w-5 h-5 text-primary" />
            Share Your Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            placeholder="Add a status (optional)..."
          />
          <Button
            onClick={shareLocation}
            disabled={isSharing}
            className="w-full gap-2 bg-love-gradient"
          >
            <MapPin className="w-4 h-4" />
            {isSharing ? "Getting location..." : "Share Location"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Recent Locations</h3>
        {locations.map((location) => (
          <Card key={location.id} className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">{location.user}</h4>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-sm text-foreground">{location.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(location.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}