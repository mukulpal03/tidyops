import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";
import { ClientData, WorkerData, TaskData, AiFilter } from "@/types";

const DATA_SCHEMAS = {
  clients: {
    name: "ClientData",
    description: "Represents client information.",
    columns: [
      {
        name: "ClientID",
        type: "string",
        description: "Unique identifier for the client.",
      },
      {
        name: "ClientName",
        type: "string",
        description: "Name of the client.",
      },
      {
        name: "PriorityLevel",
        type: "number",
        description: "Importance level (1-5, where 5 is highest).",
      },
      {
        name: "RequestedTaskIDs",
        type: "string",
        description: "Comma-separated list of TaskIDs requested.",
      },
      {
        name: "GroupTag",
        type: "string",
        description: "Tag for client grouping.",
      },
      {
        name: "AttributesJSON",
        type: "string",
        description: "JSON string of arbitrary attributes.",
      },
    ],
  },
  workers: {
    name: "WorkerData",
    description: "Represents worker information and capabilities.",
    columns: [
      {
        name: "WorkerID",
        type: "string",
        description: "Unique identifier for the worker.",
      },
      {
        name: "WorkerName",
        type: "string",
        description: "Name of the worker.",
      },
      {
        name: "Skills",
        type: "string",
        description: "Comma-separated list of skills.",
      },
      {
        name: "AvailableSlots",
        type: "string",
        description:
          "Comma-separated list of available phase numbers (e.g., '1,3,5').",
      },
      {
        name: "MaxLoadPerPhase",
        type: "number",
        description: "Maximum tasks worker can handle per phase.",
      },
      {
        name: "WorkerGroup",
        type: "string",
        description: "Tag for worker grouping.",
      },
      {
        name: "QualificationLevel",
        type: "string",
        description: "Worker's qualification level.",
      },
    ],
  },
  tasks: {
    name: "TaskData",
    description: "Defines a unit of work.",
    columns: [
      {
        name: "TaskID",
        type: "string",
        description: "Unique identifier for the task.",
      },
      { name: "TaskName", type: "string", description: "Name of the task." },
      {
        name: "Category",
        type: "string",
        description: "Category of the task.",
      },
      {
        name: "Duration",
        type: "number",
        description: "Duration in phases (>=1).",
      },
      {
        name: "RequiredSkills",
        type: "string",
        description: "Comma-separated list of required skills.",
      },
      {
        name: "PreferredPhases",
        type: "string",
        description:
          "List or range of preferred phases (e.g., '1-3' or '2,4,5').",
      },
      {
        name: "MaxConcurrent",
        type: "number",
        description: "Maximum parallel assignments for this task.",
      },
    ],
  },
};

