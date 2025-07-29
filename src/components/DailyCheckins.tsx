import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Mic, MicOff, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckinPrompt {
  id: string;
  prompt: string;
  category: 'feelings' | 'gratitude' | 'dreams' | 'memories';
}

interface CheckinResponse {
  id: string;
  promptId: string;
  prompt: string;
  response: string;
  date: string;
  author: string;
}

interface ListeningSession {
  id: string;
  speaker: string;
  summary: string;
  date: string;
  duration: number; // in minutes
}

// Mock data
const dailyPrompts: CheckinPrompt[] = [
  { id: "1", prompt: "I feel most loved when you...", category: "feelings" },
  { id: "2", prompt: "I'm grateful for you because...", category: "gratitude" },
  { id: "3", prompt: "My dream for us this week is...", category: "dreams" },
  { id: "4", prompt: "My favorite memory of us lately is...", category: "memories" },
  { id: "5", prompt: "I feel most connected to you when...", category: "feelings" },
];

const mockCheckins: CheckinResponse[] = [
  {
    id: "1",
    promptId: "1",
    prompt: "I feel most loved when you...",
    response: "...hold my hand while we're walking and tell me about your day. Those little moments mean everything to me.",
    date: "2024-01-20",
    author: "Sarah"
  },
];

const mockListeningSessions: ListeningSession[] = [
  {
    id: "1",
    speaker: "Alex",
    summary: "Talked about feeling stressed at work and appreciating Sarah's support. Wants to plan a weekend getaway together.",
    date: "2024-01-19",
    duration: 15
  },
];

export function DailyCheckins() {
  const [checkins, setCheckins] = useState<CheckinResponse[]>(mockCheckins);
  const [listeningSessions, setListeningSessions] = useState<ListeningSession[]>(mockListeningSessions);
  const [currentPrompt, setCurrentPrompt] = useState<CheckinPrompt | null>(null);
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);
  const [mode, setMode] = useState<'checkin' | 'listening'>('checkin');

  // Get today's prompt (rotating through prompts)
  const todayPrompt = dailyPrompts[new Date().getDate() % dailyPrompts.length];

  const handleSubmitCheckin = () => {
    if (!response.trim() || !currentPrompt) return;

    const newCheckin: CheckinResponse = {
      id: Date.now().toString(),
      promptId: currentPrompt.id,
      prompt: currentPrompt.prompt,
      response: response,
      date: new Date().toISOString().split('T')[0],
      author: "You" // Replace with actual user
    };

    setCheckins(prev => [newCheckin, ...prev]);
    setResponse("");
    setCurrentPrompt(null);
  };

  const startListeningSession = () => {
    setIsListening(true);
    setListeningTime(0);
    // TODO: Start timer
  };

  const endListeningSession = () => {
    setIsListening(false);
    // TODO: Show summary form
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feelings': return 'bg-pink-100 text-pink-800';
      case 'gratitude': return 'bg-green-100 text-green-800';
      case 'dreams': return 'bg-purple-100 text-purple-800';
      case 'memories': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Daily Connection</h2>
        <p className="text-muted-foreground">Share your feelings and listen to each other</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'checkin' ? 'default' : 'outline'}
          onClick={() => setMode('checkin')}
          className="gap-2"
        >
          <Heart className="w-4 h-4" />
          Daily Check-in
        </Button>
        <Button
          variant={mode === 'listening' ? 'default' : 'outline'}
          onClick={() => setMode('listening')}
          className="gap-2"
        >
          <Mic className="w-4 h-4" />
          Active Listening
        </Button>
      </div>

      {mode === 'checkin' && (
        <div className="space-y-6">
          {/* Today's Prompt */}
          {!currentPrompt && (
            <Card className="shadow-romantic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Today's Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge className={getCategoryColor(todayPrompt.category)} variant="secondary">
                      {todayPrompt.category}
                    </Badge>
                    <p className="text-lg text-foreground mt-2 mb-4">
                      {todayPrompt.prompt}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setCurrentPrompt(todayPrompt)}
                  className="gap-2 bg-love-gradient"
                >
                  <Heart className="w-4 h-4" />
                  Respond to This
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Response Form */}
          {currentPrompt && (
            <Card className="shadow-romantic">
              <CardHeader>
                <CardTitle>Share Your Heart</CardTitle>
                <p className="text-muted-foreground">{currentPrompt.prompt}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Share your thoughts and feelings..."
                  className="min-h-[120px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitCheckin}
                    className="gap-2 bg-love-gradient"
                    disabled={!response.trim()}
                  >
                    <Send className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPrompt(null);
                      setResponse("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Check-ins */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Recent Check-ins</h3>
            {checkins.map((checkin) => (
              <Card key={checkin.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-love-gradient flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{checkin.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(checkin.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{checkin.prompt}</p>
                  <p className="text-foreground">{checkin.response}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {mode === 'listening' && (
        <div className="space-y-6">
          {/* Active Listening Mode */}
          <Card className="shadow-romantic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                Active Listening Mode
              </CardTitle>
              <p className="text-muted-foreground">
                Give your partner your full attention. Let them speak without interruption.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isListening ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-love-gradient flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Ready to Listen</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a listening session for your partner to share openly
                  </p>
                  <Button
                    onClick={startListeningSession}
                    className="gap-2 bg-love-gradient"
                  >
                    <Mic className="w-4 h-4" />
                    Start Listening
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MicOff className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Listening...</h3>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                    <Clock className="w-4 h-4" />
                    {Math.floor(listeningTime / 60)}:{(listeningTime % 60).toString().padStart(2, '0')}
                  </div>
                  <Button
                    onClick={endListeningSession}
                    variant="outline"
                    className="gap-2"
                  >
                    <MicOff className="w-4 h-4" />
                    End Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Listening Sessions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Recent Sessions</h3>
            {listeningSessions.map((session) => (
              <Card key={session.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <Mic className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{session.speaker} spoke</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground">{session.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}