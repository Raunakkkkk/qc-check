export enum QCStatus {
  Pending = "pending",
  Level1Complete = "level1_complete",
  Level2Complete = "level2_complete",
  Completed = "completed",
}

export interface Level1QC {
  receivedDate: string; // ISO date string
  receivedBy: string;
  overallCondition: string;
  packagingIntegrity: string;
  quantityReceived: number;
  damages: string;
  documentation: string;
  notes?: string;
}

export interface Level2QC {
  sampleSize: number;
  itemsChecked: number;
  totalItems: number;
  passedItems: number;
  failedItems: number;
  defectTypes: string[];
  qualityNotes?: string;
}

export interface Shipment {
  id: string;
  supplier: string;
  items: string[];
  expectedDate: string; // ISO date string
  status: QCStatus;
  level1Complete: boolean;
  level2Complete: boolean;
  level1Data?: Level1QC;
  level2Data?: Level2QC;
}
