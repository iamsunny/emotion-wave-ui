import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [chartType, setChartType] = useState<string>("line");
  
  // Format weekly mood data for chart
  const chartData = weeklyMoodData.map(day => ({
    day: day.dayOfWeek,
    [selectedTeam === "All Teams" ? "All Teams" : selectedTeam]: day.avgScore,
    // Add some random team data for visualization purposes
    "Tech": selectedTeam === "Tech" ? day.avgScore : (Math.random() * 2 + 2.5),
    "Sales": selectedTeam === "Sales" ? day.avgScore : (Math.random() * 2 + 3),
    "HR": selectedTeam === "HR" ? day.avgScore : (Math.random() * 2 + 2),
    "Marketing": selectedTeam === "Marketing" ? day.avgScore : (Math.random() * 2 + 3.5),
  }));

  const getChartConfig = () => {
    return {
      "All Teams": {
        label: "All Teams",
        theme: { light: "#9b87f5", dark: "#9b87f5" }
      },
      "Tech": {
        label: "Tech Team",
        theme: { light: "#0EA5E9", dark: "#0EA5E9" }
      },
      "Sales": {
        label: "Sales Team",
        theme: { light: "#F97316", dark: "#F97316" }
      },
      "HR": {
        label: "HR Team",
        theme: { light: "#D946EF", dark: "#D946EF" }
      },
      "Marketing": {
        label: "Marketing Team",
        theme: { light: "#10B981", dark: "#10B981" }
      }
    };
  };

  return (
    <section className="mb-8">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-lg font-semibold">Weekly Sentiment</h2>
        <div className="flex space-x-2">
          <Tabs
            value={chartType}
            onValueChange={setChartType}
            className="w-fit"
          >
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="hidden">Line Chart</TabsContent>
            <TabsContent value="area" className="hidden">Area Chart</TabsContent>
          </Tabs>
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
      </div>
      
      <Card className="p-4">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : (
          <ChartContainer 
            className="h-[300px]"
            config={getChartConfig()}
          >
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tickCount={6} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <ReferenceLine y={3} stroke="#64748b" strokeDasharray="3 3" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelClassName="font-medium text-foreground" />
                  }
                />
                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                {selectedTeam === "All Teams" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="All Teams"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="Tech"
                      stroke="#0EA5E9"
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      opacity={0.7}
                      animationDuration={1200}
                    />
                    <Line
                      type="monotone"
                      dataKey="Sales"
                      stroke="#F97316"
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      opacity={0.7}
                      animationDuration={1400}
                    />
                    <Line
                      type="monotone"
                      dataKey="HR"
                      stroke="#D946EF"
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      opacity={0.7}
                      animationDuration={1600}
                    />
                    <Line
                      type="monotone"
                      dataKey="Marketing"
                      stroke="#10B981"
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      opacity={0.7}
                      animationDuration={1800}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey={selectedTeam}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                )}
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tickCount={6} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <ReferenceLine y={3} stroke="#64748b" strokeDasharray="3 3" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelClassName="font-medium text-foreground" />
                  }
                />
                <Legend wrapperStyle={{ paddingTop: '15px' }} />
                {selectedTeam === "All Teams" ? (
                  <>
                    <defs>
                      <linearGradient id="colorAllTeams" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D946EF" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone"
                      dataKey="All Teams"
                      stroke="#9b87f5"
                      fillOpacity={1}
                      fill="url(#colorAllTeams)"
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                    <Area 
                      type="monotone"
                      dataKey="Tech"
                      stroke="#0EA5E9"
                      fillOpacity={0.6}
                      fill="url(#colorTech)"
                      strokeWidth={1}
                      animationDuration={1200}
                    />
                    <Area 
                      type="monotone"
                      dataKey="Sales"
                      stroke="#F97316"
                      fillOpacity={0.6}
                      fill="url(#colorSales)"
                      strokeWidth={1}
                      animationDuration={1400}
                    />
                    <Area 
                      type="monotone"
                      dataKey="HR"
                      stroke="#D946EF"
                      fillOpacity={0.6}
                      fill="url(#colorHR)"
                      strokeWidth={1}
                      animationDuration={1600}
                    />
                    <Area 
                      type="monotone"
                      dataKey="Marketing"
                      stroke="#10B981"
                      fillOpacity={0.6}
                      fill="url(#colorMarketing)"
                      strokeWidth={1}
                      animationDuration={1800}
                    />
                  </>
                ) : (
                  <>
                    <defs>
                      <linearGradient id="colorSingleTeam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={
                          selectedTeam === "Tech" ? "#0EA5E9" : 
                          selectedTeam === "Sales" ? "#F97316" : 
                          selectedTeam === "HR" ? "#D946EF" : 
                          selectedTeam === "Marketing" ? "#10B981" : 
                          "#9b87f5"
                        } stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={
                          selectedTeam === "Tech" ? "#0EA5E9" : 
                          selectedTeam === "Sales" ? "#F97316" : 
                          selectedTeam === "HR" ? "#D946EF" : 
                          selectedTeam === "Marketing" ? "#10B981" : 
                          "#9b87f5"
                        } stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone"
                      dataKey={selectedTeam}
                      stroke={
                        selectedTeam === "Tech" ? "#0EA5E9" : 
                        selectedTeam === "Sales" ? "#F97316" : 
                        selectedTeam === "HR" ? "#D946EF" : 
                        selectedTeam === "Marketing" ? "#10B981" : 
                        "#9b87f5"
                      }
                      fillOpacity={1}
                      fill="url(#colorSingleTeam)"
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                  </>
                )}
              </AreaChart>
            )}
          </ChartContainer>
        )}
      </Card>
    </section>
  );
};

export default WeeklySentimentChart;
