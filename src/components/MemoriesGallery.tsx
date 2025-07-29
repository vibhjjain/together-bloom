import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Download, Heart, MapPin, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Memory {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  date: string;
  location?: string;
  loved: boolean;
  caption?: string;
}

// Mock data - replace with real data from Supabase later
const mockMemories: Memory[] = [
  {
    id: "1",
    type: "photo",
    url: "/placeholder-photo.jpg",
    date: "2024-01-15",
    location: "Central Park, NYC",
    loved: true,
    caption: "Our first walk together ❤️"
  },
  {
    id: "2",
    type: "video",
    url: "/placeholder-video.mp4",
    thumbnail: "/placeholder-video-thumb.jpg",
    date: "2024-01-20",
    location: "Home",
    loved: false,
    caption: "Cooking dinner together"
  },
  // Add more mock memories...
];

export function MemoriesGallery() {
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filterByLoved, setFilterByLoved] = useState(false);

  const toggleLove = (memoryId: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? { ...memory, loved: !memory.loved }
        : memory
    ));
  };

  const filteredMemories = filterByLoved 
    ? memories.filter(memory => memory.loved)
    : memories;

  const sortedMemories = [...filteredMemories].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Our Memories</h2>
          <p className="text-muted-foreground">Beautiful moments we've shared together</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterByLoved ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterByLoved(!filterByLoved)}
            className="gap-2"
          >
            <Heart className={cn("w-4 h-4", filterByLoved && "fill-current")} />
            Loved Only
          </Button>
          <Button className="gap-2 bg-love-gradient hover:shadow-romantic">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedMemories.map((memory) => (
          <Card 
            key={memory.id} 
            className="overflow-hidden cursor-pointer hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setSelectedMemory(memory)}
          >
            <CardContent className="p-0 relative aspect-square">
              <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                {memory.type === 'photo' ? (
                  <img 
                    src={memory.url} 
                    alt={memory.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3EPhoto%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full bg-accent/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>

              {/* Love indicator */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLove(memory.id);
                }}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-colors",
                    memory.loved ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )} 
                />
              </Button>

              {/* Date badge */}
              <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                {new Date(memory.date).toLocaleDateString()}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white/90"
              onClick={() => setSelectedMemory(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="relative">
              {selectedMemory.type === 'photo' ? (
                <img 
                  src={selectedMemory.url} 
                  alt={selectedMemory.caption}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <video 
                  src={selectedMemory.url}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              )}
            </div>

            <div className="p-6 space-y-4">
              {selectedMemory.caption && (
                <p className="text-foreground">{selectedMemory.caption}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedMemory.date).toLocaleDateString()}
                  </div>
                  {selectedMemory.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedMemory.location}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLove(selectedMemory.id)}
                    className="gap-2"
                  >
                    <Heart 
                      className={cn(
                        "w-4 h-4",
                        selectedMemory.loved ? "fill-red-500 text-red-500" : ""
                      )} 
                    />
                    {selectedMemory.loved ? "Loved" : "Love"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}