const FILTER_JSON_SCHEMA = {
  type: "object",
  properties: {
    entityType: {
      type: "string",
      enum: ["clients", "workers", "tasks"],
      description: "The type of data entity to filter.",
    },
    conditions: {
      type: "array",
      description: "An array of filter conditions.",
      items: {
        type: "object",
        properties: {
          column: {
            type: "string",
            description:
              "The column name to filter on. Must exist in the entity's schema.",
          },
          operator: {
            type: "string",
            enum: [
              "equals",
              "not_equals",
              "greater_than",
              "less_than",
              "greater_than_or_equals",
              "less_than_or_equals",
              "contains",
              "not_contains",
              "starts_with",
              "ends_with",
              "is_empty",
              "is_not_empty",
            ],
            description: "The comparison operator.",
          },
          value: {
            type: ["string", "number", "boolean", "array"],
            description:
              "The value to compare against. Use array for 'in' operator.",
          },
          logicalOperator: {
            type: "string",
            enum: ["AND", "OR"],
            default: "AND",
            description:
              "Logical operator to combine with the next condition (if any). Defaults to AND.",
          },
        },
        required: ["column", "operator", "value"],
      },
    },
    logicalOperator: {
      type: "string",
      enum: ["AND", "OR"],
      default: "AND",
      description:
        "Logical operator to combine the conditions. Defaults to AND.",
    },
  },
  required: ["entityType", "conditions"],
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    console.log("AI Query received:", prompt);

    const aiFilter = parseNaturalLanguageToFilter(prompt);

    console.log("Parsed filter:", aiFilter);

    if (!aiFilter) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not understand the query. Please try rephrasing.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      aiFilter,
    });
  } catch (error) {
    console.error("AI Query API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function parseNaturalLanguageToFilter(prompt: string): AiFilter | null {
  const lowerPrompt = prompt.toLowerCase();

  // Determine entity type
  let entityType: "clients" | "workers" | "tasks" | null = null;
  if (lowerPrompt.includes("client")) {
    entityType = "clients";
  } else if (lowerPrompt.includes("worker")) {
    entityType = "workers";
  } else if (lowerPrompt.includes("task")) {
    entityType = "tasks";
  }

  if (!entityType) {
    return null;
  }

  const conditions: Array<{
    column: string;
    operator: string;
    value: any;
    logicalOperator?: "AND" | "OR";
  }> = [];

  // Handle "show all" or "list all" queries
  if (
    lowerPrompt.includes("all") ||
    lowerPrompt.includes("show") ||
    lowerPrompt.includes("list")
  ) {
    return {
      entityType,
      conditions: [],
      logicalOperator: "AND",
    };
  }

  // Parse priority level
  if (lowerPrompt.includes("priority")) {
    const priorityMatch = lowerPrompt.match(/priority\s+(?:level\s+)?(\d+)/);
    if (priorityMatch && entityType === "clients") {
      conditions.push({
        column: "PriorityLevel",
        operator: "equals",
        value: parseInt(priorityMatch[1]),
      });
    }
  }

  
  if (lowerPrompt.includes("duration")) {
    if (
      lowerPrompt.includes("more than") ||
      lowerPrompt.includes("greater than")
    ) {
      const match = lowerPrompt.match(/(\d+)/);
      if (match && entityType === "tasks") {
        conditions.push({
          column: "Duration",
          operator: "greater_than",
          value: parseInt(match[1]),
        });
      }
    } else {
      const match = lowerPrompt.match(/(\d+)/);
      if (match && entityType === "tasks") {
        conditions.push({
          column: "Duration",
          operator: "equals",
          value: parseInt(match[1]),
        });
      }
    }
  }

  if (lowerPrompt.includes("skill")) {
    const skillsMatch = lowerPrompt.match(
      /skill[s]?\s+(?:with|containing)\s+([a-zA-Z\s]+)/
    );
    if (skillsMatch && (entityType === "workers" || entityType === "tasks")) {
      const column = entityType === "workers" ? "Skills" : "RequiredSkills";
      conditions.push({
        column,
        operator: "contains",
        value: skillsMatch[1].trim(),
      });
    }
  }

  if (lowerPrompt.includes("concurrent")) {
    const match = lowerPrompt.match(/(\d+)/);
    if (match && entityType === "tasks") {
      conditions.push({
        column: "MaxConcurrent",
        operator: "greater_than",
        value: parseInt(match[1]),
      });
    }
  }

  if (lowerPrompt.includes("qualification")) {
    const qualMatch = lowerPrompt.match(
      /qualification\s+(?:level\s+)?([a-zA-Z\s]+)/
    );
    if (qualMatch && entityType === "workers") {
      conditions.push({
        column: "QualificationLevel",
        operator: "contains",
        value: qualMatch[1].trim(),
      });
    }
  }

  if (lowerPrompt.includes("name")) {
    if (lowerPrompt.includes("starting with")) {
      const match = lowerPrompt.match(/starting with\s+([a-zA-Z])/);
      if (match) {
        const column =
          entityType === "clients"
            ? "ClientName"
            : entityType === "workers"
            ? "WorkerName"
            : "TaskName";
        conditions.push({
          column,
          operator: "starts_with",
          value: match[1],
        });
      }
    } else {
      const match = lowerPrompt.match(
        /name\s+(?:containing|with)\s+([a-zA-Z\s]+)/
      );
      if (match) {
        const column =
          entityType === "clients"
            ? "ClientName"
            : entityType === "workers"
            ? "WorkerName"
            : "TaskName";
        conditions.push({
          column,
          operator: "contains",
          value: match[1].trim(),
        });
      }
    }
  }

  if (lowerPrompt.includes("category") && entityType === "tasks") {
    const match = lowerPrompt.match(
      /category\s+(?:is|containing)\s+([a-zA-Z\s]+)/
    );
    if (match) {
      conditions.push({
        column: "Category",
        operator: "contains",
        value: match[1].trim(),
      });
    }
  }

  if (conditions.length === 0) {
    return {
      entityType,
      conditions: [],
      logicalOperator: "AND",
    };
  }

  return {
    entityType,
    conditions,
    logicalOperator: "AND",
  };
}
