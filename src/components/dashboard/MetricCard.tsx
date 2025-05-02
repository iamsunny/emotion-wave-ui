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
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  subtitle: string;
  color?: "primary" | "secondary" | "accent" | "muted" | "success" | "warning" | "danger";
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
    success: "bg-green-100",
    warning: "bg-yellow-100",
    danger: "bg-red-100",
  };
  
  const textColorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    muted: "text-foreground",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  const borderColorMap = {
    primary: "border-primary/20",
    secondary: "border-secondary/20",
    accent: "border-accent/20",
    muted: "border-muted-foreground/20",
    success: "border-green-200",
    warning: "border-yellow-200",
    danger: "border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden border ${borderColorMap[color]} hover:shadow-md transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <motion.div 
              className={`p-2 rounded-full ${bgColorMap[color]}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={textColorMap[color]}>{icon}</div>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32 mb-2" />
          ) : (
            <motion.div 
              className={`text-2xl font-bold ${textColorMap[color]}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.div>
          )}
          <div className="flex items-center mt-1 text-sm">
            {trend === "up" && (
              <motion.div 
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              </motion.div>
            )}
            {trend === "down" && (
              <motion.div 
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              </motion.div>
            )}
            <CardDescription>{subtitle}</CardDescription>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
