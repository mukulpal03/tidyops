"use client";

import DataTable from "@/components/DataTable";
import { useDataStore } from "@/store/dataStore";
import { ClientData, WorkerData, TaskData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaUserFriends, FaUserTie, FaTasks } from "react-icons/fa";

export default function Data() {
  const { clients, workers, tasks } = useDataStore();
  const [activeTab, setActiveTab] = useState<"clients" | "workers" | "tasks">(
    "clients"
  );

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

  const tabs = [
    {
      id: "clients" as const,
      name: "Clients",
      icon: FaUserFriends,
      count: clients.length,
    },
    {
      id: "workers" as const,
      name: "Workers",
      icon: FaUserTie,
      count: workers.length,
    },
    {
      id: "tasks" as const,
      name: "Tasks",
      icon: FaTasks,
      count: tasks?.length || 0,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const renderTableContent = () => {
    switch (activeTab) {
      case "clients":
        return clients.length > 0 ? (
          <DataTable<ClientData> data={clients} columns={clientColumns} />
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
          <DataTable<WorkerData> data={workers} columns={workerColumns} />
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
          <DataTable<TaskData> data={tasks} columns={taskColumns} />
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
                          ? "bg-violet-100 text-violet-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
                    >
                      {tab.count}
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
