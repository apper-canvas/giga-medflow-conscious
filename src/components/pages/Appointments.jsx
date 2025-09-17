import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import { toast } from "react-toastify";
import { format, addDays, startOfWeek } from "date-fns";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleScheduleAppointment = () => {
    toast.info("Schedule appointment form would open here");
  };

  const handleViewAppointment = (appointment) => {
    toast.info(`Viewing appointment: ${appointment.patientName}`);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  // Calculate stats
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.date).toDateString();
    return aptDate === today;
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate >= today;
  });

  const confirmedAppointments = appointments.filter(apt => apt.status === "Confirmed");
  const pendingAppointments = appointments.filter(apt => apt.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">Manage patient appointments and scheduling</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <ApperIcon name="List" size={16} className="mr-2" />
            List
          </Button>
          <Button onClick={handleScheduleAppointment}>
            <ApperIcon name="CalendarPlus" size={16} className="mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Appointment Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Today's Appointments</p>
              <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
            </div>
            <ApperIcon name="Calendar" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-success/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Confirmed</p>
              <p className="text-2xl font-bold text-success">{confirmedAppointments.length}</p>
            </div>
            <ApperIcon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
        <div className="bg-warning/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Pending</p>
              <p className="text-2xl font-bold text-warning">{pendingAppointments.length}</p>
            </div>
            <ApperIcon name="Clock" size={24} className="text-warning" />
          </div>
        </div>
        <div className="bg-info/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-info">{upcomingAppointments.length}</p>
            </div>
            <ApperIcon name="ArrowRight" size={24} className="text-info" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {appointments.length === 0 ? (
        <Empty
          title="No appointments scheduled"
          description="Get started by scheduling your first appointment"
          action={handleScheduleAppointment}
          actionLabel="Schedule First Appointment"
          icon="CalendarPlus"
        />
      ) : (
        <div>
          {viewMode === "calendar" ? (
            <AppointmentCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.slice(0, 10).map(appointment => (
                  <div key={appointment.Id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(appointment.date), "MMM dd, yyyy 'at' HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Confirmed" 
                            ? "bg-success/10 text-success"
                            : appointment.status === "Pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-gray/10 text-gray-600"
                        }`}>
                          {appointment.status}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{appointment.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;