
import React from "react";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import StreakCalendar from "@/components/StreakCalendar";
import Badge from "@/components/Badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Rewards: React.FC = () => {
  // Mock data
  const daysCheckedIn = ["Mon", "Tue", "Wed", "Fri"];
  const xpPoints = 340;
  const xpTarget = 500;
  
  const badges = [
    {
      title: "Emotion Explorer",
      icon: "🔍",
      description: "Tracked 5 different emotions",
      isEarned: true,
    },
    {
      title: "Consistency Champion",
      icon: "🏆",
      description: "Completed 3 consecutive check-ins",
      isEarned: true,
    },
    {
      title: "Mood Master",
      icon: "🧙",
      description: "Completed 10 total check-ins",
      isEarned: true,
    },
    {
      title: "Reflection Guru",
      icon: "🧠",
      description: "Provided detailed responses for 7 days",
      isEarned: false,
    },
    {
      title: "Happy Camper",
      icon: "⛺️",
      description: "Reported 'Happy' mood 5 times",
      isEarned: false,
    },
    {
      title: "Emotion Virtuoso",
      icon: "🌟",
      description: "Earned all beginner badges",
      isEarned: false,
    },
  ];

  const earnedBadges = badges.filter(badge => badge.isEarned);
  const lockedBadges = badges.filter(badge => !badge.isEarned);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-12 pb-20 sm:pb-12 sm:pt-24">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Rewards</h1>
        <p className="text-muted-foreground mb-8">Track your progress and achievements</p>
        
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">This Week's Check-In Streak</h2>
          <StreakCalendar daysCheckedIn={daysCheckedIn} />
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weekly XP Progress</span>
              <span className="text-sm text-muted-foreground">{xpPoints}/{xpTarget} XP</span>
            </div>
            <Progress value={(xpPoints / xpTarget) * 100} className="h-2" />
          </div>
        </Card>
        
        <div className="mb-8">
          <Tabs defaultValue="earned">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="earned">
                Earned Badges ({earnedBadges.length})
              </TabsTrigger>
              <TabsTrigger value="locked">
                Locked Badges ({lockedBadges.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="earned" className="space-y-4 animate-fade-in">
              {earnedBadges.length > 0 ? (
                earnedBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    title={badge.title}
                    icon={badge.icon}
                    description={badge.description}
                    isEarned={true}
                  />
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No badges earned yet. Start checking in regularly!
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="locked" className="space-y-4 animate-fade-in">
              {lockedBadges.map((badge, index) => (
                <Badge
                  key={index}
                  title={badge.title}
                  icon={badge.icon}
                  description={badge.description}
                  isEarned={false}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
