import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import departmentService from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleViewDepartment = (department) => {
    toast.info(`Viewing department: ${department.name}`);
  };

  const handleEditDepartment = (department) => {
    toast.info(`Editing department: ${department.name}`);
  };

  const handleAddDepartment = () => {
    toast.info("Add new department form would open here");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  // Calculate overall stats
  const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
  const totalOccupied = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
  const overallOccupancy = totalBeds > 0 ? ((totalOccupied / totalBeds) * 100).toFixed(1) : 0;
  const availableBeds = totalBeds - totalOccupied;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-600">Manage hospital departments and bed allocation</p>
        </div>
        <Button onClick={handleAddDepartment} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Department
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Beds</p>
              <p className="text-2xl font-bold text-primary">{totalBeds}</p>
            </div>
            <ApperIcon name="Bed" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-warning/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Occupied Beds</p>
              <p className="text-2xl font-bold text-warning">{totalOccupied}</p>
            </div>
            <ApperIcon name="UserCheck" size={24} className="text-warning" />
          </div>
        </div>
        <div className="bg-success/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Available Beds</p>
              <p className="text-2xl font-bold text-success">{availableBeds}</p>
            </div>
            <ApperIcon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
        <div className="bg-info/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">Occupancy Rate</p>
              <p className="text-2xl font-bold text-info">{overallOccupancy}%</p>
            </div>
            <ApperIcon name="BarChart3" size={24} className="text-info" />
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <Empty
          title="No departments found"
          description="Get started by adding your first department"
          action={handleAddDepartment}
          actionLabel="Add First Department"
          icon="Building2"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => {
            const occupancyRate = ((department.occupiedBeds / department.totalBeds) * 100).toFixed(0);
            const isHighOccupancy = occupancyRate >= 90;
            const isMediumOccupancy = occupancyRate >= 70 && occupancyRate < 90;
            
            return (
              <Card key={department.Id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-600">{department.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDepartment(department)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                  </div>
                </div>

                {/* Bed Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Bed Occupancy</span>
                    <span className="text-sm font-bold text-gray-900">
                      {department.occupiedBeds}/{department.totalBeds}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isHighOccupancy ? "bg-error" : 
                        isMediumOccupancy ? "bg-warning" : "bg-success"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{occupancyRate}% Occupied</span>
                    <span>{department.totalBeds - department.occupiedBeds} Available</span>
                  </div>
                </div>

                {/* Department Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="User" size={16} className="mr-2 text-gray-400" />
                    <span>{department.headOfDepartment}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
                    <span>{department.phone}</span>
                  </div>
                  {department.specialties && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {department.specialties.slice(0, 2).map((specialty, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                        >
                          {specialty}
                        </span>
                      ))}
                      {department.specialties.length > 2 && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          +{department.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Departments;