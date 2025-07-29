import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, Send, Heart, Image, Mic, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoveLetter {
  id: string;
  from: string;
  to: string;
  content: string;
  date: string;
  attachments?: {
    type: 'image' | 'voice';
    url: string;
    name: string;
  }[];
  read: boolean;
}

// Mock data
const mockLetters: LoveLetter[] = [
  {
    id: "1",
    from: "Sarah",
    to: "Alex",
    content: "My dearest Alex, I woke up this morning thinking about our conversation last night. Your laugh still echoes in my mind, and I can't help but smile...",
    date: "2024-01-20T14:30:00Z",
    read: true,
    attachments: [
      { type: "image", url: "/sunrise.jpg", name: "Our sunrise" }
    ]
  },
  {
    id: "2",
    from: "Alex",
    to: "Sarah",
    content: "Sarah, my love, every day with you feels like a beautiful dream. I wanted to tell you how much yesterday meant to me...",
    date: "2024-01-19T20:15:00Z",
    read: true,
    attachments: [
      { type: "voice", url: "/voice-note.mp3", name: "Voice message" }
    ]
  },
];

export function LoveLetters() {
  const [letters, setLetters] = useState<LoveLetter[]>(mockLetters);
  const [isComposing, setIsComposing] = useState(false);
  const [newLetter, setNewLetter] = useState("");
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set());

  const toggleExpanded = (letterId: string) => {
    const newExpanded = new Set(expandedLetters);
    if (newExpanded.has(letterId)) {
      newExpanded.delete(letterId);
    } else {
      newExpanded.add(letterId);
    }
    setExpandedLetters(newExpanded);
  };

  const handleSendLetter = () => {
    if (!newLetter.trim()) return;
    
    // TODO: Send to Supabase
    const letter: LoveLetter = {
      id: Date.now().toString(),
      from: "You", // Replace with actual user name
      to: "Partner", // Replace with partner name
      content: newLetter,
      date: new Date().toISOString(),
      read: false
    };
    
    setLetters(prev => [letter, ...prev]);
    setNewLetter("");
    setIsComposing(false);
  };

  if (isComposing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Write a Love Letter</h2>
          <Button
            variant="outline"
            onClick={() => setIsComposing(false)}
          >
            Cancel
          </Button>
        </div>

        <Card className="shadow-romantic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-primary" />
              To My Beloved
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newLetter}
              onChange={(e) => setNewLetter(e.target.value)}
              placeholder="Pour your heart out... Write about your feelings, memories, dreams for the future together..."
              className="min-h-[300px] resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Image className="w-4 h-4" />
                  Add Photo
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Note
                </Button>
              </div>
              
              <Button 
                onClick={handleSendLetter}
                className="gap-2 bg-love-gradient hover:shadow-romantic"
                disabled={!newLetter.trim()}
              >
                <Send className="w-4 h-4" />
                Send Letter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Love Letters</h2>
          <p className="text-muted-foreground">Heartfelt messages between you and your partner</p>
        </div>
        <Button
          onClick={() => setIsComposing(true)}
          className="gap-2 bg-love-gradient hover:shadow-romantic"
        >
          <PenTool className="w-4 h-4" />
          Write Letter
        </Button>
      </div>

      {/* Letters Archive */}
      <div className="space-y-4">
        {letters.map((letter) => {
          const isExpanded = expandedLetters.has(letter.id);
          const previewLength = 150;
          const shouldTruncate = letter.content.length > previewLength;
          const displayContent = isExpanded || !shouldTruncate 
            ? letter.content 
            : letter.content.substring(0, previewLength) + "...";

          return (
            <Card key={letter.id} className="shadow-soft hover:shadow-romantic transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-love-gradient flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">From {letter.from}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(letter.date).toLocaleDateString()} at {new Date(letter.date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  {!letter.read && (
                    <Badge variant="default" className="bg-primary">New</Badge>
                  )}
                </div>

                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                  </p>
                </div>

                {shouldTruncate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(letter.id)}
                    className="gap-2 text-primary hover:text-primary"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}

                {letter.attachments && letter.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Attachments</h4>
                    <div className="flex gap-2">
                      {letter.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg text-sm"
                        >
                          {attachment.type === 'image' ? (
                            <Image className="w-4 h-4 text-primary" />
                          ) : (
                            <Mic className="w-4 h-4 text-primary" />
                          )}
                          {attachment.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {letters.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <PenTool className="w-12 h-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">No letters yet</h3>
              <p className="text-muted-foreground mb-4">Start expressing your love with your first letter</p>
              <Button
                onClick={() => setIsComposing(true)}
                className="gap-2 bg-love-gradient"
              >
                <PenTool className="w-4 h-4" />
                Write Your First Letter
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}