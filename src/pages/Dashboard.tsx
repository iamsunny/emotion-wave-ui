
import React from "react";
import { Book, Users, Gauge, Activity, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";

// Component imports
import MetricCard from "@/components/dashboard/MetricCard";
import WeeklySentimentChart from "@/components/dashboard/WeeklySentimentChart";
import EngagementHeatmap from "@/components/dashboard/EngagementHeatmap";
import ChurnRiskTable from "@/components/dashboard/ChurnRiskTable";
import EngagedEmployeesTable from "@/components/dashboard/EngagedEmployeesTable";

// Custom hooks
import { useDashboardData } from "@/hooks/useDashboardData";
import { insertDummyData } from "@/utils/insertDummyData";

const Dashboard = () => {
  const [demoImportLoading, setDemoImportLoading] = React.useState(false);
  const { isLoading, overviewMetrics, weeklyMoodData } = useDashboardData();

  const handleGenerateDummyData = async () => {
    setDemoImportLoading(true);
    try {
      const success = await insertDummyData(100);
      if (success) {
        toast.success("Successfully generated 100 dummy records!");
        // Reload page to refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error generating dummy data:", error);
      toast.error("Failed to generate dummy data");
    } finally {
      setDemoImportLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Wellness Dashboard</h1>
          <p className="text-muted-foreground">Monitor your team's emotional well-being</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleGenerateDummyData} 
          disabled={demoImportLoading}
          className="flex items-center"
        >
          <Database className="mr-2 h-4 w-4" />
          {demoImportLoading ? "Generating..." : "Generate 100 Demo Records"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Average Mood Score"
          value={overviewMetrics.avgMoodScore}
          icon={<Gauge className="h-5 w-5" />}
          subtitle={`${overviewMetrics.trendValue} this week`}
          trend={overviewMetrics.trend}
          isLoading={isLoading}
        />
        <MetricCard
          title="Team Check-in Rate"
          value={`${overviewMetrics.checkInRate}%`}
          icon={<Activity className="h-5 w-5" />}
          subtitle="Of team members"
          color="secondary"
          isLoading={isLoading}
        />
        <MetricCard
          title="Most Common Mood"
          value={overviewMetrics.mostCommonMood.emoji}
          icon={<Book className="h-5 w-5" />}
          subtitle={overviewMetrics.mostCommonMood.label}
          color="accent"
          isLoading={isLoading}
        />
        <MetricCard
          title="Generate Data"
          value="Demo Data"
          icon={<Database className="h-5 w-5" />}
          subtitle="Click to add 100 records"
          color="success"
          isLoading={demoImportLoading}
          onClick={handleGenerateDummyData}
          clickable={true}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WeeklySentimentChart weeklyMoodData={weeklyMoodData} isLoading={isLoading} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Team Engagement Trends</h2>
                <EngagementHeatmap />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Churn Risk Employees</h2>
                <ChurnRiskTable />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Most Engaged Employees</h2>
                <Button variant="outline" className="text-xs h-8">
                  <Users className="h-3 w-3 mr-1" />
                  View All
                </Button>
              </div>
              <EngagedEmployeesTable />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
