import {
  CellError,
  ClientData,
  DataStore,
  TaskData,
  WorkerData,
} from "@/types";
import { create } from "zustand";

export const useDataStore = create<DataStore>((set) => ({
  clients: [],
  workers: [],
  tasks: [],
  errors: [],
  cellErrors: [],

  setClients: (data: ClientData[]) => set({ clients: data }),
  setWorkers: (data: WorkerData[]) => set({ workers: data }),
  setTasks: (data: TaskData[]) => set({ tasks: data }),

  setErrors: (newErrors: string[]) => set({ errors: newErrors }),
  addError: (errorMsg: string) =>
    set((state) => ({ errors: [...state.errors, errorMsg] })),
  clearErrors: () => set({ errors: [] }),

  setCellErrors: (newCellErrors: CellError[]) =>
    set({ cellErrors: newCellErrors }),
  clearCellErrors: () => set({ cellErrors: [] }),
}));
