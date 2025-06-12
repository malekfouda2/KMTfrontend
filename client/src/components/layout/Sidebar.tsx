import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Clock,
  Calendar,
  Briefcase,
  Settings,
  TrendingUp,
  User,
  LogOut,
  Building2,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "BarChart3",
    route: "/dashboard",
  },
  {
    id: "employees",
    label: "Employees",
    icon: "Users",
    route: "/employees",
    roles: ["general_manager", "hr_manager"],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: "Clock",
    route: "/attendance",
  },
  {
    id: "leave",
    label: "Leave Management",
    icon: "Calendar",
    route: "/leave",
  },
  {
    id: "missions",
    label: "Missions",
    icon: "Briefcase",
    route: "/missions",
  },
  {
    id: "policies",
    label: "Policies",
    icon: "Settings",
    route: "/policies",
    roles: ["general_manager", "hr_manager"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "TrendingUp",
    route: "/analytics",
    roles: ["general_manager", "hr_manager"],
  },
  {
    id: "departments",
    label: "Departments",
    icon: "Building2",
    route: "/departments",
    roles: ["general_manager", "hr_manager"],
  },
  {
    id: "roles",
    label: "Roles",
    icon: "Shield",
    route: "/roles",
    roles: ["general_manager", "hr_manager"],
  },
];

const iconMap = {
  BarChart3,
  Users,
  Clock,
  Calendar,
  Briefcase,
  Settings,
  TrendingUp,
  Building2,
  Shield,
};

export const Sidebar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const filteredNavItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mobile Menu Button (only visible on mobile)
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
      onClick={toggleMobileMenu}
    >
      {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-64 bg-white shadow-lg flex flex-col h-full transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        "fixed inset-y-0 left-0 z-50",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-secondary">KMT HR</h2>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = location === item.route;

              return (
                <li key={item.id}>
                  <Link href={item.route}>
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer",
                        isActive && "bg-gray-100 text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="ml-3">{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback className="bg-gray-300 text-gray-600">
                {user ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-secondary">
                {user?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ") || "User"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
