export interface DataStore {
  clients: ClientData[];
  workers: WorkerData[];
  tasks: TaskData[];
  errors: string[];
  cellErrors: CellError[];

  setClients: (data: ClientData[]) => void;
  setWorkers: (data: WorkerData[]) => void;
  setTasks: (data: TaskData[]) => void;

  clearClients: () => void;
  clearWorkers: () => void;
  clearTasks: () => void;

  setErrors: (newErrors: string[]) => void;
  addError: (errorMsg: string) => void;
  clearErrors: () => void;

  setCellErrors: (newCellErrors: CellError[]) => void;
  clearCellErrors: () => void;
}

export interface ClientData {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface WorkerData {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: string;
}

export interface TaskData {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface CellError {
  entityType: "clients" | "workers" | "tasks";
  rowIndex: number;
  columnId: string;
  message: string;
}

export interface ValidationResult {
  cellErrors: CellError[];
  globalErrors: string[];
  isValid: boolean;
}
