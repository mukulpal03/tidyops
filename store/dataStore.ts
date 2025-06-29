import {
  CellError,
  ClientData,
  DataStore,
  TaskData,
  WorkerData,
  BusinessRule,
  PrioritizationWeights,
} from "@/types";
import { create } from "zustand";

export const useDataStore = create<DataStore>((set) => ({
  clients: [],
  workers: [],
  tasks: [],
  errors: [],
  cellErrors: [],
  businessRules: [],
  prioritizationWeights: {
    priorityLevel: 50,
    fulfillment: 30,
    fairness: 20,
    efficiency: 40,
    cost: 25,
    speed: 35,
  },

  setClients: (data: ClientData[]) => set({ clients: data }),
  setWorkers: (data: WorkerData[]) => set({ workers: data }),
  setTasks: (data: TaskData[]) => set({ tasks: data }),

  clearClients: () => set({ clients: [] }),
  clearWorkers: () => set({ workers: [] }),
  clearTasks: () => set({ tasks: [] }),

  updateClientCell: (rowIndex: number, columnId: string, value: any) =>
    set((state) => ({
      clients: state.clients.map((client, index) =>
        index === rowIndex ? { ...client, [columnId]: value } : client
      ),
    })),

  updateWorkerCell: (rowIndex: number, columnId: string, value: any) =>
    set((state) => ({
      workers: state.workers.map((worker, index) =>
        index === rowIndex ? { ...worker, [columnId]: value } : worker
      ),
    })),

  updateTaskCell: (rowIndex: number, columnId: string, value: any) =>
    set((state) => ({
      tasks: state.tasks.map((task, index) =>
        index === rowIndex ? { ...task, [columnId]: value } : task
      ),
    })),

  setErrors: (newErrors: string[]) => set({ errors: newErrors }),
  addError: (errorMsg: string) =>
    set((state) => ({ errors: [...state.errors, errorMsg] })),
  clearErrors: () => set({ errors: [] }),

  setCellErrors: (newCellErrors: CellError[]) =>
    set({ cellErrors: newCellErrors }),
  clearCellErrors: () => set({ cellErrors: [] }),

  // Business Rules Management
  addBusinessRule: (rule: BusinessRule) =>
    set((state) => ({ businessRules: [...state.businessRules, rule] })),

  updateBusinessRule: (ruleId: string, updates: Partial<BusinessRule>) =>
    set((state) => ({
      businessRules: state.businessRules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    })),

  removeBusinessRule: (ruleId: string) =>
    set((state) => ({
      businessRules: state.businessRules.filter((rule) => rule.id !== ruleId),
    })),

  setBusinessRules: (rules: BusinessRule[]) => set({ businessRules: rules }),

  // Prioritization Weights Management
  setPrioritizationWeights: (weights: PrioritizationWeights) =>
    set({ prioritizationWeights: weights }),

  updatePrioritizationWeight: (
    key: keyof PrioritizationWeights,
    value: number
  ) =>
    set((state) => ({
      prioritizationWeights: {
        ...state.prioritizationWeights,
        [key]: value,
      },
    })),
}));
