import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay(200);
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.appointments.filter(appointment => 
      appointment.patientId === patientId.toString()
    );
  }

  async getByDate(date) {
    await this.delay(250);
    const targetDate = new Date(date).toDateString();
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date).toDateString();
      return appointmentDate === targetDate;
    });
  }

  async create(appointmentData) {
    await this.delay(400);
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
      status: "Pending"
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay(300);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppointmentService();