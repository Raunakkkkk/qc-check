import React, { useState } from "react";
import type { Shipment } from "../types/qc";
import { QCStatus } from "../types/qc";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaWarehouse, FaPlus, FaFileCsv } from "react-icons/fa";
import { useQCState } from "../hooks/useQCState";

const statusLabel: Record<QCStatus, string> = {
  [QCStatus.Pending]: "Pending",
  [QCStatus.Level1Complete]: "Level 1 Complete",
  [QCStatus.Level2Complete]: "Level 2 Complete",
  [QCStatus.Completed]: "Completed",
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, setShipments } = useQCState();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    supplier: "",
    items: "",
    expectedDate: "",
  });
  const [error, setError] = useState("");

  const handleAction = (shipment: Shipment) => {
    if (shipment.status === QCStatus.Pending) {
      navigate(`/level1/${shipment.id}`);
    } else if (shipment.status === QCStatus.Level1Complete) {
      navigate(`/level2/${shipment.id}`);
    } else {
      navigate(`/shipment/${shipment.id}`);
    }
  };

  const handleAddShipment = () => {
    setShowModal(true);
    setForm({ id: "", supplier: "", items: "", expectedDate: "" });
    setError("");
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.supplier || !form.items || !form.expectedDate) {
      setError("All fields are required.");
      return;
    }
    const newShipment: Shipment = {
      id: form.id,
      supplier: form.supplier,
      items: form.items.split(",").map((item) => item.trim()),
      expectedDate: form.expectedDate,
      status: QCStatus.Pending,
      level1Complete: false,
      level2Complete: false,
    };
    setShipments([...shipments, newShipment]);
    setShowModal(false);
  };

  // Statistics calculation
  const totalShipments = shipments.length;
  const pendingQC = shipments.filter(
    (s) => s.status === QCStatus.Pending
  ).length;
  const completedQC = shipments.filter(
    (s) => s.status === QCStatus.Completed
  ).length;
  const issuesFound = shipments.filter((s) => {
    if (s.level2Data && s.level2Data.failedItems > 0) return true;
    if (s.level1Data && s.level1Data.damages && s.level1Data.damages !== "None")
      return true;
    return false;
  }).length;

  return (
    <div className="min-h-screen w-full p-2 sm:p-4">
      {/* Modal for Add Shipment */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Shipment</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">ID</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, id: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Supplier</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.supplier}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, supplier: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Items (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.items}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, items: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Expected Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={form.expectedDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expectedDate: e.target.value }))
                  }
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Enhanced Header with Top Buttons */}
      <header className="mb-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-50 to-white border-l-8 border-blue-600 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <FaWarehouse className="text-blue-600 w-10 h-10" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-1">
                Warehouse QC Dashboard
              </h1>
              <p className="text-gray-600 text-base sm:text-lg flex items-center gap-2">
                <span>
                  Monitor and manage quality control for all incoming shipments.
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center justify-end">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow transition text-sm"
              onClick={handleAddShipment}
            >
              <FaPlus className="w-4 h-4" /> Add Shipment
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold shadow transition text-sm"
              onClick={() => alert("Export CSV")}
            >
              <FaFileCsv className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
      </header>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 w-full">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold text-blue-600">
            {totalShipments}
          </span>
          <span className="text-gray-500 mt-2">Total Shipments</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold text-yellow-500">
            {pendingQC}
          </span>
          <span className="text-gray-500 mt-2">Pending QC</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold text-green-600">
            {completedQC}
          </span>
          <span className="text-gray-500 mt-2">Completed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold text-red-600">
            {issuesFound}
          </span>
          <span className="text-gray-500 mt-2">Issues Found</span>
        </div>
      </div>
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                ID
              </th>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                Supplier
              </th>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                Items
              </th>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                Expected Date
              </th>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                Status
              </th>
              <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-xs font-medium text-black uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-black">
                  {shipment.id}
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-black">
                  {shipment.supplier}
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-black">
                  {shipment.items.join(", ")}
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-black">
                  {shipment.expectedDate}
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">
                    {statusLabel[shipment.status]}
                  </span>
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <button
                    className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow text-xs font-medium transition"
                    onClick={() => handleAction(shipment)}
                  >
                    {shipment.status === QCStatus.Pending && "Level 1 QC"}
                    {shipment.status === QCStatus.Level1Complete &&
                      "Level 2 QC"}
                    {shipment.status === QCStatus.Level2Complete && "View"}
                    {shipment.status === QCStatus.Completed && "View"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
