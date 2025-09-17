import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const AppointmentCalendar = ({ appointments, selectedDate, onDateSelect }) => {
  const weekStart = startOfWeek(selectedDate || new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
  ];

  const getAppointmentsForSlot = (date, time) => {
    return appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      const aptTime = format(aptDate, "HH:mm");
      return isSameDay(aptDate, date) && aptTime === time;
    }) || [];
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {format(weekStart, "MMM dd")} - {format(addDays(weekStart, 6), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Week header */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-500 bg-gray-50">Time</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="p-4 text-center bg-gray-50">
                <div className="text-sm font-medium text-gray-900">
                  {format(day, "EEE")}
                </div>
                <div className="text-lg font-bold text-gray-700">
                  {format(day, "dd")}
                </div>
              </div>
            ))}
          </div>
          
          {/* Time slots */}
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-4 text-sm font-medium text-gray-500 bg-gray-50 border-r border-gray-200">
                {time}
              </div>
              {weekDays.map(day => {
                const dayAppointments = getAppointmentsForSlot(day, time);
                return (
                  <div key={day.toISOString()} className="p-2 min-h-[80px] border-r border-gray-100 hover:bg-gray-50 transition-colors">
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.Id}
                        className="mb-1 p-2 rounded text-xs bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-primary truncate">
                          {apt.patientName}
                        </div>
                        <div className="text-gray-600 truncate">
                          {apt.type}
                        </div>
                        <Badge variant={getStatusVariant(apt.status)} size="sm" className="mt-1">
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCalendar;