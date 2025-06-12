import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) => {
  const changeColorMap = {
    positive: "text-accent",
    negative: "text-error",
    neutral: "text-gray-500",
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-secondary mt-1">{value}</p>
          </div>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor.replace('text-', 'bg-')}`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
          </div>
        </div>
        {(change || subtitle) && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            {change && (
              <span className={`text-xs sm:text-sm font-medium ${changeColorMap[changeType]}`}>
                {change}
              </span>
            )}
            {subtitle && (
              <span className="text-gray-500 text-xs sm:text-sm sm:ml-2">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
