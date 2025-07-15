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
  Gift,
  AlertTriangle,
  DollarSign,
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
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
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
    id: "leave-balance",
    label: "Leave Balance",
    icon: "Calendar",
    route: "/leave-balance",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "leave-types",
    label: "Leave Types",
    icon: "Calendar",
    route: "/leave-types",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "check-in-out",
    label: "Check In/Out",
    icon: "Clock",
    route: "/check-in-out",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "overtime",
    label: "Overtime",
    icon: "Clock",
    route: "/overtime",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "late-arrival",
    label: "Late Arrival",
    icon: "AlertTriangle",
    route: "/late-arrival",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "bonus",
    label: "Bonus",
    icon: "Gift",
    route: "/bonus",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "penalty",
    label: "Penalty",
    icon: "AlertTriangle",
    route: "/penalty",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: "DollarSign",
    route: "/payroll",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "TrendingUp",
    route: "/analytics",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "departments",
    label: "Departments",
    icon: "Building2",
    route: "/departments",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "roles",
    label: "Roles",
    icon: "Shield",
    route: "/roles",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
  },
  {
    id: "titles",
    label: "Job Titles",
    icon: "Briefcase",
    route: "/titles",
    roles: ["Super Admin", "Admin", "HR Manager", "general_manager", "hr_manager"] as any,
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
  Gift,
  AlertTriangle,
  DollarSign,
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
      className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-200"
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
        "w-64 bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto lg:h-full",
        "fixed inset-y-0 left-0 z-50 h-screen overflow-y-auto",
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
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = location === item.route;

              return (
                <li key={item.id}>
                  <Link href={item.route}>
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer",
                        isActive && "bg-primary text-white shadow-sm"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
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
