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

  // 1. Missing required columns validation
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

  checkMissingColumns(clients, "clients");
  checkMissingColumns(workers, "workers");
  checkMissingColumns(tasks, "tasks");

  // 2. Duplicate IDs validation
  const checkDuplicateIDs = (
    data: any[],
    idField: string,
    entityType: "clients" | "workers" | "tasks"
  ) => {
    const ids = data.map((item) => item[idField]).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      globalErrors.push(
        `Duplicate ${idField} found in ${entityType}: ${duplicates.join(", ")}`
      );
      overallIsValid = false;
    }
  };

  checkDuplicateIDs(clients, "ClientID", "clients");
  checkDuplicateIDs(workers, "WorkerID", "workers");
  checkDuplicateIDs(tasks, "TaskID", "tasks");

  // 3. Individual entity validations
  if (clients.length > 0) {
    clients.forEach((client, index) => {
      // Required fields
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

      // Priority level validation (1-5)
      if (client.PriorityLevel !== undefined && client.PriorityLevel !== null) {
        const priority = Number(client.PriorityLevel);
        if (isNaN(priority) || priority < 1 || priority > 5) {
          cellErrors.push({
            entityType: "clients",
            rowIndex: index,
            columnId: "PriorityLevel",
            message: "Priority Level must be between 1 and 5",
          });
        }
      }

      // JSON validation
      if (client.AttributesJSON) {
        try {
          JSON.parse(client.AttributesJSON);
        } catch (error) {
          cellErrors.push({
            entityType: "clients",
            rowIndex: index,
            columnId: "AttributesJSON",
            message: "Invalid JSON format",
          });
        }
      }
    });
  }

  if (workers.length > 0) {
    workers.forEach((worker, index) => {
      // Required fields
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

      // AvailableSlots validation
      if (worker.AvailableSlots) {
        try {
          const slots = JSON.parse(worker.AvailableSlots);
          if (
            !Array.isArray(slots) ||
            !slots.every((slot) => Number.isInteger(slot) && slot > 0)
          ) {
            cellErrors.push({
              entityType: "workers",
              rowIndex: index,
              columnId: "AvailableSlots",
              message: "AvailableSlots must be an array of positive integers",
            });
          }
        } catch (error) {
          cellErrors.push({
            entityType: "workers",
            rowIndex: index,
            columnId: "AvailableSlots",
            message: "AvailableSlots must be valid JSON array",
          });
        }
      }

      // MaxLoadPerPhase validation
      if (
        worker.MaxLoadPerPhase !== undefined &&
        worker.MaxLoadPerPhase !== null
      ) {
        const load = Number(worker.MaxLoadPerPhase);
        if (isNaN(load) || load < 1) {
          cellErrors.push({
            entityType: "workers",
            rowIndex: index,
            columnId: "MaxLoadPerPhase",
            message: "Max Load Per Phase must be a positive number",
          });
        }
      }
    });
  }

  if (tasks.length > 0) {
    tasks.forEach((task, index) => {
      // Required fields
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

      // Duration validation
      if (task.Duration !== undefined && task.Duration !== null) {
        const duration = Number(task.Duration);
        if (isNaN(duration) || duration < 1) {
          cellErrors.push({
            entityType: "tasks",
            rowIndex: index,
            columnId: "Duration",
            message: "Duration must be at least 1",
          });
        }
      }

      // MaxConcurrent validation
      if (task.MaxConcurrent !== undefined && task.MaxConcurrent !== null) {
        const concurrent = Number(task.MaxConcurrent);
        if (isNaN(concurrent) || concurrent < 1) {
          cellErrors.push({
            entityType: "tasks",
            rowIndex: index,
            columnId: "MaxConcurrent",
            message: "Max Concurrent must be a positive number",
          });
        }
      }
    });
  }

  // 4. Cross-reference validations
  if (clients.length > 0 && tasks.length > 0) {
    const taskIDs = tasks.map((task) => task.TaskID);

    clients.forEach((client, index) => {
      if (client.RequestedTaskIDs) {
        const requestedTasks = client.RequestedTaskIDs.split(",").map((id) =>
          id.trim()
        );
        const invalidTasks = requestedTasks.filter(
          (taskId) => !taskIDs.includes(taskId)
        );

        if (invalidTasks.length > 0) {
          cellErrors.push({
            entityType: "clients",
            rowIndex: index,
            columnId: "RequestedTaskIDs",
            message: `Invalid task IDs: ${invalidTasks.join(", ")}`,
          });
        }
      }
    });
  }

  // 5. Skill coverage validation
  if (workers.length > 0 && tasks.length > 0) {
    const allWorkerSkills = new Set<string>();
    workers.forEach((worker) => {
      if (worker.Skills) {
        worker.Skills.split(",").forEach((skill) => {
          allWorkerSkills.add(skill.trim().toLowerCase());
        });
      }
    });

    tasks.forEach((task, index) => {
      if (task.RequiredSkills) {
        const requiredSkills = task.RequiredSkills.split(",").map((skill) =>
          skill.trim().toLowerCase()
        );
        const missingSkills = requiredSkills.filter(
          (skill) => !allWorkerSkills.has(skill)
        );

        if (missingSkills.length > 0) {
          cellErrors.push({
            entityType: "tasks",
            rowIndex: index,
            columnId: "RequiredSkills",
            message: `No workers available with skills: ${missingSkills.join(
              ", "
            )}`,
          });
        }
      }
    });
  }

  // 6. Worker overload validation
  workers.forEach((worker, index) => {
    if (worker.AvailableSlots && worker.MaxLoadPerPhase) {
      try {
        const slots = JSON.parse(worker.AvailableSlots);
        const maxLoad = Number(worker.MaxLoadPerPhase);

        if (Array.isArray(slots) && slots.length < maxLoad) {
          cellErrors.push({
            entityType: "workers",
            rowIndex: index,
            columnId: "MaxLoadPerPhase",
            message: `Max load (${maxLoad}) exceeds available slots (${slots.length})`,
          });
        }
      } catch (error) {
        // Already handled in individual validation
      }
    }
  });

  if (cellErrors.length > 0 || globalErrors.length > 0) {
    overallIsValid = false;
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
