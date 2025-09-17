import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import staffService from "@/services/api/staffService";
import departmentService from "@/services/api/departmentService";
import billingService from "@/services/api/billingService";
import { format } from "date-fns";

const Dashboard = () => {
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    staff: [],
    departments: [],
    billing: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, appointments, staff, departments, billing] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll(),
        billingService.getAll()
      ]);

      setData({
        patients,
        appointments,
        staff,
        departments,
        billing
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate stats
  const totalPatients = data.patients.length;
  const activePatients = data.patients.filter(p => p.status === "Active").length;
  const todaysAppointments = data.appointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.date).toDateString();
    return aptDate === today;
  }).length;
  const totalBeds = data.departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
  const occupiedBeds = data.departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  const recentAppointments = data.appointments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon="Users"
          change="+12%"
          trend="up"
        />
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments}
          icon="Calendar"
          change="+5%"
          trend="up"
        />
        <StatCard
          title="Active Staff"
          value={data.staff.length}
          icon="UserCheck"
          change="+2"
          trend="up"
        />
        <StatCard
          title="Bed Occupancy"
          value={`${occupancyRate}%`}
          icon="Bed"
          change={`${occupiedBeds}/${totalBeds}`}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <ApperIcon name="Calendar" size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentAppointments.map(appointment => (
              <div key={appointment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(appointment.date), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "Confirmed" 
                    ? "bg-success/10 text-success"
                    : appointment.status === "Pending"
                    ? "bg-warning/10 text-warning"
                    : "bg-gray/10 text-gray-600"
                }`}>
                  {appointment.status}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
            <ApperIcon name="Building2" size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.departments.slice(0, 5).map(dept => {
              const occupancy = ((dept.occupiedBeds / dept.totalBeds) * 100).toFixed(0);
              return (
                <div key={dept.Id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-600">
                      {dept.occupiedBeds}/{dept.totalBeds} beds occupied
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{occupancy}%</p>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <ApperIcon name="Zap" size={20} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200 text-center">
            <ApperIcon name="UserPlus" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Patient</p>
          </button>
          <button className="p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors duration-200 text-center">
            <ApperIcon name="CalendarPlus" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Appointment</p>
          </button>
          <button className="p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-colors duration-200 text-center">
            <ApperIcon name="FileText" size={24} className="text-success mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Reports</p>
          </button>
          <button className="p-4 bg-warning/5 hover:bg-warning/10 rounded-lg transition-colors duration-200 text-center">
            <ApperIcon name="Settings" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Settings</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;