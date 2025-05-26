import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  breadcrumb?: string;
}

export const Header = ({ title, breadcrumb = "Home" }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{title}</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <span>{breadcrumb} / {title}</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-400 hover:text-gray-600"
          >
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
