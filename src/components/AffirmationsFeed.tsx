import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Plus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Affirmation {
  id: string;
  author: string;
  content: string;
  hearts: number;
  hearted: boolean;
  date: string;
  read: boolean;
}

// Mock data
const mockAffirmations: Affirmation[] = [
  {
    id: "1",
    author: "Sarah",
    content: "Alex, your smile lights up my entire world. Thank you for being the most amazing partner I could ever ask for. I love how you always make me laugh, even on my hardest days. ❤️",
    hearts: 1,
    hearted: true,
    date: "2024-01-20T10:30:00Z",
    read: true
  },
  {
    id: "2",
    author: "Alex",
    content: "Sarah, I'm so grateful for your endless patience and kindness. You make me want to be a better person every single day. I love you more than words can express.",
    hearts: 1,
    hearted: true,
    date: "2024-01-19T18:45:00Z",
    read: true
  },
  {
    id: "3",
    author: "Sarah",
    content: "Just wanted to remind you how proud I am of everything you've accomplished. Your determination inspires me daily. 💕",
    hearts: 0,
    hearted: false,
    date: "2024-01-18T14:20:00Z",
    read: false
  },
];

export function AffirmationsFeed() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>(mockAffirmations);
  const [isComposing, setIsComposing] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState("");

  const unreadCount = affirmations.filter(a => !a.read).length;

  const toggleHeart = (affirmationId: string) => {
    setAffirmations(prev => prev.map(affirmation => {
      if (affirmation.id === affirmationId) {
        const hearted = !affirmation.hearted;
        return {
          ...affirmation,
          hearted,
          hearts: hearted ? affirmation.hearts + 1 : affirmation.hearts - 1
        };
      }
      return affirmation;
    }));
  };

  const markAsRead = (affirmationId: string) => {
    setAffirmations(prev => prev.map(affirmation =>
      affirmation.id === affirmationId 
        ? { ...affirmation, read: true }
        : affirmation
    ));
  };

  const handleSubmitAffirmation = () => {
    if (!newAffirmation.trim()) return;

    const affirmation: Affirmation = {
      id: Date.now().toString(),
      author: "You", // Replace with actual user name
      content: newAffirmation,
      hearts: 0,
      hearted: false,
      date: new Date().toISOString(),
      read: false
    };

    setAffirmations(prev => [affirmation, ...prev]);
    setNewAffirmation("");
    setIsComposing(false);
  };

  const markAllAsRead = () => {
    setAffirmations(prev => prev.map(affirmation => ({ ...affirmation, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">Love Feed</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-primary animate-heart-pulse">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Share affirmations and appreciation</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          <Button
            onClick={() => setIsComposing(true)}
            className="gap-2 bg-love-gradient hover:shadow-romantic"
          >
            <Plus className="w-4 h-4" />
            New Affirmation
          </Button>
        </div>
      </div>

      {/* Compose Form */}
      {isComposing && (
        <Card className="shadow-romantic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Share Your Love
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="Write something beautiful about your partner... Express your gratitude, share what you love about them, or send encouragement for their day."
              className="min-h-[120px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitAffirmation}
                className="gap-2 bg-love-gradient"
                disabled={!newAffirmation.trim()}
              >
                <Send className="w-4 h-4" />
                Share Love
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsComposing(false);
                  setNewAffirmation("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affirmations Feed */}
      <div className="space-y-4">
        {affirmations.map((affirmation) => (
          <Card 
            key={affirmation.id} 
            className={cn(
              "shadow-soft hover:shadow-romantic transition-all duration-300",
              !affirmation.read && "ring-2 ring-primary/20"
            )}
            onClick={() => !affirmation.read && markAsRead(affirmation.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-love-gradient flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{affirmation.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(affirmation.date).toLocaleDateString()} at{" "}
                      {new Date(affirmation.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                {!affirmation.read && (
                  <Badge variant="default" className="bg-primary">
                    New
                  </Badge>
                )}
              </div>

              <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                {affirmation.content}
              </p>

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHeart(affirmation.id);
                  }}
                  className={cn(
                    "gap-2 transition-all duration-200",
                    affirmation.hearted && "text-red-500 hover:text-red-600"
                  )}
                >
                  <Heart 
                    className={cn(
                      "w-4 h-4 transition-all duration-200",
                      affirmation.hearted ? "fill-current scale-110" : "hover:scale-110"
                    )} 
                  />
                  {affirmation.hearts > 0 && affirmation.hearts}
                  {affirmation.hearted ? "Loved" : "Love"}
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {affirmations.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Heart className="w-12 h-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">No affirmations yet</h3>
              <p className="text-muted-foreground mb-4">Start spreading love with your first affirmation</p>
              <Button
                onClick={() => setIsComposing(true)}
                className="gap-2 bg-love-gradient"
              >
                <Heart className="w-4 h-4" />
                Share Your First Affirmation
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}