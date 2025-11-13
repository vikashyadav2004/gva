"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ActionMenu from "@/components/ui/popover/ActionMenu";

interface RightHolder {
  _id: string;
  name: string;
  organizationId: { _id: string; name: string };
  createdByUserId: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export default function RightHolderTable({ data }: { data: RightHolder[] }) {
  console.log(data,"right holder data")
  return (
    <>
    {
      data.length!==0?<div className="border rounded-2xl overflow-auto min-h-[500px]">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableCell isHeader className="px-5 text-start py-3">Name</TableCell>
            <TableCell isHeader className="px-5 text-start py-3">Organization</TableCell>
            <TableCell isHeader className="px-5 text-start py-3">Created By</TableCell>
            <TableCell isHeader className="px-5 text-start py-3">Updated At</TableCell>
            <TableCell isHeader className="px-5 py-3 text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((rh, index) => (
            <TableRow
              key={rh._id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50 dark:bg-gray-900"}
            >
              <TableCell className="px-5 py-4">{rh.name}</TableCell>
              <TableCell className="px-5 py-4">{rh.organizationId?.name}</TableCell>
              <TableCell className="px-5 py-4">{rh.createdByUserId?.name}</TableCell>
              <TableCell className="px-5 py-4">
                {new Date(rh.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <ActionMenu type="RIGHTHOLDER"  data={rh} disable={rh._id} />
              </TableCell>
            </TableRow>
          ))}

         
        </TableBody>
      </Table>
    </div>:<>
              <p className="text-center py-4 bg-white rounded-xl">
                No Right Holders Found
              </p>
            </>
    }
    
    
    </>
  );
}
