import React, { useState } from "react";
import type { Level1QC } from "../types/qc";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";

const mockShipments = [
  { id: "SHP001", supplier: "Acme Corp" },
  { id: "SHP002", supplier: "Beta Supplies" },
  { id: "SHP003", supplier: "Gamma Goods" },
  { id: "SHP004", supplier: "Delta Distributors" },
];

const conditionOptions = ["Good", "Damaged", "Average", "Poor"];

const packagingOptions = ["Intact", "Torn", "Wet", "Other"];

interface Level1QCFormProps {
  initialData?: Partial<Level1QC>;
  onSaveDraft?: (data: Level1QC) => void;
  onComplete?: (data: Level1QC) => void;
}

const Level1QCForm: React.FC<Level1QCFormProps> = ({
  initialData = {},
  onSaveDraft,
  onComplete,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shipment = mockShipments.find((s) => s.id === id);
  const [form, setForm] = useState<Level1QC>({
    receivedDate: initialData.receivedDate || "",
    receivedBy: initialData.receivedBy || "",
    overallCondition: initialData.overallCondition || "",
    packagingIntegrity: initialData.packagingIntegrity || "",
    quantityReceived: initialData.quantityReceived || 0,
    damages: initialData.damages || "",
    documentation: initialData.documentation || "",
    notes: initialData.notes || "",
  });
  const [errors, setErrors] = useState<Record<keyof Level1QC, string>>({
    receivedDate: "",
    receivedBy: "",
    overallCondition: "",
    packagingIntegrity: "",
    quantityReceived: "",
    damages: "",
    documentation: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<keyof Level1QC, string> = {
      receivedDate: form.receivedDate ? "" : "Required",
      receivedBy: form.receivedBy ? "" : "Required",
      overallCondition: form.overallCondition ? "" : "Required",
      packagingIntegrity: form.packagingIntegrity ? "" : "Required",
      quantityReceived: form.quantityReceived > 0 ? "" : "Required",
      damages: form.damages ? "" : "Required",
      documentation: form.documentation ? "" : "Required",
      notes: "", // optional
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleChange = <K extends keyof Level1QC>(
    key: K,
    value: Level1QC[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) onSaveDraft(form);
    toast.success("Draft saved!");
  };

  const handleComplete = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (onComplete) onComplete(form);
      toast.success("Level 1 QC completed!");
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-2 sm:p-8 mt-8">
      <button
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>
      <div className="mb-4">
        <div className="font-semibold text-gray-700">
          Shipment ID: <span className="text-gray-900">{id}</span>
        </div>
        <div className="text-gray-600">
          Supplier:{" "}
          <span className="text-gray-900">
            {shipment?.supplier || "Unknown"}
          </span>
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            1
          </div>
          <div className="h-1 w-8 bg-blue-300 mx-2" />
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold">
            2
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Step 1 of 2: Initial Inspection
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Level 1 QC - Initial Shipment Inspection
      </h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {/* Received Date */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Received Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full border rounded px-3 py-2 ${
                errors.receivedDate ? "border-red-500" : "border-gray-300"
              }`}
              value={form.receivedDate}
              onChange={(e) => handleChange("receivedDate", e.target.value)}
            />
            {errors.receivedDate && (
              <div className="text-red-500 text-xs mt-1">
                {errors.receivedDate}
              </div>
            )}
          </div>
          {/* Received By */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Received By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${
                errors.receivedBy ? "border-red-500" : "border-gray-300"
              }`}
              value={form.receivedBy}
              onChange={(e) => handleChange("receivedBy", e.target.value)}
            />
            {errors.receivedBy && (
              <div className="text-red-500 text-xs mt-1">
                {errors.receivedBy}
              </div>
            )}
          </div>
          {/* Overall Condition */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Overall Condition <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full border rounded px-3 py-2 ${
                errors.overallCondition ? "border-red-500" : "border-gray-300"
              }`}
              value={form.overallCondition}
              onChange={(e) => handleChange("overallCondition", e.target.value)}
            >
              <option value="">Select condition</option>
              {conditionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.overallCondition && (
              <div className="text-red-500 text-xs mt-1">
                {errors.overallCondition}
              </div>
            )}
          </div>
          {/* Packaging Integrity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Packaging Integrity <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full border rounded px-3 py-2 ${
                errors.packagingIntegrity ? "border-red-500" : "border-gray-300"
              }`}
              value={form.packagingIntegrity}
              onChange={(e) =>
                handleChange("packagingIntegrity", e.target.value)
              }
            >
              <option value="">Select integrity</option>
              {packagingOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.packagingIntegrity && (
              <div className="text-red-500 text-xs mt-1">
                {errors.packagingIntegrity}
              </div>
            )}
          </div>
          {/* Quantity Received */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Quantity Received <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              className={`w-full border rounded px-3 py-2 ${
                errors.quantityReceived ? "border-red-500" : "border-gray-300"
              }`}
              value={form.quantityReceived}
              onChange={(e) =>
                handleChange("quantityReceived", Number(e.target.value))
              }
            />
            {errors.quantityReceived && (
              <div className="text-red-500 text-xs mt-1">
                {errors.quantityReceived}
              </div>
            )}
          </div>
          {/* Damages */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Damages <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${
                errors.damages ? "border-red-500" : "border-gray-300"
              }`}
              value={form.damages}
              onChange={(e) => handleChange("damages", e.target.value)}
              placeholder="e.g. None, Box torn, 2 items broken"
            />
            {errors.damages && (
              <div className="text-red-500 text-xs mt-1">{errors.damages}</div>
            )}
          </div>
          {/* Documentation Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Documentation Status <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${
                errors.documentation ? "border-red-500" : "border-gray-300"
              }`}
              value={form.documentation}
              onChange={(e) => handleChange("documentation", e.target.value)}
              placeholder="e.g. Complete, Incomplete"
            />
            {errors.documentation && (
              <div className="text-red-500 text-xs mt-1">
                {errors.documentation}
              </div>
            )}
          </div>
          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Additional Notes
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 border-gray-300 min-h-[80px]"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional information..."
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-2 sm:mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium w-full sm:w-auto"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium w-full sm:w-auto"
            onClick={handleComplete}
            disabled={submitting}
          >
            {submitting ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Complete Level 1"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Level1QCForm;
