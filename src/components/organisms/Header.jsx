import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <div className="lg:ml-64 bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} className="text-gray-500" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-primary" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">Dr. Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;