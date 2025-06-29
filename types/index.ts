export interface DataStore {
  clients: ClientData[];
  workers: WorkerData[];
  tasks: TaskData[];
  errors: string[];
  cellErrors: CellError[];
  businessRules: BusinessRule[];
  prioritizationWeights: PrioritizationWeights;

  setClients: (data: ClientData[]) => void;
  setWorkers: (data: WorkerData[]) => void;
  setTasks: (data: TaskData[]) => void;

  clearClients: () => void;
  clearWorkers: () => void;
  clearTasks: () => void;

  updateClientCell: (rowIndex: number, columnId: string, value: any) => void;
  updateWorkerCell: (rowIndex: number, columnId: string, value: any) => void;
  updateTaskCell: (rowIndex: number, columnId: string, value: any) => void;

  setErrors: (newErrors: string[]) => void;
  addError: (errorMsg: string) => void;
  clearErrors: () => void;

  setCellErrors: (newCellErrors: CellError[]) => void;
  clearCellErrors: () => void;

  // Business Rules Management
  addBusinessRule: (rule: BusinessRule) => void;
  updateBusinessRule: (ruleId: string, updates: Partial<BusinessRule>) => void;
  removeBusinessRule: (ruleId: string) => void;
  setBusinessRules: (rules: BusinessRule[]) => void;

  // Prioritization Weights Management
  setPrioritizationWeights: (weights: PrioritizationWeights) => void;
  updatePrioritizationWeight: (
    key: keyof PrioritizationWeights,
    value: number
  ) => void;
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

export interface AiFilter {
  entityType: "clients" | "workers" | "tasks";
  conditions: Array<{
    column: string;
    operator: string;
    value: any;
    logicalOperator?: "AND" | "OR";
  }>;
  logicalOperator?: "AND" | "OR";
}

export interface BusinessRule {
  id: string;
  type:
    | "coRun"
    | "slotRestriction"
    | "loadLimit"
    | "phaseWindow"
    | "patternMatch"
    | "precedenceOverride";
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  config: any;
}

export interface CoRunRule extends BusinessRule {
  type: "coRun";
  config: {
    taskIDs: string[];
  };
}

export interface SlotRestrictionRule extends BusinessRule {
  type: "slotRestriction";
  config: {
    groupType: "client" | "worker";
    groupName: string;
    minCommonSlots: number;
  };
}

export interface LoadLimitRule extends BusinessRule {
  type: "loadLimit";
  config: {
    workerGroup: string;
    maxSlotsPerPhase: number;
  };
}

export interface PhaseWindowRule extends BusinessRule {
  type: "phaseWindow";
  config: {
    taskID: string;
    allowedPhases: number[];
  };
}

export interface PatternMatchRule extends BusinessRule {
  type: "patternMatch";
  config: {
    regex: string;
    ruleTemplate: string;
    parameters: Record<string, any>;
  };
}

export interface PrecedenceOverrideRule extends BusinessRule {
  type: "precedenceOverride";
  config: {
    globalRules: string[];
    specificRules: Array<{
      condition: string;
      rule: string;
      priority: number;
    }>;
  };
}

export interface PrioritizationWeights {
  priorityLevel: number;
  fulfillment: number;
  fairness: number;
  efficiency: number;
  cost: number;
  speed: number;
}

export interface ExportConfig {
  clients: ClientData[];
  workers: WorkerData[];
  tasks: TaskData[];
  rules: BusinessRule[];
  weights: PrioritizationWeights;
}
