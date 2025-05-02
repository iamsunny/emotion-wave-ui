
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  speed = 60,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    const animateText = async () => {
      if (delay) {
        await new Promise((resolve) => {
          timeoutId = window.setTimeout(resolve, delay);
        });
      }
      
      setIsAnimating(true);
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, speed);
      
      return () => clearInterval(interval);
    };

    animateText();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, delay, speed]);

  return (
    <div className={cn("relative", className)}>
      <div>
        {displayedText}
        {isAnimating && <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
};

export default AnimatedText;
