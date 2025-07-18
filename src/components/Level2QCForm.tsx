import React, { useState } from "react";
import type { Level2QC } from "../types/qc";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";

const mockShipments = [
  { id: "SHP001", supplier: "Acme Corp" },
  { id: "SHP002", supplier: "Beta Supplies" },
  { id: "SHP003", supplier: "Gamma Goods" },
  { id: "SHP004", supplier: "Delta Distributors" },
];

const sampleSizeOptions = [5, 10, 20, 100];
const defectTypeOptions = [
  "Broken",
  "Scratched",
  "Missing Parts",
  "Wrong Item",
  "Other",
];

interface Level2QCFormProps {
  initialData?: Partial<Level2QC>;
  onSaveDraft?: (data: Level2QC) => void;
  onComplete?: (data: Level2QC) => void;
}

const Level2QCForm: React.FC<Level2QCFormProps> = ({
  initialData = {},
  onSaveDraft,
  onComplete,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shipment = mockShipments.find((s) => s.id === id);
  const [form, setForm] = useState<Level2QC>({
    sampleSize: initialData.sampleSize || 5,
    itemsChecked: initialData.itemsChecked || 0,
    totalItems: initialData.totalItems || 0,
    passedItems: initialData.passedItems || 0,
    failedItems: initialData.failedItems || 0,
    defectTypes: initialData.defectTypes || [],
    qualityNotes: initialData.qualityNotes || "",
  });
  const [errors, setErrors] = useState<Record<keyof Level2QC, string>>({
    sampleSize: "",
    itemsChecked: "",
    totalItems: "",
    passedItems: "",
    failedItems: "",
    defectTypes: "",
    qualityNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Real-time calculations
  const passRate =
    form.itemsChecked > 0
      ? ((form.passedItems / form.itemsChecked) * 100).toFixed(1)
      : "0";
  const failRate =
    form.itemsChecked > 0
      ? ((form.failedItems / form.itemsChecked) * 100).toFixed(1)
      : "0";

  const validate = (): boolean => {
    const newErrors: Record<keyof Level2QC, string> = {
      sampleSize: form.sampleSize > 0 ? "" : "Required",
      itemsChecked: form.itemsChecked > 0 ? "" : "Required",
      totalItems: form.totalItems > 0 ? "" : "Required",
      passedItems:
        form.passedItems >= 0 && form.passedItems <= form.itemsChecked
          ? ""
          : "Invalid",
      failedItems:
        form.failedItems >= 0 && form.failedItems <= form.itemsChecked
          ? ""
          : "Invalid",
      defectTypes:
        form.failedItems > 0 && form.defectTypes.length === 0
          ? "Select at least one defect"
          : "",
      qualityNotes: "", // optional
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleChange = <K extends keyof Level2QC>(
    key: K,
    value: Level2QC[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDefectTypeChange = (defect: string) => {
    setForm((prev) => {
      const exists = prev.defectTypes.includes(defect);
      return {
        ...prev,
        defectTypes: exists
          ? prev.defectTypes.filter((d) => d !== defect)
          : [...prev.defectTypes, defect],
      };
    });
    setErrors((prev) => ({ ...prev, defectTypes: "" }));
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
      toast.success("Level 2 QC completed!");
    }, 800);
  };

  // Visual indicator color
  const getIndicatorColor = () => {
    if (form.itemsChecked === 0) return "bg-gray-300";
    if (Number(passRate) >= 95) return "bg-green-500";
    if (Number(passRate) >= 80) return "bg-yellow-400";
    return "bg-red-500";
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
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            2
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Step 2 of 2: Detailed Unit Inspection
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Level 2 QC - Detailed Unit Inspection
      </h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {/* Sample Size */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Sample Size (%) <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full border rounded px-3 py-2 ${
                errors.sampleSize ? "border-red-500" : "border-gray-300"
              }`}
              value={form.sampleSize}
              onChange={(e) =>
                handleChange("sampleSize", Number(e.target.value))
              }
            >
              {sampleSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}%
                </option>
              ))}
            </select>
            {errors.sampleSize && (
              <div className="text-red-500 text-xs mt-1">
                {errors.sampleSize}
              </div>
            )}
          </div>
          {/* Total Items */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Total Items <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              className={`w-full border rounded px-3 py-2 ${
                errors.totalItems ? "border-red-500" : "border-gray-300"
              }`}
              value={form.totalItems}
              onChange={(e) =>
                handleChange("totalItems", Number(e.target.value))
              }
            />
            {errors.totalItems && (
              <div className="text-red-500 text-xs mt-1">
                {errors.totalItems}
              </div>
            )}
          </div>
          {/* Items Checked */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Items Checked <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={form.totalItems}
              className={`w-full border rounded px-3 py-2 ${
                errors.itemsChecked ? "border-red-500" : "border-gray-300"
              }`}
              value={form.itemsChecked}
              onChange={(e) =>
                handleChange("itemsChecked", Number(e.target.value))
              }
            />
            {errors.itemsChecked && (
              <div className="text-red-500 text-xs mt-1">
                {errors.itemsChecked}
              </div>
            )}
          </div>
          {/* Passed Items */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Passed Items <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={form.itemsChecked}
              className={`w-full border rounded px-3 py-2 ${
                errors.passedItems ? "border-red-500" : "border-gray-300"
              }`}
              value={form.passedItems}
              onChange={(e) =>
                handleChange("passedItems", Number(e.target.value))
              }
            />
            {errors.passedItems && (
              <div className="text-red-500 text-xs mt-1">
                {errors.passedItems}
              </div>
            )}
          </div>
          {/* Failed Items */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Failed Items <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={form.itemsChecked}
              className={`w-full border rounded px-3 py-2 ${
                errors.failedItems ? "border-red-500" : "border-gray-300"
              }`}
              value={form.failedItems}
              onChange={(e) =>
                handleChange("failedItems", Number(e.target.value))
              }
            />
            {errors.failedItems && (
              <div className="text-red-500 text-xs mt-1">
                {errors.failedItems}
              </div>
            )}
          </div>
          {/* Defect Types */}
          {form.failedItems > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
                Defect Types <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {defectTypeOptions.map((defect) => (
                  <label key={defect} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.defectTypes.includes(defect)}
                      onChange={() => handleDefectTypeChange(defect)}
                    />
                    <span>{defect}</span>
                  </label>
                ))}
              </div>
              {errors.defectTypes && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.defectTypes}
                </div>
              )}
            </div>
          )}
          {/* Quality Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base sm:text-lg">
              Quality Assessment Notes
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 border-gray-300 min-h-[80px]"
              value={form.qualityNotes}
              onChange={(e) => handleChange("qualityNotes", e.target.value)}
              placeholder="Any additional quality notes..."
            />
          </div>
          {/* Visual Indicators */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getIndicatorColor()}`}
              >
                {passRate}%
              </span>
              <span className="text-xs text-gray-500 mt-1">Pass Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white font-bold">
                {failRate}%
              </span>
              <span className="text-xs text-gray-500 mt-1">Fail Rate</span>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-6 w-full sm:w-auto">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={handleSaveDraft}
              disabled={submitting}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleComplete}
              disabled={submitting}
            >
              {submitting ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Complete QC"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Level2QCForm;
