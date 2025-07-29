import { Heart, Camera, MessageCircle, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-heart-pulse" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to LoveSync</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your private space to connect, share memories, and strengthen your bond together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft hover:shadow-romantic transition-all duration-300 cursor-pointer" onClick={() => onNavigate('memories')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Memories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Share photos and videos of your beautiful moments together.</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-romantic transition-all duration-300 cursor-pointer" onClick={() => onNavigate('letters')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Love Letters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Write heartfelt messages to express your deepest feelings.</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-romantic transition-all duration-300 cursor-pointer" onClick={() => onNavigate('affirmations')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Love Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Share daily affirmations and appreciation for each other.</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-romantic transition-all duration-300 cursor-pointer" onClick={() => onNavigate('location')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Share your whereabouts and stay connected throughout the day.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}