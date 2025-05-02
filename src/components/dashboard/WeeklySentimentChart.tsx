
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WeeklySentimentChartProps {
  weeklyMoodData: {
    day: string;
    avgScore: number;
    dayOfWeek: string;
  }[];
  isLoading: boolean;
}

const WeeklySentimentChart: React.FC<WeeklySentimentChartProps> = ({ 
  weeklyMoodData, 
  isLoading 
}) => {
  const [selectedTeam, setSelectedTeam] = React.useState<string>("All Teams");
  
  // Format weekly mood data for chart
  const chartData = weeklyMoodData.map(day => ({
    day: day.dayOfWeek,
    [selectedTeam === "All Teams" ? "All Teams" : selectedTeam]: day.avgScore
  }));

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Weekly Sentiment</h2>
        <Select
          value={selectedTeam}
          onValueChange={(value) => setSelectedTeam(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Teams">All Teams</SelectItem>
            <SelectItem value="Tech">Tech</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="p-4">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : (
          <ChartContainer 
            className="h-[300px]"
            config={{
              "All Teams": {
                label: "All Teams",
                theme: { light: "#9b87f5", dark: "#9b87f5" }
              },
              "Tech": {
                label: "Tech Team",
                theme: { light: "#9b87f5", dark: "#9b87f5" }
              },
              "Sales": {
                label: "Sales Team",
                theme: { light: "#7E69AB", dark: "#7E69AB" }
              },
              "HR": {
                label: "HR Team",
                theme: { light: "#6E59A5", dark: "#6E59A5" }
              },
              "Marketing": {
                label: "Marketing Team",
                theme: { light: "#D6BCFA", dark: "#D6BCFA" }
              }
            }}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 5]} tickCount={6} />
              <ChartTooltip
                content={
                  <ChartTooltipContent />
                }
              />
              {selectedTeam !== "All Teams" ? (
                <Line
                  type="monotone"
                  dataKey={selectedTeam}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="All Teams"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ChartContainer>
        )}
      </Card>
    </section>
  );
};

export default WeeklySentimentChart;
