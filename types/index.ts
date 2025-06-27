export interface DataStore {
  clients: ClientData[] | [];
  workers: WorkerData[] | [];
  tasks: TaskData[] | null;
  errors: string | null;
  setClients: (data: ClientData[]) => void;
  setWorkers: (data: WorkerData[]) => void;
  setTasks: (data: TaskData[]) => void;
  setErrors: (data: string) => void;
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
