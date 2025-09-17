import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import PatientTable from "@/components/organisms/PatientTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const handleViewPatient = (patient) => {
    toast.info(`Viewing patient: ${patient.firstName} ${patient.lastName}`);
  };

  const handleEditPatient = (patient) => {
    toast.info(`Editing patient: ${patient.firstName} ${patient.lastName}`);
  };

  const handleAddPatient = () => {
    toast.info("Add new patient form would open here");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Records</h2>
          <p className="text-gray-600">Manage patient information and medical records</p>
        </div>
        <Button onClick={handleAddPatient} className="w-full sm:w-auto">
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search patients by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Patients</p>
              <p className="text-2xl font-bold text-primary">{patients.length}</p>
            </div>
            <ApperIcon name="Users" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-success/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Active Patients</p>
              <p className="text-2xl font-bold text-success">
                {patients.filter(p => p.status === "Active").length}
              </p>
            </div>
            <ApperIcon name="UserCheck" size={24} className="text-success" />
          </div>
        </div>
        <div className="bg-warning/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Recent Visits</p>
              <p className="text-2xl font-bold text-warning">
                {patients.filter(p => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <ApperIcon name="Calendar" size={24} className="text-warning" />
          </div>
        </div>
        <div className="bg-info/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">Search Results</p>
              <p className="text-2xl font-bold text-info">{filteredPatients.length}</p>
            </div>
            <ApperIcon name="Search" size={24} className="text-info" />
          </div>
        </div>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <Empty
          title="No patients found"
          description={searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first patient"}
          action={searchQuery ? () => setSearchQuery("") : handleAddPatient}
          actionLabel={searchQuery ? "Clear Search" : "Add First Patient"}
          icon={searchQuery ? "Search" : "UserPlus"}
        />
      ) : (
        <PatientTable
          patients={filteredPatients}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
        />
      )}
    </div>
  );
};

export default Patients;