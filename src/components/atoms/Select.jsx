import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const errorStyles = error ? "border-error focus:border-error focus:ring-error/20" : "border-gray-300";
  
  return (
    <select
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;