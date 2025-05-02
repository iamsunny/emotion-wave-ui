
import React from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { CalendarDays, Gift, Cake, PartyPopper, Star } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  type: "birthday" | "anniversary" | "milestone" | "celebration";
  days: number;
}

const Events: React.FC = () => {
  // Mock data
  const events: Event[] = [
    {
      id: 1,
      title: "Your Birthday",
      date: "May 15, 2025",
      type: "birthday",
      days: 13,
    },
    {
      id: 2,
      title: "Work Anniversary",
      date: "July 3, 2025",
      type: "anniversary",
      days: 62,
    },
    {
      id: 3,
      title: "Team Achievement Celebration",
      date: "May 10, 2025",
      type: "celebration",
      days: 8,
    },
    {
      id: 4,
      title: "6-Month Wellbeing Milestone",
      date: "August 22, 2025",
      type: "milestone",
      days: 112,
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday":
        return <Cake className="text-pink-500" />;
      case "anniversary":
        return <Gift className="text-purple-500" />;
      case "milestone":
        return <Star className="text-yellow-500" />;
      case "celebration":
        return <PartyPopper className="text-blue-500" />;
      default:
        return <CalendarDays />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-12 pb-20 sm:pb-12 sm:pt-24">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-muted-foreground mb-8">Special days and milestones to look forward to</p>
        
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-background p-3 rounded-full">
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {event.days} days
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted inline-flex rounded-full p-4 mb-4">
              <CalendarDays size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">No Upcoming Events</h2>
            <p className="text-muted-foreground">
              Check back later for special days and celebrations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
