"use client";

import DataTable from "@/components/DataTable";
import { useDataStore } from "@/store/dataStore";
import { ClientData, TaskData, WorkerData } from "@/types";
import React from "react";
import {
  FaUserFriends,
  FaUserTie,
  FaTasks,
  FaCloudUploadAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";

export default function HomePage() {
  const { errors, setClients, setWorkers, setTasks, setErrors } =
    useDataStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.size, file.type);

      const fileName = event.target.id.split("-file")[0];

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result as ArrayBuffer, {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];

          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet);

          switch (fileName) {
            case "clients":
              setClients(json as ClientData[]);
              break;
            case "workers":
              setWorkers(json as WorkerData[]);
              break;
            case "tasks":
              setTasks(json as TaskData[]);
              break;
            default:
              console.error("Invalid file name");
          }
        } catch (error: any) {
          console.error("Error while converting data to json", error?.message);
          setErrors(error?.message);
        }
      };

      reader.onerror = (e) => {
        console.error("FileReader error:", reader.error?.message);
        setErrors(reader.error?.message as string);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.log("No file selected.");
    }
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
              onChange={handleFileChange}
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
              onChange={handleFileChange}
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
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200 cursor-pointer"
            />
            <span className="text-xs text-gray-400 mt-2">CSV or XLSX</span>
          </div>
        </section>
      </div>
      {errors && (
        <div className="mt-8 flex justify-center">
          <div
            className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-xl w-full animate-fade-in"
            role="alert"
          >
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
              />
            </svg>
            <div>
              <span className="font-bold">Error:</span> {errors}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
