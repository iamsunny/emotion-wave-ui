
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, SmilePlus, Award, CalendarDays, Menu, X, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/check-in", label: "Check-In", icon: <SmilePlus size={20} /> },
    { path: "/rewards", label: "Rewards", icon: <Award size={20} /> },
    { path: "/events", label: "Events", icon: <CalendarDays size={20} /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart3 size={20} />, adminOnly: true },
  ];

  return (
    <nav className="fixed bottom-0 sm:top-0 sm:bottom-auto left-0 w-full bg-background border-t sm:border-b sm:border-t-0 z-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden sm:flex items-center space-x-2 font-bold text-lg text-emotion-deep-purple">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <span>Emotion Buddy</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden ml-auto p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-1",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile bottom navigation */}
          <div className="fixed sm:hidden bottom-0 left-0 w-full bg-background border-t flex justify-around py-2 z-50">
            {navItems
              .filter(item => !item.adminOnly) // Filter out admin-only items on mobile
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-md",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div>{item.icon}</div>
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              ))
            }
          </div>

          {/* Mobile menu (full screen) */}
          {isMobileMenuOpen && (
            <div className="sm:hidden fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <Button
                variant="outline"
                className="absolute top-4 right-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </Button>
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    size="lg"
                    className="flex items-center space-x-3 text-lg"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
