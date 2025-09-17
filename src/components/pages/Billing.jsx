import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import billingService from "@/services/api/billingService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await billingService.getAll();
      setBills(data);
      setFilteredBills(data);
    } catch (err) {
      setError(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    let filtered = bills;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(bill => bill.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(bill =>
        bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBills(filtered);
  }, [searchQuery, selectedStatus, bills]);

  const handleViewBill = (bill) => {
    toast.info(`Viewing invoice: ${bill.invoiceNumber}`);
  };

  const handleProcessPayment = (bill) => {
    toast.info(`Processing payment for: ${bill.patientName}`);
  };

  const handleCreateBill = () => {
    toast.info("Create new bill form would open here");
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "success";
      case "partial": return "warning";
      case "pending": return "info";
      case "overdue": return "error";
      default: return "default";
    }
  };

  const statuses = ["All", ...new Set(bills.map(bill => bill.status))];

  // Calculate stats
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalCollected = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const overdueBills = bills.filter(bill => bill.status === "Overdue");

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBills} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
          <p className="text-gray-600">Manage patient billing and payment tracking</p>
        </div>
        <Button onClick={handleCreateBill} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
            </div>
            <ApperIcon name="DollarSign" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-success/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Collected</p>
              <p className="text-2xl font-bold text-success">${totalCollected.toLocaleString()}</p>
            </div>
            <ApperIcon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
        <div className="bg-warning/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-warning">${totalOutstanding.toLocaleString()}</p>
            </div>
            <ApperIcon name="Clock" size={24} className="text-warning" />
          </div>
        </div>
        <div className="bg-error/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-error font-medium">Overdue Bills</p>
              <p className="text-2xl font-bold text-error">{overdueBills.length}</p>
            </div>
            <ApperIcon name="AlertTriangle" size={24} className="text-error" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search by patient name or invoice number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <Empty
          title="No bills found"
          description={searchQuery || selectedStatus !== "All" ? "Try adjusting your search or filter criteria" : "Get started by creating your first invoice"}
          action={searchQuery || selectedStatus !== "All" ? () => { setSearchQuery(""); setSelectedStatus("All"); } : handleCreateBill}
          actionLabel={searchQuery || selectedStatus !== "All" ? "Clear Filters" : "Create First Invoice"}
          icon={searchQuery || selectedStatus !== "All" ? "Search" : "CreditCard"}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invoice Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.Id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bill.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(bill.date), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">${bill.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Paid: ${bill.paidAmount.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(bill.status)}>
                        {bill.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBill(bill)}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      {bill.status !== "Paid" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProcessPayment(bill)}
                        >
                          <ApperIcon name="CreditCard" size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Billing;