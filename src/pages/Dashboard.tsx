import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Smile, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { toast } from "@/components/ui/sonner";

// Mock data for the dashboard sections where we don't have real data yet
const churnRiskData = [
  {
    id: "EMP-001",
    riskLevel: "High",
    suggestedAction: "Schedule 1:1 conversation",
    lastCheckIn: "3 days ago",
  },
  {
    id: "EMP-023",
    riskLevel: "Medium",
    suggestedAction: "Recommend team bonding",
    lastCheckIn: "Yesterday",
  },
  {
    id: "EMP-047",
    riskLevel: "Medium",
    suggestedAction: "Check work-life balance",
    lastCheckIn: "Today",
  },
  {
    id: "EMP-112",
    riskLevel: "Low",
    suggestedAction: "Continue monitoring",
    lastCheckIn: "Today",
  },
  {
    id: "EMP-089",
    riskLevel: "High",
    suggestedAction: "Initiate wellness check",
    lastCheckIn: "5 days ago",
  },
];

const topEmployees = [
  {
    name: "Alex P.",
    avatar: "/placeholder.svg",
    xpPoints: 1250,
    moodConsistency: "85% happy",
  },
  {
    name: "Jamie R.",
    avatar: "/placeholder.svg",
    xpPoints: 980,
    moodConsistency: "72% happy",
  },
  {
    name: "Taylor S.",
    avatar: "/placeholder.svg",
    xpPoints: 870,
    moodConsistency: "68% calm",
  },
  {
    name: "Casey K.",
    avatar: "/placeholder.svg",
    xpPoints: 750,
    moodConsistency: "63% focused",
  },
];

// Sample engagement data for the heatmap
// Format: [row (week)][column (day)] - Values range from 0-10 for engagement level
const engagementData = [
  [2, 4, 7, 8, 5, 2, 1], // Week 1
  [3, 5, 6, 9, 8, 3, 2], // Week 2
  [4, 6, 8, 7, 6, 5, 1], // Week 3
  [5, 8, 9, 10, 8, 4, 3], // Week 4
];

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  subtitle: string;
  color?: "primary" | "secondary" | "accent" | "muted";
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = "primary",
  isLoading = false,
}) => {
  const bgColorMap = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    accent: "bg-accent/10",
    muted: "bg-muted",
  };
  
  const textColorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    muted: "text-foreground",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`p-2 rounded-full ${bgColorMap[color]}`}>
            <div className={textColorMap[color]}>{icon}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-6 w-32" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <div className="flex items-center mt-1 text-sm">
          {trend === "up" && <TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
          {trend === "down" && <TrendingDown className="h-4 w-4 mr-1 text-red-500" />}
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const EngagementHeatmap = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const getColorIntensity = (value: number) => {
    // Map the engagement value (0-10) to a color intensity (0-100)
    const intensity = Math.min(Math.round((value / 10) * 100), 100);
    return intensity;
  };
  
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
    </div>
  );
};

interface WeeklySentimentData {
  day: string; 
  avgScore: number;
  dayOfWeek: string;
}

const Dashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [isLoading, setIsLoading] = useState(true);
  const [overviewMetrics, setOverviewMetrics] = useState({
    avgMoodScore: 0,
    checkInRate: 0,
    mostCommonMood: { emoji: "😐", label: "Neutral" },
    trend: "neutral" as "up" | "down" | "neutral",
    trendValue: "Stable",
  });
  const [weeklyMoodData, setWeeklyMoodData] = useState<WeeklySentimentData[]>([]);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Get dates for the past 7 days
        const pastWeekDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();

        // Format dates for query and display
        const formattedDates = pastWeekDates.map(date => {
          return {
            formatted: date.toISOString().split('T')[0],
            dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
          };
        });

        // Fetch average mood scores per day for the past week
        const { data: weeklyMoodScores, error: weeklyMoodError } = await supabase
          .from('emotion_analytics')
          .select('created_at, score')
          .gte('created_at', formattedDates[0].formatted)
          .order('created_at', { ascending: true });

        if (weeklyMoodError) {
          console.error("Error fetching weekly moods:", weeklyMoodError);
          throw new Error(weeklyMoodError.message);
        }

        // Process data into day-by-day averages
        const dailyScores: Record<string, {total: number, count: number}> = {};
        
        weeklyMoodScores?.forEach(record => {
          const dayKey = new Date(record.created_at).toISOString().split('T')[0];
          
          if (!dailyScores[dayKey]) {
            dailyScores[dayKey] = { total: 0, count: 0 };
          }
          
          dailyScores[dayKey].total += record.score;
          dailyScores[dayKey].count += 1;
        });

        // Create formatted data for chart
        const chartData: WeeklySentimentData[] = formattedDates.map(date => {
          const scores = dailyScores[date.formatted];
          const avgScore = scores ? Number((scores.total / scores.count).toFixed(1)) : 0;
          
          return {
            day: date.formatted,
            dayOfWeek: date.dayOfWeek,
            avgScore: avgScore || 0
          };
        });

        setWeeklyMoodData(chartData);

        // Calculate overview metrics
        const allScores = weeklyMoodScores?.map(item => item.score) || [];
        const avgScore = allScores.length > 0 
          ? Number((allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1))
          : 0;

        // Count frequency of each emoji to find most common
        const { data: emojiFrequency, error: emojiError } = await supabase
          .from('emotion_checkins')
          .select('emoji, label, count(*)')
          .gte('created_at', formattedDates[0].formatted)
          .group('emoji, label')
          .order('count', { ascending: false });

        if (emojiError) {
          console.error("Error fetching emoji frequency:", emojiError);
        }

        const mostCommonMood = emojiFrequency && emojiFrequency.length > 0
          ? { emoji: emojiFrequency[0].emoji, label: emojiFrequency[0].label }
          : { emoji: "😐", label: "Neutral" };

        // Calculate trend by comparing first half of week to second half
        const halfwayPoint = Math.floor(allScores.length / 2);
        const firstHalfAvg = allScores.slice(0, halfwayPoint).reduce((sum, val) => sum + val, 0) / halfwayPoint || 0;
        const secondHalfAvg = allScores.slice(halfwayPoint).reduce((sum, val) => sum + val, 0) / (allScores.length - halfwayPoint) || 0;
        
        let trend: "up" | "down" | "neutral" = "neutral";
        let trendValue = "Stable";
        
        if (secondHalfAvg - firstHalfAvg > 0.3) {
          trend = "up";
          trendValue = "Improving";
        } else if (firstHalfAvg - secondHalfAvg > 0.3) {
          trend = "down";
          trendValue = "Declining";
        }

        // Calculate check-in rate (mock for now - would need employee count)
        // Assuming 50 total employees for now
        const totalEmployees = 50;
        const uniqueUsers = new Set(weeklyMoodScores?.map(record => record.user_id)).size;
        const checkInRate = Math.round((uniqueUsers / totalEmployees) * 100);

        setOverviewMetrics({
          avgMoodScore: avgScore,
          checkInRate: checkInRate,
          mostCommonMood,
          trend,
          trendValue
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format weekly mood data for chart
  const chartData = weeklyMoodData.map(day => ({
    day: day.dayOfWeek,
    [selectedTeam === "All Teams" ? "All Teams" : selectedTeam]: day.avgScore
  }));

  return (
    <div className="pb-24 pt-16 sm:pt-0 sm:pb-0">
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Pulse Dashboard</h1>
          
          {/* Overview Metrics */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Overview Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Avg Mood Score"
                value={isLoading ? "..." : overviewMetrics.avgMoodScore}
                icon={<Smile />}
                trend={overviewMetrics.trend}
                subtitle={`${overviewMetrics.trendValue} trend`}
                color="primary"
                isLoading={isLoading}
              />
              <MetricCard
                title="Check-in Rate"
                value={isLoading ? "..." : `${overviewMetrics.checkInRate}%`}
                icon={<Users />}
                trend={overviewMetrics.checkInRate > 70 ? "up" : overviewMetrics.checkInRate > 40 ? "neutral" : "down"}
                subtitle="of employees participated"
                color="secondary"
                isLoading={isLoading}
              />
              <MetricCard
                title="Most Common Mood"
                value={isLoading ? "..." : `${overviewMetrics.mostCommonMood.emoji} ${overviewMetrics.mostCommonMood.label}`}
                icon={<Smile />}
                subtitle="among employees"
                color="accent"
                isLoading={isLoading}
              />
              <MetricCard
                title="Team Pulse Trend"
                value={isLoading ? "..." : overviewMetrics.trendValue}
                icon={overviewMetrics.trend === "up" ? <TrendingUp /> : overviewMetrics.trend === "down" ? <TrendingDown /> : <Smile />}
                subtitle="Weekly pattern"
                color="muted"
                isLoading={isLoading}
              />
            </div>
          </section>
          
          {/* Weekly Sentiment Chart */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Churn Risk Highlights */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Churn Risk Highlights</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead className="hidden sm:table-cell">Last Check-In</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {churnRiskData.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              employee.riskLevel === "High" 
                                ? "bg-red-100 text-red-800 border-red-200" 
                                : employee.riskLevel === "Medium" 
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                                  : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {employee.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{employee.lastCheckIn}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <Info className="h-3.5 w-3.5 mr-1" />
                            Take Action
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </section>
            
            {/* Most Engaged Employees */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Most Engaged Employees</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>XP Points</TableHead>
                      <TableHead className="hidden sm:table-cell">Mood Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topEmployees.map((employee) => (
                      <TableRow key={employee.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{employee.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.xpPoints}</TableCell>
                        <TableCell className="hidden sm:table-cell">{employee.moodConsistency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </section>
          </div>
          
          {/* Engagement Streak Heatmap */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Engagement Streak (Last 4 Weeks)</h2>
            <Card className="p-6">
              <EngagementHeatmap />
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
            </Card>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
