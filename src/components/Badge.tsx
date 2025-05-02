
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeProps {
  title: string;
  icon: string;
  description: string;
  isEarned: boolean;
}

const Badge: React.FC<BadgeProps> = ({ title, icon, description, isEarned }) => {
  return (
    <Card className={cn(
      "relative overflow-hidden p-4 transition-all",
      isEarned ? "opacity-100" : "opacity-50"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
          isEarned ? "bg-primary/20" : "bg-muted"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            {title}
            {isEarned && <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Earned</span>}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {!isEarned && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium">
            Locked
          </div>
        </div>
      )}
    </Card>
  );
};

export default Badge;
