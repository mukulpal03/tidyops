import {
  ClientData,
  TaskData,
  WorkerData,
  ValidationResult,
  CellError,
} from "@/types";

const REQUIRED_COLUMNS = {
  clients: [
    "ClientID",
    "ClientName",
    "PriorityLevel",
    "RequestedTaskIDs",
    "GroupTag",
    "AttributesJSON",
  ],
  workers: [
    "WorkerID",
    "WorkerName",
    "Skills",
    "AvailableSlots",
    "MaxLoadPerPhase",
    "WorkerGroup",
    "QualificationLevel",
  ],
  tasks: [
    "TaskID",
    "TaskName",
    "Category",
    "Duration",
    "RequiredSkills",
    "PreferredPhases",
    "MaxConcurrent",
  ],
};

export function validateAllData(
  clients: ClientData[],
  workers: WorkerData[],
  tasks: TaskData[]
): ValidationResult {
  const cellErrors: CellError[] = [];
  const globalErrors: string[] = [];
  let overallIsValid = true;

  const checkMissingColumns = (
    entityData: any[],
    entityType: "clients" | "workers" | "tasks"
  ) => {
    if (entityData.length === 0) {
      return;
    }

    const firstRow = entityData[0];
    if (!firstRow) {
      globalErrors.push(
        `Error: No rows found in ${entityType} data. Please upload a non-empty file.`
      );
      overallIsValid = false;
      return;
    }
    const actualColumns = Object.keys(firstRow);
    const required = REQUIRED_COLUMNS[entityType];

    const missing = required.filter((col) => !actualColumns.includes(col));

    if (missing.length > 0) {
      globalErrors.push(
        `Missing required columns in ${entityType} data: ${missing.join(
          ", "
        )}. Please upload a file with these columns.`
      );
      overallIsValid = false;
    }
  };

  // Validate each entity type separately
  checkMissingColumns(clients, "clients");
  checkMissingColumns(workers, "workers");
  checkMissingColumns(tasks, "tasks");

  // Additional validation for each entity type
  if (clients.length > 0) {
    clients.forEach((client, index) => {
      if (!client.ClientID) {
        cellErrors.push({
          entityType: "clients",
          rowIndex: index,
          columnId: "ClientID",
          message: "Client ID is required",
        });
      }
      if (!client.ClientName) {
        cellErrors.push({
          entityType: "clients",
          rowIndex: index,
          columnId: "ClientName",
          message: "Client Name is required",
        });
      }
    });
  }

  if (workers.length > 0) {
    workers.forEach((worker, index) => {
      if (!worker.WorkerID) {
        cellErrors.push({
          entityType: "workers",
          rowIndex: index,
          columnId: "WorkerID",
          message: "Worker ID is required",
        });
      }
      if (!worker.WorkerName) {
        cellErrors.push({
          entityType: "workers",
          rowIndex: index,
          columnId: "WorkerName",
          message: "Worker Name is required",
        });
      }
    });
  }

  if (tasks.length > 0) {
    tasks.forEach((task, index) => {
      if (!task.TaskID) {
        cellErrors.push({
          entityType: "tasks",
          rowIndex: index,
          columnId: "TaskID",
          message: "Task ID is required",
        });
      }
      if (!task.TaskName) {
        cellErrors.push({
          entityType: "tasks",
          rowIndex: index,
          columnId: "TaskName",
          message: "Task Name is required",
        });
      }
    });
  }

  if (cellErrors.length > 0 || globalErrors.length > 0) {
    overallIsValid = false;
  } else {
    overallIsValid = true;
  }

  return { cellErrors, globalErrors, isValid: overallIsValid };
}

export function validateEntityData<T>(
  entityData: T[],
  entityType: "clients" | "workers" | "tasks"
): ValidationResult {
  const cellErrors: CellError[] = [];
  const globalErrors: string[] = [];
  let overallIsValid = true;

  if (entityData.length === 0) {
    return { cellErrors, globalErrors, isValid: true };
  }

  const firstRow = entityData[0] as any;
  if (!firstRow) {
    globalErrors.push(
      `Error: No rows found in ${entityType} data. Please upload a non-empty file.`
    );
    overallIsValid = false;
  } else {
    const actualColumns = Object.keys(firstRow);
    const required = REQUIRED_COLUMNS[entityType];

    const missing = required.filter((col) => !actualColumns.includes(col));

    if (missing.length > 0) {
      globalErrors.push(
        `Missing required columns in ${entityType} data: ${missing.join(
          ", "
        )}. Please upload a file with these columns.`
      );
      overallIsValid = false;
    }
  }

  // Validate specific entity type
  if (entityType === "clients" && entityData.length > 0) {
    (entityData as ClientData[]).forEach((client, index) => {
      if (!client.ClientID) {
        cellErrors.push({
          entityType: "clients",
          rowIndex: index,
          columnId: "ClientID",
          message: "Client ID is required",
        });
      }
      if (!client.ClientName) {
        cellErrors.push({
          entityType: "clients",
          rowIndex: index,
          columnId: "ClientName",
          message: "Client Name is required",
        });
      }
    });
  }

  if (entityType === "workers" && entityData.length > 0) {
    (entityData as WorkerData[]).forEach((worker, index) => {
      if (!worker.WorkerID) {
        cellErrors.push({
          entityType: "workers",
          rowIndex: index,
          columnId: "WorkerID",
          message: "Worker ID is required",
        });
      }
      if (!worker.WorkerName) {
        cellErrors.push({
          entityType: "workers",
          rowIndex: index,
          columnId: "WorkerName",
          message: "Worker Name is required",
        });
      }
    });
  }

  if (entityType === "tasks" && entityData.length > 0) {
    (entityData as TaskData[]).forEach((task, index) => {
      if (!task.TaskID) {
        cellErrors.push({
          entityType: "tasks",
          rowIndex: index,
          columnId: "TaskID",
          message: "Task ID is required",
        });
      }
      if (!task.TaskName) {
        cellErrors.push({
          entityType: "tasks",
          rowIndex: index,
          columnId: "TaskName",
          message: "Task Name is required",
        });
      }
    });
  }

  if (cellErrors.length > 0 || globalErrors.length > 0) {
    overallIsValid = false;
  }

  return { cellErrors, globalErrors, isValid: overallIsValid };
}
