
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EmojiCardProps {
  emoji: string;
  label: string;
  onSubmit: (emoji: string, reason: string) => void;
  isExpanded: boolean;
  onExpand: (emoji: string) => void;
}

const EmojiCard: React.FC<EmojiCardProps> = ({ 
  emoji, 
  label, 
  onSubmit,
  isExpanded,
  onExpand
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(emoji, reason);
      setIsSubmitting(false);
      setReason("");
    }, 1500);
  };

  const createConfetti = () => {
    const confettiContainer = document.getElementById("confetti-container");
    if (!confettiContainer) return;
    
    const colors = ["#9b87f5", "#8B5CF6", "#D946EF", "#0EA5E9"];
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 20 + 40}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${0.5 + Math.random() * 1}s`;
      
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 2000);
    }
  };

  // Reset reason when card is collapsed
  React.useEffect(() => {
    if (!isExpanded) {
      setReason("");
    }
  }, [isExpanded]);

  return (
    <Card 
      className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "max-h-[400px]" : "max-h-[160px]",
        isSubmitting ? "opacity-80" : "opacity-100"
      )}
    >
      {!isExpanded ? (
        <Button
          variant="ghost"
          className={cn(
            "w-full h-full p-6 flex flex-col gap-2 hover:bg-muted/50 hover:scale-[1.02] transition-all",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          onClick={() => onExpand(emoji)}
        >
          <div className="text-4xl md:text-5xl mb-2">{emoji}</div>
          <div className="font-medium text-sm md:text-base">{label}</div>
        </Button>
      ) : (
        <div className="p-4 flex flex-col h-full animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <span className="font-medium">{label}</span>
            </div>
          </div>
          
          <Textarea
            placeholder="Why do you feel this way?"
            className="min-h-[100px] mb-4 resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
          
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              onClick={() => onExpand(emoji)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                handleSubmit();
                createConfetti();
              }}
              disabled={!reason.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmojiCard;
