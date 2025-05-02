
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface WeeklySentimentData {
  day: string; 
  avgScore: number;
  dayOfWeek: string;
}

interface OverviewMetrics {
  avgMoodScore: number;
  checkInRate: number;
  mostCommonMood: { emoji: string; label: string };
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics>({
    avgMoodScore: 0,
    checkInRate: 0,
    mostCommonMood: { emoji: "😐", label: "Neutral" },
    trend: "neutral",
    trendValue: "Stable",
  });
  const [weeklyMoodData, setWeeklyMoodData] = useState<WeeklySentimentData[]>([]);

  // Fetch data from Supabase
  const fetchDashboardData = useCallback(async () => {
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
        .select('emoji, label')
        .gte('created_at', formattedDates[0].formatted);

      if (emojiError) {
        console.error("Error fetching emoji frequency:", emojiError);
      }

      // Count occurrences of each emoji
      const emojiCounts: Record<string, { count: number, label: string }> = {};
      emojiFrequency?.forEach(entry => {
        if (!emojiCounts[entry.emoji]) {
          emojiCounts[entry.emoji] = { count: 0, label: entry.label };
        }
        emojiCounts[entry.emoji].count++;
      });

      // Find the emoji with the highest count
      let maxCount = 0;
      let mostCommonEmoji = { emoji: "😐", label: "Neutral" };
      
      Object.entries(emojiCounts).forEach(([emoji, data]) => {
        if (data.count > maxCount) {
          maxCount = data.count;
          mostCommonEmoji = { emoji, label: data.label };
        }
      });

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
      const uniqueUsers = new Set();
      
      // Fixed: Use optional chaining to safely access properties
      weeklyMoodScores?.forEach(record => {
        // Since we don't have user_id in the type, just use any score as a placeholder for counting
        uniqueUsers.add(record.created_at); // Using created_at as a proxy for unique entries
      });
      
      const checkInRate = Math.round((uniqueUsers.size / totalEmployees) * 100);

      setOverviewMetrics({
        avgMoodScore: avgScore,
        checkInRate: checkInRate,
        mostCommonMood: mostCommonEmoji,
        trend,
        trendValue
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { 
    isLoading, 
    overviewMetrics, 
    weeklyMoodData,
    refetchData: fetchDashboardData 
  };
};
