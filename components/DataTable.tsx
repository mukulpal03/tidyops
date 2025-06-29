"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowData,
} from "@tanstack/react-table";
import { CellError } from "@/types";

interface DataTableProps<T extends RowData> {
  data: T[];
  columns: ColumnDef<T, any>[];
  cellErrors?: CellError[];
  entityType?: "clients" | "workers" | "tasks";
}

export default function DataTable<T extends RowData>({
  data,
  columns,
  cellErrors = [],
  entityType,
}: DataTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getCellError = (
    rowIndex: number,
    columnId: string
  ): CellError | undefined => {
    return cellErrors.find(
      (error) => error.rowIndex === rowIndex && error.columnId === columnId
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => {
            const rowErrors = cellErrors.filter(
              (error) => error.rowIndex === row.index
            );
            const hasRowError = rowErrors.length > 0;

            return (
              <tr
                key={row.id}
                className={`transition-colors duration-150 ${
                  hasRowError
                    ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-400"
                    : "hover:bg-violet-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellError = getCellError(row.index, cell.column.id);

                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm group relative ${
                        cellError
                          ? "bg-red-100 border border-red-300"
                          : "text-gray-900"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {cellError && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                      )}
                      {cellError && (
                        <div className="absolute z-10 top-full left-0 mt-1 px-2 py-1 bg-red-600 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          {cellError.message}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No data available. Upload a file to see data here.
          </p>
        </div>
      )}

      {cellErrors.length > 0 && entityType && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Validation Errors in{" "}
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {cellErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>
                  Row {error.rowIndex + 1}, {error.columnId}: {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
