import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className,
  hover = false,
  ...props 
}) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 card-shadow";
  const hoverStyles = hover ? "hover:shadow-lg transition-shadow duration-200 cursor-pointer" : "";
  
  return (
    <div className={cn(baseStyles, hoverStyles, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;