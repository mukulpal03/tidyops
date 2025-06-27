"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowData,
  TableMeta,
} from "@tanstack/react-table";

interface EditableColumnMeta {
  editable?: boolean;
}

interface DataTableProps<T extends RowData> {
  data: T[];
  columns: ColumnDef<T, any>[];
  onDataUpdate?: (data: T[]) => void;
}

export default function DataTable<T extends RowData>({
  data,
  columns,
  onDataUpdate,
}: DataTableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);

  const table = useReactTable<T>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setTableData((old) => {
          const newData = old.map((row, idx) => {
            if (idx === rowIndex && typeof row === "object" && row !== null) {
              return { ...row, [columnId]: value };
            }
            return row;
          });
          onDataUpdate?.(newData);
          return newData;
        });
      },
    } as TableMeta<T>,
    getRowId: (row, index) => (row as any).id ?? index.toString(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-violet-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-violet-700 border-b"
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-violet-50">
              {row.getVisibleCells().map((cell) => {
                const editable = (
                  cell.column.columnDef.meta as EditableColumnMeta
                )?.editable;
                return (
                  <td key={cell.id} className="px-4 py-2 border-b text-sm">
                    {editable ? (
                      <input
                        className="w-full bg-transparent border-b border-violet-200 focus:outline-none focus:border-violet-500"
                        value={cell.getValue() as string}
                        onChange={(e) =>
                          (table.options.meta as any)?.updateData(
                            row.index,
                            cell.column.id,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
