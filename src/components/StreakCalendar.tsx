
import React from "react";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  daysCheckedIn: string[];
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ daysCheckedIn }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="flex justify-between items-center w-full">
      {daysOfWeek.map((day, index) => {
        const isCheckedIn = daysCheckedIn.includes(day);
        
        return (
          <div 
            key={day} 
            className="flex flex-col items-center"
          >
            <div 
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 transition-all",
                isCheckedIn 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground",
                isCheckedIn && "animate-bounce-in"
              )}
            >
              {isCheckedIn && "✓"}
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">{day}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StreakCalendar;
