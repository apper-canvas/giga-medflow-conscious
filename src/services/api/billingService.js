import billingData from "@/services/mockData/billing.json";

class BillingService {
  constructor() {
    this.bills = [...billingData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.bills];
  }

  async getById(id) {
    await this.delay(200);
    const bill = this.bills.find(b => b.Id === parseInt(id));
    if (!bill) {
      throw new Error("Bill not found");
    }
    return { ...bill };
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.bills.filter(bill => 
      bill.patientId === patientId.toString()
    );
  }

  async getOverdueBills() {
    await this.delay(250);
    const today = new Date();
    return this.bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate < today && bill.status !== "Paid";
    });
  }

  async create(billData) {
    await this.delay(400);
    const newBill = {
      ...billData,
      Id: Math.max(...this.bills.map(b => b.Id)) + 1,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.max(...this.bills.map(b => b.Id)) + 1).padStart(3, '0')}`,
      status: "Pending"
    };
    this.bills.push(newBill);
    return { ...newBill };
  }

  async update(id, billData) {
    await this.delay(300);
    const index = this.bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    this.bills[index] = { ...this.bills[index], ...billData };
    return { ...this.bills[index] };
  }

  async processPayment(id, amount) {
    await this.delay(400);
    const index = this.bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    
    const bill = this.bills[index];
    const newPaidAmount = bill.paidAmount + amount;
    const newStatus = newPaidAmount >= bill.amount ? "Paid" : 
                     newPaidAmount > 0 ? "Partial" : bill.status;
    
    this.bills[index] = {
      ...bill,
      paidAmount: newPaidAmount,
      status: newStatus
    };
    
    return { ...this.bills[index] };
  }

  async getFinancialSummary() {
    await this.delay(300);
    const totalRevenue = this.bills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalCollected = this.bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const totalOutstanding = totalRevenue - totalCollected;
    const overdueBills = this.bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate < new Date() && bill.status !== "Paid";
    });
    
    return {
      totalRevenue,
      totalCollected,
      totalOutstanding,
      overdueAmount: overdueBills.reduce((sum, bill) => sum + (bill.amount - bill.paidAmount), 0),
      overdueCount: overdueBills.length
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new BillingService();