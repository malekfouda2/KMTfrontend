import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  breadcrumb?: string;
}

export const Header = ({ title, breadcrumb = "Home" }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="ml-14 lg:ml-0 flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black truncate">{title}</h1>
          <nav className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
            <span>{breadcrumb} / {title}</span>
          </nav>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-xs p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg hidden sm:flex"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
