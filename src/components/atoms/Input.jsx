import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const errorStyles = error ? "border-error focus:border-error focus:ring-error/20" : "border-gray-300";
  
  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;