import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StaffDirectory = ({ staff, onViewStaff, onEditStaff }) => {
  if (!staff?.length) return null;

  const getRoleVariant = (role) => {
    switch (role?.toLowerCase()) {
      case "doctor": return "primary";
      case "nurse": return "success";
      case "admin": return "warning";
      case "technician": return "info";
      default: return "default";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "doctor": return "Stethoscope";
      case "nurse": return "Heart";
      case "admin": return "Settings";
      case "technician": return "Wrench";
      default: return "User";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((member) => (
        <Card key={member.Id} className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <ApperIcon 
                  name={getRoleIcon(member.role)} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <Badge variant={getRoleVariant(member.role)} size="sm">
                  {member.role}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewStaff(member)}
              >
                <ApperIcon name="Eye" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStaff(member)}
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Building2" size={16} className="mr-2 text-gray-400" />
              <span>{member.department}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
              <span className="truncate">{member.email}</span>
            </div>
            {member.specialization && (
              <div className="flex items-center">
                <ApperIcon name="Award" size={16} className="mr-2 text-gray-400" />
                <span>{member.specialization}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StaffDirectory;