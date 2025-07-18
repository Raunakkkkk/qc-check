import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Level1QCForm from "./components/Level1QCForm";
import Level2QCForm from "./components/Level2QCForm";
import Breadcrumbs from "./components/Breadcrumbs";
import { QCStateProvider, useQCState } from "./hooks/useQCState";
import { Toaster } from "react-hot-toast";

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Shipment Details
      </h2>
      <div className="text-gray-700">
        Shipment ID: <span className="font-mono">{id}</span>
      </div>
      {/* Add more shipment details here as needed */}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useQCState();

  // Breadcrumbs logic
  const breadcrumbs: { label: string; onClick?: () => void }[] = [];
  if (location.pathname.startsWith("/level1")) {
    breadcrumbs.push({ label: "Level 1 QC" });
  } else if (location.pathname.startsWith("/level2")) {
    breadcrumbs.push({ label: "Level 2 QC" });
  } else if (location.pathname.startsWith("/shipment")) {
    breadcrumbs.push({ label: "Shipment Details" });
  }

  // Back button logic
  const handleBack = () => {
    if (
      location.pathname.startsWith("/level1") ||
      location.pathname.startsWith("/level2") ||
      location.pathname.startsWith("/shipment")
    ) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50" style={{ minWidth: 0 }}>
      <div className="w-full p-2 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <Breadcrumbs
            items={breadcrumbs}
            onBack={location.pathname !== "/" ? handleBack : undefined}
          />
        </div>
        {loading && (
          <div className="mb-4 flex justify-center">
            <span className="loader" />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/level1/:id" element={<Level1QCForm />} />
          <Route path="/level2/:id" element={<Level2QCForm />} />
          <Route path="/shipment/:id" element={<ShipmentDetails />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QCStateProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster position="top-right" />
    </QCStateProvider>
  );
};

export default App;
