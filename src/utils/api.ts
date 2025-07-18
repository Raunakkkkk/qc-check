import type { Shipment } from "../types/qc";
import { loadFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "shipments";

export async function getShipments(): Promise<Shipment[]> {
  try {
    const data = loadFromStorage<Shipment[]>(STORAGE_KEY);
    return data || [];
  } catch (e) {
    throw new Error("Failed to load shipments");
  }
}

export async function saveShipment(shipment: Shipment): Promise<void> {
  try {
    const shipments = (loadFromStorage<Shipment[]>(STORAGE_KEY) || []).filter(
      (s) => s.id !== shipment.id
    );
    shipments.push(shipment);
    saveToStorage(STORAGE_KEY, shipments);
  } catch (e) {
    throw new Error("Failed to save shipment");
  }
}

export async function deleteShipment(id: string): Promise<void> {
  try {
    const shipments = (loadFromStorage<Shipment[]>(STORAGE_KEY) || []).filter(
      (s) => s.id !== id
    );
    saveToStorage(STORAGE_KEY, shipments);
  } catch (e) {
    throw new Error("Failed to delete shipment");
  }
}

export async function updateShipment(shipment: Shipment): Promise<void> {
  return saveShipment(shipment);
}
