
import React from "react";
import { motion } from "framer-motion";
import { Smile, Users, TrendingUp, TrendingDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/dashboard/MetricCard";
import EngagementHeatmap from "@/components/dashboard/EngagementHeatmap";
import ChurnRiskTable from "@/components/dashboard/ChurnRiskTable";
import EngagedEmployeesTable from "@/components/dashboard/EngagedEmployeesTable";
import WeeklySentimentChart from "@/components/dashboard/WeeklySentimentChart";
import { Card } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { isLoading, overviewMetrics, weeklyMoodData } = useDashboardData();

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
          <WeeklySentimentChart 
            weeklyMoodData={weeklyMoodData} 
            isLoading={isLoading} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Churn Risk Highlights */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Churn Risk Highlights</h2>
              <ChurnRiskTable />
            </section>
            
            {/* Most Engaged Employees */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Most Engaged Employees</h2>
              <EngagedEmployeesTable />
            </section>
          </div>
          
          {/* Engagement Streak Heatmap */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Engagement Streak (Last 4 Weeks)</h2>
            <Card className="p-6">
              <EngagementHeatmap />
            </Card>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
