"use client";

import React, { useState, useEffect } from "react";
import { useDataStore } from "@/store/dataStore";
import DataTable from "@/components/DataTable";
import { validateAllData } from "@/app/utils/validation";
import { ClientData, WorkerData, TaskData } from "@/types";
import BusinessRulesPanel from "@/components/BusinessRulesPanel";
import PrioritizationPanel from "@/components/PrioritizationPanel";
import ExportPanel from "@/components/ExportPanel";
import {
  FaUsers,
  FaUserTie,
  FaTasks,
  FaCog,
  FaChartBar,
  FaDownload,
} from "react-icons/fa";

export default function DataPage() {
  const {
    clients,
    workers,
    tasks,
    errors,
    cellErrors,
    setClients,
    setWorkers,
    setTasks,
    setErrors,
    setCellErrors,
    clearErrors,
    clearCellErrors,
    updateClientCell,
    updateWorkerCell,
    updateTaskCell,
    businessRules,
  } = useDataStore();

  const [activeTab, setActiveTab] = useState<
    "data" | "rules" | "priorities" | "export"
  >("data");
  const [validationResult, setValidationResult] = useState<{
    cellErrors: any[];
    globalErrors: string[];
    isValid: boolean;
  }>({ cellErrors: [], globalErrors: [], isValid: true });

  // Run validation whenever data changes
  useEffect(() => {
    if (clients.length > 0 || workers.length > 0 || tasks.length > 0) {
      const result = validateAllData(clients, workers, tasks);
      setValidationResult(result);
      setCellErrors(result.cellErrors);
      setErrors(result.globalErrors);
    } else {
      setValidationResult({ cellErrors: [], globalErrors: [], isValid: true });
      setCellErrors([]);
      setErrors([]);
    }
  }, [clients, workers, tasks, setCellErrors, setErrors]);

  const handleCellUpdate = (
    entityType: "clients" | "workers" | "tasks",
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    switch (entityType) {
      case "clients":
        updateClientCell(rowIndex, columnId, value);
        break;
      case "workers":
        updateWorkerCell(rowIndex, columnId, value);
        break;
      case "tasks":
        updateTaskCell(rowIndex, columnId, value);
        break;
    }
  };

  const getClientColumns = () => [
    { accessorKey: "ClientID", header: "Client ID" },
    { accessorKey: "ClientName", header: "Client Name" },
    { accessorKey: "PriorityLevel", header: "Priority Level" },
    { accessorKey: "RequestedTaskIDs", header: "Requested Task IDs" },
    { accessorKey: "GroupTag", header: "Group Tag" },
    { accessorKey: "AttributesJSON", header: "Attributes JSON" },
  ];

  const getWorkerColumns = () => [
    { accessorKey: "WorkerID", header: "Worker ID" },
    { accessorKey: "WorkerName", header: "Worker Name" },
    { accessorKey: "Skills", header: "Skills" },
    { accessorKey: "AvailableSlots", header: "Available Slots" },
    { accessorKey: "MaxLoadPerPhase", header: "Max Load Per Phase" },
    { accessorKey: "WorkerGroup", header: "Worker Group" },
    { accessorKey: "QualificationLevel", header: "Qualification Level" },
  ];

  const getTaskColumns = () => [
    { accessorKey: "TaskID", header: "Task ID" },
    { accessorKey: "TaskName", header: "Task Name" },
    { accessorKey: "Category", header: "Category" },
    { accessorKey: "Duration", header: "Duration" },
    { accessorKey: "RequiredSkills", header: "Required Skills" },
    { accessorKey: "PreferredPhases", header: "Preferred Phases" },
    { accessorKey: "MaxConcurrent", header: "Max Concurrent" },
  ];

  const tabs = [
    {
      id: "data" as const,
      name: "Data Management",
      icon: FaUsers,
      count: clients.length + workers.length + tasks.length,
    },
    {
      id: "rules" as const,
      name: "Business Rules",
      icon: FaCog,
      count: businessRules.length,
    },
    {
      id: "priorities" as const,
      name: "Prioritization",
      icon: FaChartBar,
      count: 0,
    },
    {
      id: "export" as const,
      name: "Export",
      icon: FaDownload,
      count: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Alchemist - Resource Allocation Configurator
          </h1>
          <p className="text-gray-600">
            Upload, validate, and configure your resource allocation data with
            AI-powered insights.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-violet-100 text-violet-700 border border-violet-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "data" && (
            <div className="space-y-6">
              {/* Global Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Global Validation Errors:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clients */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaUsers className="text-violet-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Clients
                        </h2>
                      </div>
                      <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
                        {clients.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <DataTable
                      data={clients}
                      columns={getClientColumns()}
                      cellErrors={cellErrors.filter(
                        (error) => error.entityType === "clients"
                      )}
                      entityType="clients"
                      editable={true}
                      onCellUpdate={(rowIndex, columnId, value) =>
                        handleCellUpdate("clients", rowIndex, columnId, value)
                      }
                    />
                  </div>
                </div>

                {/* Workers */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaUserTie className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Workers
                        </h2>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {workers.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <DataTable
                      data={workers}
                      columns={getWorkerColumns()}
                      cellErrors={cellErrors.filter(
                        (error) => error.entityType === "workers"
                      )}
                      entityType="workers"
                      editable={true}
                      onCellUpdate={(rowIndex, columnId, value) =>
                        handleCellUpdate("workers", rowIndex, columnId, value)
                      }
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaTasks className="text-green-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Tasks
                        </h2>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {tasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <DataTable
                      data={tasks}
                      columns={getTaskColumns()}
                      cellErrors={cellErrors.filter(
                        (error) => error.entityType === "tasks"
                      )}
                      entityType="tasks"
                      editable={true}
                      onCellUpdate={(rowIndex, columnId, value) =>
                        handleCellUpdate("tasks", rowIndex, columnId, value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              {validationResult.cellErrors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    Validation Summary:
                  </h3>
                  <div className="text-sm text-yellow-700">
                    <p>
                      Found {validationResult.cellErrors.length} validation
                      errors across{" "}
                      {
                        new Set(
                          validationResult.cellErrors.map((e) => e.entityType)
                        ).size
                      }{" "}
                      entity types.
                    </p>
                    <p className="mt-1">
                      Fix the highlighted errors in the tables above to proceed
                      with export.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "rules" && (
            <BusinessRulesPanel
              clients={clients}
              workers={workers}
              tasks={tasks}
            />
          )}

          {activeTab === "priorities" && <PrioritizationPanel />}

          {activeTab === "export" && <ExportPanel />}
        </div>
      </div>
    </div>
  );
}
