"use client";

import React, { useState } from "react";
import { useDataStore } from "@/store/dataStore";
import { ExportConfig } from "@/types";
import {
  FaDownload,
  FaFileCsv,
  FaFileCode,
  FaCheckCircle,
} from "react-icons/fa";

export default function ExportPanel() {
  const { clients, workers, tasks, businessRules, prioritizationWeights } =
    useDataStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that need quotes
            if (
              typeof value === "string" &&
              (value.includes(",") ||
                value.includes('"') ||
                value.includes("\n"))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Export CSV files
      if (clients.length > 0) {
        downloadCSV(clients, "clients_cleaned.csv");
      }
      if (workers.length > 0) {
        downloadCSV(workers, "workers_cleaned.csv");
      }
      if (tasks.length > 0) {
        downloadCSV(tasks, "tasks_cleaned.csv");
      }

      // Export rules and configuration
      const exportConfig: ExportConfig = {
        clients,
        workers,
        tasks,
        rules: businessRules,
        weights: prioritizationWeights,
      };

      downloadJSON(exportConfig, "rules_config.json");

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getValidationStatus = () => {
    const hasData =
      clients.length > 0 || workers.length > 0 || tasks.length > 0;
    const hasRules = businessRules.length > 0;

    if (!hasData) {
      return { status: "error", message: "No data to export" };
    }

    return { status: "success", message: "Ready to export" };
  };

  const validationStatus = getValidationStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Export Configuration
        </h2>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            validationStatus.status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {validationStatus.status === "success" ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaCheckCircle className="text-red-600" />
          )}
          <span>{validationStatus.message}</span>
        </div>
      </div>

      {/* Export Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Export Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Data Files
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Clients:</span>
                <span className="font-medium">{clients.length} records</span>
              </div>
              <div className="flex justify-between">
                <span>Workers:</span>
                <span className="font-medium">{workers.length} records</span>
              </div>
              <div className="flex justify-between">
                <span>Tasks:</span>
                <span className="font-medium">{tasks.length} records</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Configuration
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Business Rules:</span>
                <span className="font-medium">
                  {businessRules.length} rules
                </span>
              </div>
              <div className="flex justify-between">
                <span>Prioritization:</span>
                <span className="font-medium">Configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FaFileCsv className="text-green-600 text-lg" />
              <h4 className="font-medium text-gray-900">CSV Files</h4>
            </div>
            <p className="text-sm text-gray-600">
              Download cleaned and validated data as CSV files for each entity
              type.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FaFileCode className="text-blue-600 text-lg" />
              <h4 className="font-medium text-gray-900">Rules Config</h4>
            </div>
            <p className="text-sm text-gray-600">
              Download business rules and prioritization settings as JSON
              configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {exportSuccess && (
            <div className="flex items-center space-x-2 text-green-600">
              <FaCheckCircle />
              <span>Export completed successfully!</span>
            </div>
          )}
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || validationStatus.status === "error"}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isExporting || validationStatus.status === "error"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          <FaDownload className="text-sm" />
          <span>{isExporting ? "Exporting..." : "Export All"}</span>
        </button>
      </div>

      {/* Export Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Export Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • CSV files contain cleaned and validated data ready for processing
          </li>
          <li>
            • Rules config includes all business rules and prioritization
            weights
          </li>
          <li>
            • Use these files with your downstream resource allocation tools
          </li>
          <li>• All validation errors have been resolved before export</li>
        </ul>
      </div>
    </div>
  );
}
