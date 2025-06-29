"use client";

import DataTable from "@/components/DataTable";
import { useDataStore } from "@/store/dataStore";
import { ClientData, TaskData, WorkerData } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaUserFriends,
  FaUserTie,
  FaTasks,
  FaCloudUploadAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { validateAllData, validateEntityData } from "./utils/validation";

export default function HomePage() {
  const clients = useDataStore((state) => state.clients);
  const workers = useDataStore((state) => state.workers);
  const tasks = useDataStore((state) => state.tasks);

  const setClients = useDataStore((state) => state.setClients);
  const setWorkers = useDataStore((state) => state.setWorkers);
  const setTasks = useDataStore((state) => state.setTasks);

  const clearClients = useDataStore((state) => state.clearClients);
  const clearWorkers = useDataStore((state) => state.clearWorkers);
  const clearTasks = useDataStore((state) => state.clearTasks);

  const setErrors = useDataStore((state) => state.setErrors);
  const setCellErrors = useDataStore((state) => state.setCellErrors);
  const clearErrors = useDataStore((state) => state.clearErrors);
  const clearCellErrors = useDataStore((state) => state.clearCellErrors);

  const router = useRouter();

  const [parsingErrors, setParsingErrors] = useState<string[]>([]);

  const globalValidationErrors = useDataStore((state) => state.errors);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    dataType: "clients" | "workers" | "tasks"
  ) => {
    setParsingErrors([]);
    clearErrors();
    clearCellErrors();

    const file = event.target.files?.[0];
    if (!file) {
      router.push("/data");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Run validation with the uploaded data first
        const validationResult = validateEntityData(json, dataType);

        // Only store the data if validation passes
        if (validationResult.isValid) {
          // Update only the appropriate dataset
          switch (dataType) {
            case "clients":
              setClients(json as ClientData[]);
              break;
            case "workers":
              setWorkers(json as WorkerData[]);
              break;
            case "tasks":
              setTasks(json as TaskData[]);
              break;
          }
        } else {
          // Clear the specific dataset if validation fails
          switch (dataType) {
            case "clients":
              clearClients();
              break;
            case "workers":
              clearWorkers();
              break;
            case "tasks":
              clearTasks();
              break;
          }
        }

        // Set errors regardless of validation result
        setErrors(validationResult.globalErrors);
        setCellErrors(validationResult.cellErrors);

        // Navigate to data page regardless of validation result
        router.push("/data");
      } catch (error: any) {
        const errorMessage = error?.message || "Unknown parsing error";
        setParsingErrors((prev) => [
          ...prev,
          `Error processing ${dataType} file: ${errorMessage}`,
        ]);

        setErrors([`Error processing ${dataType} file: ${errorMessage}`]);

        // Clear only the specific dataset that failed
        switch (dataType) {
          case "clients":
            clearClients();
            break;
          case "workers":
            clearWorkers();
            break;
          case "tasks":
            clearTasks();
            break;
        }
        setCellErrors([]);
        console.error(`Error processing ${dataType} file:`, error);
        router.push("/data");
      }
    };

    reader.onerror = (e) => {
      const errorMessage = reader.error?.message || "Unknown file read error";
      setParsingErrors((prev) => [
        ...prev,
        `File read error for ${dataType} file: ${errorMessage}`,
      ]);
      setErrors([`File read error for ${dataType} file: ${errorMessage}`]);
      setCellErrors([]);
      console.error(`FileReader error for ${dataType} file:`, reader.error);
      router.push("/data");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-blue-50 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">
        <div className="flex flex-col items-center mb-10">
          <FaCloudUploadAlt className="text-violet-600 text-6xl mb-2 animate-bounce" />
          <h1 className="text-5xl font-extrabold mb-2 text-center text-violet-700 drop-shadow">
            Tidyops
          </h1>
          <p className="text-lg text-gray-500 text-center">
            Upload your data files to get started
          </p>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-violet-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <FaUserFriends className="text-3xl text-violet-500 mb-3" />
            <label
              htmlFor="clients-file"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Clients Data
            </label>
            <input
              type="file"
              id="clients-file"
              accept=".csv, .xlsx"
              onChange={(e) => handleFileUpload(e, "clients")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200 cursor-pointer"
            />
            <span className="text-xs text-gray-400 mt-2">CSV or XLSX</span>
          </div>
          <div className="flex flex-col items-center bg-violet-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <FaUserTie className="text-3xl text-violet-500 mb-3" />
            <label
              htmlFor="workers-file"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Workers Data
            </label>
            <input
              type="file"
              id="workers-file"
              accept=".csv, .xlsx"
              onChange={(e) => handleFileUpload(e, "workers")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200 cursor-pointer"
            />
            <span className="text-xs text-gray-400 mt-2">CSV or XLSX</span>
          </div>
          <div className="flex flex-col items-center bg-violet-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <FaTasks className="text-3xl text-violet-500 mb-3" />
            <label
              htmlFor="tasks-file"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Tasks Data
            </label>
            <input
              type="file"
              id="tasks-file"
              accept=".csv, .xlsx"
              onChange={(e) => handleFileUpload(e, "tasks")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200 cursor-pointer"
            />
            <span className="text-xs text-gray-400 mt-2">CSV or XLSX</span>
          </div>
        </section>
      </div>
    </div>
  );
}
