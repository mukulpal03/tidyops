import { ClientData, DataStore, TaskData, WorkerData } from "@/types";
import { create } from "zustand";

export const useDataStore = create<DataStore>((set) => ({
  clients: [],
  workers: [],
  tasks: [],
  errors: null,

  setClients: (data: ClientData[]) => set({ clients: data }),

  setWorkers: (data: WorkerData[]) => set({ workers: data }),

  setTasks: (data: TaskData[]) => set({ tasks: data }),

  setErrors: (data: string) => set({ errors: data }),
}));
