
import React, { useState } from "react";
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
import Navigation from "@/components/Navigation";

// Mock data for the dashboard
const weeklyMoodData = [
  { day: "Mon", Tech: 4.2, Sales: 3.8, HR: 4.0, Marketing: 3.5 },
  { day: "Tue", Tech: 4.0, Sales: 3.9, HR: 3.8, Marketing: 3.7 },
  { day: "Wed", Tech: 3.7, Sales: 4.1, HR: 3.5, Marketing: 3.9 },
  { day: "Thu", Tech: 3.5, Sales: 4.3, HR: 3.6, Marketing: 4.1 },
  { day: "Fri", Tech: 4.5, Sales: 4.5, HR: 4.2, Marketing: 4.4 },
  { day: "Sat", Tech: 4.6, Sales: 4.2, HR: 4.0, Marketing: 3.8 },
  { day: "Sun", Tech: 4.3, Sales: 4.0, HR: 3.9, Marketing: 3.7 },
];

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
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = "primary",
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
        <div className="text-2xl font-bold">{value}</div>
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

const Dashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  
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
                value="4.2"
                icon={<Smile />}
                trend="up"
                subtitle="8% increase from last week"
                color="primary"
              />
              <MetricCard
                title="Check-in Rate"
                value="78%"
                icon={<Users />}
                trend="down"
                subtitle="3% decrease from yesterday"
                color="secondary"
              />
              <MetricCard
                title="Most Common Mood"
                value="😊 Happy"
                icon={<Smile />}
                subtitle="38% of employees"
                color="accent"
              />
              <MetricCard
                title="Team Pulse Trend"
                value="Positive"
                icon={<TrendingUp />}
                subtitle="Gradually improving"
                color="muted"
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
              <ChartContainer 
                className="h-[300px]"
                config={{
                  Tech: {
                    label: "Tech Team",
                    theme: { light: "#9b87f5", dark: "#9b87f5" }
                  },
                  Sales: {
                    label: "Sales Team",
                    theme: { light: "#7E69AB", dark: "#7E69AB" }
                  },
                  HR: {
                    label: "HR Team",
                    theme: { light: "#6E59A5", dark: "#6E59A5" }
                  },
                  Marketing: {
                    label: "Marketing Team",
                    theme: { light: "#D6BCFA", dark: "#D6BCFA" }
                  }
                }}
              >
                <LineChart data={weeklyMoodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} tickCount={5} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent />
                    }
                  />
                  {(selectedTeam === "All Teams" || selectedTeam === "Tech") && (
                    <Line
                      type="monotone"
                      dataKey="Tech"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedTeam === "All Teams" || selectedTeam === "Sales") && (
                    <Line
                      type="monotone"
                      dataKey="Sales"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedTeam === "All Teams" || selectedTeam === "HR") && (
                    <Line
                      type="monotone"
                      dataKey="HR"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedTeam === "All Teams" || selectedTeam === "Marketing") && (
                    <Line
                      type="monotone"
                      dataKey="Marketing"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ChartContainer>
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
