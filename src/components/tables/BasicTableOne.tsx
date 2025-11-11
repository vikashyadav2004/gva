"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";

interface Protection {
  id: number;
  manufacturer: string;
  protectionType: string;
  regReference?: string;
  externalLink?: string;
  designation?: string;
  oePartNo?: string;
}

export default function BasicTableOne({ data }: { data: Protection[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* ✅ Table Header with Styling */}
            <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  Manufacturer
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  Protection Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  Reg Reference
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  External Link
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  Designation
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  OE Part No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400 text-right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* ✅ Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-transparent"
                      : "bg-gray-50/50 dark:bg-white/[0.02]"
                  } hover:bg-gray-100/60 dark:hover:bg-white/[0.05]`}
                >
                  <TableCell className="px-5 py-4 text-gray-800 font-medium dark:text-white/90">
                    {item.manufacturer}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.protectionType}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.regReference || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.externalLink || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.designation || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.oePartNo || "-"}
                  </TableCell>

                  {/* ✅ Action Buttons Styled */}
                  <TableCell className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        className="h-8 w-8 border-gray-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-white/[0.06]"
                      >
                        <Pencil size={14} className="text-gray-600" />
                      </Button>
                      <Button  
                        variant="outline"
                        className="h-8 w-8 border-gray-200 hover:border-red-500 hover:bg-red-50 dark:hover:bg-white/[0.06]"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* ✅ Empty State */}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    className="text-center py-6 text-gray-500 text-sm dark:text-gray-400"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
