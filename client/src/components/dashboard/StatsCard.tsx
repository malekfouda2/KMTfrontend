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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-secondary">{value}</p>
          </div>
          <div className={`w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center ${iconColor.replace('text-', 'bg-')}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        {(change || subtitle) && (
          <div className="mt-4 flex items-center">
            {change && (
              <span className={`text-sm font-medium ${changeColorMap[changeType]}`}>
                {change}
              </span>
            )}
            {subtitle && (
              <span className="text-gray-500 text-sm ml-2">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
