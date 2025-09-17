import departmentsData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.departments];
  }

  async getById(id) {
    await this.delay(200);
    const department = this.departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  }

  async create(departmentData) {
    await this.delay(400);
    const newDepartment = {
      ...departmentData,
      Id: Math.max(...this.departments.map(d => d.Id)) + 1,
      status: "Active"
    };
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await this.delay(300);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    this.departments[index] = { ...this.departments[index], ...departmentData };
    return { ...this.departments[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    this.departments.splice(index, 1);
    return true;
  }

  async getBedOccupancy() {
    await this.delay(250);
    return this.departments.map(dept => ({
      name: dept.name,
      totalBeds: dept.totalBeds,
      occupiedBeds: dept.occupiedBeds,
      occupancyRate: ((dept.occupiedBeds / dept.totalBeds) * 100).toFixed(1)
    }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DepartmentService();