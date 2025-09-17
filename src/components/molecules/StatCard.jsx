import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change,
  trend,
  className 
}) => {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={cn("flex items-center text-sm", trendColor)}>
              <ApperIcon name={trendIcon} size={16} className="mr-1" />
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <ApperIcon name={icon} size={24} className="text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;