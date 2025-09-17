import staffData from "@/services/mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.staff];
  }

  async getById(id) {
    await this.delay(200);
    const member = this.staff.find(s => s.Id === parseInt(id));
    if (!member) {
      throw new Error("Staff member not found");
    }
    return { ...member };
  }

  async getByDepartment(department) {
    await this.delay(250);
    return this.staff.filter(member => 
      member.department.toLowerCase() === department.toLowerCase()
    );
  }

  async getByRole(role) {
    await this.delay(250);
    return this.staff.filter(member => 
      member.role.toLowerCase() === role.toLowerCase()
    );
  }

  async create(staffData) {
    await this.delay(400);
    const newStaff = {
      ...staffData,
      Id: Math.max(...this.staff.map(s => s.Id)) + 1,
      status: "Active",
      hireDate: new Date().toISOString().split('T')[0]
    };
    this.staff.push(newStaff);
    return { ...newStaff };
  }

  async update(id, staffData) {
    await this.delay(300);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    this.staff[index] = { ...this.staff[index], ...staffData };
    return { ...this.staff[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    this.staff.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new StaffService();