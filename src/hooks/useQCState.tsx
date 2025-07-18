import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Shipment } from "../types/qc";
import { getShipments, saveShipment } from "../utils/api";
import { backupStorage, restoreStorage } from "../utils/storage";
import { DUMMY_SHIPMENTS } from "../types/dummyShipments";

interface QCStateContextProps {
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  backup: () => string;
  restore: (backup: string) => void;
}

const QCStateContext = createContext<QCStateContextProps | undefined>(
  undefined
);

export const QCStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load shipments from localStorage on mount
  useEffect(() => {
    setLoading(true);
    getShipments()
      .then((data) => {
        if (!data || data.length === 0) {
          setShipments(DUMMY_SHIPMENTS);
          DUMMY_SHIPMENTS.forEach((s) => saveShipment(s));
        } else {
          setShipments(data);
        }
      })
      .catch(() => setError("Failed to load shipments"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-save shipments to localStorage when changed
  useEffect(() => {
    if (shipments.length > 0) {
      shipments.forEach((s) =>
        saveShipment(s).catch(() => setError("Failed to save shipment"))
      );
    }
  }, [shipments]);

  // Backup and restore
  const backup = () => backupStorage();
  const restore = (backupStr: string) => {
    restoreStorage(backupStr);
    getShipments().then((data) => setShipments(data));
  };

  return (
    <QCStateContext.Provider
      value={{
        shipments,
        setShipments,
        loading,
        setLoading,
        error,
        backup,
        restore,
      }}
    >
      {children}
    </QCStateContext.Provider>
  );
};

export const useQCState = (): QCStateContextProps => {
  const context = useContext(QCStateContext);
  if (!context) {
    throw new Error("useQCState must be used within a QCStateProvider");
  }
  return context;
};
