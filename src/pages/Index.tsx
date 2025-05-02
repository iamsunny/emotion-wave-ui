
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedText from "@/components/AnimatedText";
import Navigation from "@/components/Navigation";
import { ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-12 pb-20 sm:pb-12 sm:pt-24">
        <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-4xl">🤖</div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Emotion Buddy
            </h1>
          </div>
          
          <div className="mt-6 mb-12">
            <AnimatedText 
              text="Hey there 👋 How are you feeling today?" 
              className="text-xl md:text-2xl font-medium" 
              delay={300}
              speed={40}
            />
            
            <p className="mt-6 text-muted-foreground">
              Take a moment to check in with yourself and track your emotional wellbeing.
              Your responses help us support you better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-primary/20 text-primary rounded-full p-3">
                <SmilePlus size={24} />
              </div>
              <div>
                <h3 className="font-medium">Daily Check-in</h3>
                <p className="text-sm text-muted-foreground">Share how you're feeling</p>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-accent/20 text-accent rounded-full p-3">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-medium">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">Build streaks & badges</p>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full mt-8 text-lg py-6"
            onClick={() => navigate("/check-in")}
          >
            <span>Get Started</span>
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </Card>
      </main>
    </div>
  );
};

// Import icons this way to avoid conflicts
import { SmilePlus, Award } from "lucide-react";

export default Index;
