
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface NudgeReminderProps {
  firstName?: string;
}

const NudgeReminder: React.FC<NudgeReminderProps> = ({ firstName = "friend" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already checked in today
    const hasCheckedInToday = localStorage.getItem("hasCheckedInToday");
    const lastCheckInDate = localStorage.getItem("lastCheckInDate");
    const today = new Date().toDateString();

    // If it's a new day, reset the check-in status
    if (lastCheckInDate !== today) {
      localStorage.removeItem("hasCheckedInToday");
    }

    // For POC purposes, show the nudge after 30 seconds (30000ms)
    const timer = setTimeout(() => {
      if (!hasCheckedInToday) {
        setIsVisible(true);
      }
    }, 30000); // 30 seconds for POC
    
    // Original timeout (5 minutes = 300000ms)
    // const timer = setTimeout(() => {
    //   if (!hasCheckedInToday) {
    //     setIsVisible(true);
    //   }
    // }, 300000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCheckIn = () => {
    // Set checked-in status in localStorage
    localStorage.setItem("hasCheckedInToday", "true");
    localStorage.setItem("lastCheckInDate", new Date().toDateString());
    
    // Hide the nudge
    setIsVisible(false);
    
    // Show a toast
    toast("Great! Let's check in with your emotions", {
      description: "Taking a moment for yourself",
    });
    
    // Navigate to check-in page
    navigate("/check-in");
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-[280px] sm:max-w-[320px] flex flex-col shadow-lg rounded-xl overflow-hidden"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            transition: { 
              type: "spring", 
              damping: 15, 
              stiffness: 200
            }
          }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
        >
          <div className="bg-gradient-to-r from-primary/90 to-secondary/90 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
                className="text-3xl"
              >
                👋
              </motion.div>
              <div className="font-medium text-white">
                Hey {firstName}, how are you feeling today? 😊
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDismiss}
                className="bg-white/20 text-white hover:bg-white/30 border-none flex-1"
              >
                Later
              </Button>
              <Button 
                onClick={handleCheckIn} 
                size="sm"
                className="bg-white text-primary hover:bg-white/90 flex-1"
              >
                Check In Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NudgeReminder;
