"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"; 
import ActionMenu from "../ui/popover/ActionMenu";

interface Organization {
  _id: string;
  name: string;
  code: string;
  adminUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationsTableProps {
  orgs: Organization[];
    // Optional callback to refresh org list after admin assigned
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({ orgs }) => {
 

  return (
    <div className="border rounded-2xl overflow-auto">
      <Table>
        {/* ✅ Table Header */}
        <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
          <TableRow>
            <TableCell isHeader className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Name
            </TableCell>
            <TableCell isHeader className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Code
            </TableCell>
            <TableCell isHeader className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Admin User
            </TableCell>
            <TableCell isHeader className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Updated At
            </TableCell>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* ✅ Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {orgs.map((org, index) => (
            <TableRow
              key={org._id}
              className={`transition-colors ${
                index % 2 === 0
                  ? "bg-white dark:bg-transparent"
                  : "bg-gray-50/50 dark:bg-white/[0.02]"
              } hover:bg-gray-100/60 dark:hover:bg-white/[0.05]`}
            >
              <TableCell className="px-5 py-4 text-gray-800 font-medium dark:text-white/90">
                {org.name}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {org.code}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {org.adminUserId ?? "_"}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {new Date(org.updatedAt || org.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-5 py-4 text-right"> 
                <ActionMenu globleId={org._id} disable={org.adminUserId} /> 
              </TableCell>
            </TableRow>
          ))}

          {/* ✅ Empty State */}
          {orgs.length === 0 && (
            <TableRow>
              <TableCell
                className="text-center py-6 text-gray-500 text-sm dark:text-gray-400"
              >
                No organizations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Assign Admin Modal */}
      
    </div>
  );
};

export default OrganizationsTable;
