
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Users, TrendingUp, TrendingDown, Plus, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/dashboard/MetricCard";
import EngagementHeatmap from "@/components/dashboard/EngagementHeatmap";
import ChurnRiskTable from "@/components/dashboard/ChurnRiskTable";
import EngagedEmployeesTable from "@/components/dashboard/EngagedEmployeesTable";
import WeeklySentimentChart from "@/components/dashboard/WeeklySentimentChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { insertDummyData } from "@/utils/insertDummyData";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { isLoading, overviewMetrics, weeklyMoodData } = useDashboardData();
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerateDummyData = async () => {
    setIsGeneratingData(true);
    try {
      await insertDummyData(1000);
      toast.success("Dummy data generated! Refresh the page to see the results.");
    } catch (error) {
      console.error("Error generating dummy data:", error);
      toast.error("Failed to generate dummy data");
    } finally {
      setIsGeneratingData(false);
    }
  };

  return (
    <div className="pb-24 pt-16 sm:pt-0 sm:pb-0">
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pulse Dashboard</h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  disabled={isGeneratingData}
                >
                  {isGeneratingData ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  Generate Sample Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Sample Data</DialogTitle>
                  <DialogDescription>
                    This will create 1,000 random mood check-ins from the past 30 days to visualize the dashboard with realistic data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    onClick={handleGenerateDummyData} 
                    disabled={isGeneratingData}
                  >
                    {isGeneratingData ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                        Generating...
                      </>
                    ) : (
                      "Generate Data"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Team Details</TabsTrigger>
            </TabsList>
          </Tabs>

          <TabsContent value="overview" className="space-y-8">
            {/* Overview Metrics */}
            <section>
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
                  color={overviewMetrics.trend === "up" ? "success" : overviewMetrics.trend === "down" ? "danger" : "muted"}
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
              <section>
                <h2 className="text-lg font-semibold mb-4">Churn Risk Highlights</h2>
                <ChurnRiskTable />
              </section>
              
              {/* Most Engaged Employees */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Most Engaged Employees</h2>
                <EngagedEmployeesTable />
              </section>
            </div>
          </TabsContent>

          <TabsContent value="details">
            {/* Engagement Streak Heatmap */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Engagement Streak (Last 4 Weeks)</h2>
              <Card className="p-6">
                <EngagementHeatmap />
              </Card>
            </section>
          </TabsContent>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
