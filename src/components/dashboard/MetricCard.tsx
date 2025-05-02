
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export default MetricCard;
