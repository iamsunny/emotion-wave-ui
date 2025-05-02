
import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sample engagement data for the heatmap with more variety
// Format: [row (week)][column (day)] - Values range from 0-10 for engagement level
const engagementData = [
  [2, 4, 7, 8, 5, 2, 1], // Week 1
  [3, 5, 6, 9, 8, 3, 2], // Week 2
  [4, 6, 8, 7, 6, 5, 1], // Week 3
  [5, 8, 9, 10, 8, 4, 3], // Week 4
];

const EngagementHeatmap = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getColorClass = (value: number) => {
    // Create a gradient color scheme based on value
    if (value <= 2) return "bg-primary opacity-20";
    if (value <= 4) return "bg-primary opacity-40";
    if (value <= 6) return "bg-primary opacity-60";
    if (value <= 8) return "bg-primary opacity-80";
    return "bg-primary opacity-100";
  };

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col gap-2">
      <motion.div 
        className="grid grid-cols-8 gap-1 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xs text-muted-foreground"></div>
        {daysOfWeek.map((day) => (
          <div key={day} className="text-xs text-center text-muted-foreground">
            {day}
          </div>
        ))}
      </motion.div>

      <TooltipProvider>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {engagementData.map((week, weekIndex) => (
            <motion.div 
              key={weekIndex} 
              className="grid grid-cols-8 gap-1"
            >
              <div className="text-xs flex items-center text-muted-foreground">
                W{weekIndex + 1}
              </div>
              {week.map((dayValue, dayIndex) => (
                <Tooltip key={`${weekIndex}-${dayIndex}`}>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={itemVariants}
                      className={`h-8 w-full rounded ${getColorClass(dayValue)} hover:ring-2 ring-primary/30 transition-all cursor-help`}
                      whileHover={{ scale: 1.05 }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">
                      {dayValue} check-ins
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {daysOfWeek[dayIndex]}, Week {weekIndex + 1}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </TooltipProvider>

      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>Less Active</span>
        <div className="flex gap-1">
          <motion.div 
            className="h-3 w-6 bg-primary opacity-20 rounded-sm"
            whileHover={{ scale: 1.1 }}
          />
          <motion.div 
            className="h-3 w-6 bg-primary opacity-40 rounded-sm"
            whileHover={{ scale: 1.1 }}
          />
          <motion.div 
            className="h-3 w-6 bg-primary opacity-60 rounded-sm"
            whileHover={{ scale: 1.1 }}
          />
          <motion.div 
            className="h-3 w-6 bg-primary opacity-80 rounded-sm"
            whileHover={{ scale: 1.1 }}
          />
          <motion.div 
            className="h-3 w-6 bg-primary opacity-100 rounded-sm"
            whileHover={{ scale: 1.1 }}
          />
        </div>
        <span>More Active</span>
      </div>
    </div>
  );
};

export default EngagementHeatmap;
