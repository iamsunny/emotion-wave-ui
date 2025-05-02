
import React from "react";

// Sample engagement data for the heatmap
// Format: [row (week)][column (day)] - Values range from 0-10 for engagement level
const engagementData = [
  [2, 4, 7, 8, 5, 2, 1], // Week 1
  [3, 5, 6, 9, 8, 3, 2], // Week 2
  [4, 6, 8, 7, 6, 5, 1], // Week 3
  [5, 8, 9, 10, 8, 4, 3], // Week 4
];

const EngagementHeatmap = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-8 gap-1 mb-2">
        <div className="text-xs text-muted-foreground"></div>
        {daysOfWeek.map(day => (
          <div key={day} className="text-xs text-center text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {engagementData.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-8 gap-1">
          <div className="text-xs flex items-center text-muted-foreground">
            W{weekIndex + 1}
          </div>
          {week.map((dayValue, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`h-8 w-full rounded bg-primary hover:bg-primary/80 transition-all cursor-help`}
              style={{
                opacity: dayValue / 10,
              }}
              title={`${dayValue} check-ins on ${daysOfWeek[dayIndex]}, Week ${weekIndex + 1}`}
            />
          ))}
        </div>
      ))}
      
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>Less Active</span>
        <div className="flex gap-1">
          <div className="h-3 w-6 bg-primary opacity-20 rounded-sm"></div>
          <div className="h-3 w-6 bg-primary opacity-40 rounded-sm"></div>
          <div className="h-3 w-6 bg-primary opacity-60 rounded-sm"></div>
          <div className="h-3 w-6 bg-primary opacity-80 rounded-sm"></div>
          <div className="h-3 w-6 bg-primary opacity-100 rounded-sm"></div>
        </div>
        <span>More Active</span>
      </div>
    </div>
  );
};

export default EngagementHeatmap;
