"use client";

import DataTable from "@/components/DataTable";
import { useDataStore } from "@/store/dataStore";
import { ClientData, WorkerData, TaskData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import {
  FaUserFriends,
  FaUserTie,
  FaTasks,
  FaExclamationTriangle,
} from "react-icons/fa";
import React from "react";

export default function Data() {
  const {
    clients,
    workers,
    tasks,
    cellErrors,
    errors: globalErrors,
  } = useDataStore();
  const [activeTab, setActiveTab] = useState<"clients" | "workers" | "tasks">(
    "clients"
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message when data is available and there are no errors
  useEffect(() => {
    const hasData =
      clients.length > 0 || workers.length > 0 || tasks.length > 0;
    const hasErrors = globalErrors.length > 0 || cellErrors.length > 0;

    if (hasData && !hasErrors) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSuccessMessage(false);
    }
  }, [
    clients.length,
    workers.length,
    tasks.length,
    globalErrors.length,
    cellErrors.length,
  ]);

  const clientColumns = useMemo<ColumnDef<ClientData>[]>(
    () => [
      {
        accessorKey: "ClientID",
        header: "Client ID",
      },
      {
        accessorKey: "ClientName",
        header: "Client Name",
      },
      {
        accessorKey: "PriorityLevel",
        header: "Priority Level",
      },
      {
        accessorKey: "RequestedTaskIDs",
        header: "Requested Task IDs",
      },
      {
        accessorKey: "GroupTag",
        header: "Group Tag",
      },
      {
        accessorKey: "AttributesJSON",
        header: "Attributes",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="max-w-xs truncate" title={value}>
              {value}
            </div>
          );
        },
      },
    ],
    []
  );

  const workerColumns = useMemo<ColumnDef<WorkerData>[]>(
    () => [
      {
        accessorKey: "WorkerID",
        header: "Worker ID",
      },
      {
        accessorKey: "WorkerName",
        header: "Worker Name",
      },
      {
        accessorKey: "Skills",
        header: "Skills",
      },
      {
        accessorKey: "AvailableSlots",
        header: "Available Slots",
      },
      {
        accessorKey: "MaxLoadPerPhase",
        header: "Max Load Per Phase",
      },
      {
        accessorKey: "WorkerGroup",
        header: "Worker Group",
      },
      {
        accessorKey: "QualificationLevel",
        header: "Qualification Level",
      },
    ],
    []
  );

  const taskColumns = useMemo<ColumnDef<TaskData>[]>(
    () => [
      {
        accessorKey: "TaskID",
        header: "Task ID",
      },
      {
        accessorKey: "TaskName",
        header: "Task Name",
      },
      {
        accessorKey: "Category",
        header: "Category",
      },
      {
        accessorKey: "Duration",
        header: "Duration",
      },
      {
        accessorKey: "RequiredSkills",
        header: "Required Skills",
      },
      {
        accessorKey: "PreferredPhases",
        header: "Preferred Phases",
      },
      {
        accessorKey: "MaxConcurrent",
        header: "Max Concurrent",
      },
    ],
    []
  );

  // Filter cell errors by entity type for each tab
  const getFilteredCellErrors = (
    entityType: "clients" | "workers" | "tasks"
  ) => {
    return cellErrors.filter((error) => error.entityType === entityType);
  };

  // Check if there are errors for a specific entity type
  const hasEntityErrors = (entityType: "clients" | "workers" | "tasks") => {
    const hasCellErrors = getFilteredCellErrors(entityType).length > 0;
    const hasGlobalErrors = globalErrors.some((error) =>
      error.toLowerCase().includes(entityType)
    );
    return hasCellErrors || hasGlobalErrors;
  };

  const tabs = [
    {
      id: "clients" as const,
      name: "Clients",
      icon: FaUserFriends,
      count: hasEntityErrors("clients") ? 0 : clients.length,
      hasErrors: hasEntityErrors("clients"),
    },
    {
      id: "workers" as const,
      name: "Workers",
      icon: FaUserTie,
      count: hasEntityErrors("workers") ? 0 : workers.length,
      hasErrors: hasEntityErrors("workers"),
    },
    {
      id: "tasks" as const,
      name: "Tasks",
      icon: FaTasks,
      count: hasEntityErrors("tasks") ? 0 : tasks?.length || 0,
      hasErrors: hasEntityErrors("tasks"),
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const renderTableContent = () => {
    switch (activeTab) {
      case "clients":
        return clients.length > 0 ? (
          <DataTable<ClientData>
            data={clients}
            columns={clientColumns}
            cellErrors={getFilteredCellErrors("clients")}
            entityType="clients"
          />
        ) : (
          <div className="text-center py-12">
            <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No clients data available
            </h3>
            <p className="text-gray-500">
              Upload a clients file to see data here.
            </p>
          </div>
        );

      case "workers":
        return workers.length > 0 ? (
          <DataTable<WorkerData>
            data={workers}
            columns={workerColumns}
            cellErrors={getFilteredCellErrors("workers")}
            entityType="workers"
          />
        ) : (
          <div className="text-center py-12">
            <FaUserTie className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workers data available
            </h3>
            <p className="text-gray-500">
              Upload a workers file to see data here.
            </p>
          </div>
        );

      case "tasks":
        return tasks && tasks.length > 0 ? (
          <DataTable<TaskData>
            data={tasks}
            columns={taskColumns}
            cellErrors={getFilteredCellErrors("tasks")}
            entityType="tasks"
          />
        ) : (
          <div className="text-center py-12">
            <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks data available
            </h3>
            <p className="text-gray-500">
              Upload a tasks file to see data here.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-violet-700 mb-2">
            Data Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your uploaded data
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Data uploaded successfully! You can now view and manage your
                  data below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Errors Display */}
        {globalErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-500 text-xl mt-1 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Validation Errors
                </h3>
                <ul className="space-y-1">
                  {globalErrors.map((error, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                      ${
                        isActive
                          ? "border-violet-500 text-violet-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon
                      className={`text-lg ${
                        isActive ? "text-violet-500" : "text-gray-400"
                      }`}
                    />
                    <span>{tab.name}</span>
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        isActive
                          ? tab.hasErrors
                            ? "bg-red-100 text-red-800"
                            : "bg-violet-100 text-violet-800"
                          : tab.hasErrors
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
                    >
                      {tab.count}
                      {tab.hasErrors && (
                        <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTabData && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <activeTabData.icon className="text-2xl text-violet-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTabData.name} Data
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activeTabData.count} {activeTabData.name.toLowerCase()}{" "}
                    found
                    {activeTabData.hasErrors && (
                      <span className="text-red-600 ml-2">
                        (with validation errors)
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {renderTableContent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
