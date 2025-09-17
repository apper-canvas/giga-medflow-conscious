import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import StaffDirectory from "@/components/organisms/StaffDirectory";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";
import { toast } from "react-toastify";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    let filtered = staff;

    // Filter by role
    if (selectedRole !== "All") {
      filtered = filtered.filter(member => member.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  }, [searchQuery, selectedRole, staff]);

  const handleViewStaff = (member) => {
    toast.info(`Viewing staff member: ${member.name}`);
  };

  const handleEditStaff = (member) => {
    toast.info(`Editing staff member: ${member.name}`);
  };

  const handleAddStaff = () => {
    toast.info("Add new staff member form would open here");
  };

  const roles = ["All", ...new Set(staff.map(member => member.role))];
  
  // Calculate stats by role
  const doctorCount = staff.filter(member => member.role === "Doctor").length;
  const nurseCount = staff.filter(member => member.role === "Nurse").length;
  const adminCount = staff.filter(member => member.role === "Admin").length;
  const techCount = staff.filter(member => member.role === "Technician").length;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
          <p className="text-gray-600">Manage hospital staff and personnel information</p>
        </div>
        <Button onClick={handleAddStaff} className="w-full sm:w-auto">
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Doctors</p>
              <p className="text-2xl font-bold text-primary">{doctorCount}</p>
            </div>
            <ApperIcon name="Stethoscope" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-success/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Nurses</p>
              <p className="text-2xl font-bold text-success">{nurseCount}</p>
            </div>
            <ApperIcon name="Heart" size={24} className="text-success" />
          </div>
        </div>
        <div className="bg-warning/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Admin Staff</p>
              <p className="text-2xl font-bold text-warning">{adminCount}</p>
            </div>
            <ApperIcon name="Settings" size={24} className="text-warning" />
          </div>
        </div>
        <div className="bg-info/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">Technicians</p>
              <p className="text-2xl font-bold text-info">{techCount}</p>
            </div>
            <ApperIcon name="Wrench" size={24} className="text-info" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search staff by name, department, or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Staff Directory */}
      {filteredStaff.length === 0 ? (
        <Empty
          title="No staff members found"
          description={searchQuery || selectedRole !== "All" ? "Try adjusting your search or filter criteria" : "Get started by adding your first staff member"}
          action={searchQuery || selectedRole !== "All" ? () => { setSearchQuery(""); setSelectedRole("All"); } : handleAddStaff}
          actionLabel={searchQuery || selectedRole !== "All" ? "Clear Filters" : "Add First Staff Member"}
          icon={searchQuery || selectedRole !== "All" ? "Search" : "UserPlus"}
        />
      ) : (
        <StaffDirectory
          staff={filteredStaff}
          onViewStaff={handleViewStaff}
          onEditStaff={handleEditStaff}
        />
      )}
    </div>
  );
};

export default Staff;