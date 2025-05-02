
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import EmojiCard from "@/components/EmojiCard";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmotionResponse {
  emoji: string;
  reason: string;
  timestamp: Date;
}

const CheckIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<EmotionResponse | null>(null);
  const [expandedEmoji, setExpandedEmoji] = useState<string | null>(null);

  // Update localStorage on successful check-in
  useEffect(() => {
    if (response) {
      localStorage.setItem("hasCheckedInToday", "true");
      localStorage.setItem("lastCheckInDate", new Date().toDateString());
    }
  }, [response]);

  const emotions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😠", label: "Angry" },
    { emoji: "🤩", label: "Excited" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😬", label: "Anxious" },
    { emoji: "😌", label: "Calm" },
    { emoji: "🥱", label: "Tired" },
  ];

  const handleSubmit = (emoji: string, reason: string) => {
    setIsLoading(true);
    
    // Simulate API call to get bot response
    setTimeout(() => {
      setResponse({
        emoji,
        reason,
        timestamp: new Date(),
      });
      setIsLoading(false);
      setExpandedEmoji(null);
    }, 1500);
  };

  const getResponseMessage = (emoji: string) => {
    switch (emoji) {
      case "😄":
        return "It's great to hear you're feeling happy! Happiness can boost productivity and creativity.";
      case "😢":
        return "I'm sorry to hear you're feeling sad. Remember it's okay to take breaks when needed.";
      case "😠":
        return "I understand you're feeling angry. Would you like to discuss what might help improve the situation?";
      case "🤩":
        return "Your excitement is contagious! It's wonderful to see you so enthusiastic.";
      case "😐":
        return "Thanks for sharing that you're feeling neutral today. It's okay to have balanced days.";
      case "😬":
        return "I notice you're feeling anxious. Remember to take deep breaths and focus on what you can control.";
      case "😌":
        return "Feeling calm is wonderful for focus and wellbeing. I'm glad you're in a peaceful state today.";
      case "🥱":
        return "I see you're tired today. Remember that rest is an important part of productivity too.";
      default:
        return "Thank you for sharing how you're feeling. Your emotional wellbeing matters to us.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-10"></div>
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6 md:py-10 lg:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Emotion Check-In</h1>
        <p className="text-muted-foreground mb-8 md:mb-10 text-lg">How are you feeling right now?</p>
        
        {response ? (
          <Card className="p-6 md:p-8 mb-8 bg-gradient-to-r from-primary/10 to-secondary/5 animate-fade-in">
            <div className="mb-5">
              <div className="text-sm text-muted-foreground mb-2">
                You felt {response.emoji}
              </div>
              <p className="text-lg md:text-xl font-medium italic">"{response.reason}"</p>
            </div>
            
            <div className="border-t pt-5 mt-5">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Buddy's Response:</h3>
                  <p className="text-base md:text-lg">{getResponseMessage(response.emoji)}</p>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 text-primary hover:text-primary/80 font-medium text-lg"
              onClick={() => setResponse(null)}
            >
              Submit another response
            </button>
          </Card>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-5" />
            <p className="text-lg">Analyzing your response...</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-4 md:gap-6",
            expandedEmoji 
              ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-1" 
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          )}>
            {emotions.map((emotion) => (
              <EmojiCard
                key={emotion.emoji}
                emoji={emotion.emoji}
                label={emotion.label}
                onSubmit={handleSubmit}
                isExpanded={expandedEmoji === emotion.emoji}
                onExpand={(emoji) => setExpandedEmoji(emoji === expandedEmoji ? null : emoji)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckIn;
