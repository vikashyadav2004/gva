"use client"
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Pencil, Trash2 } from "lucide-react"; 
import { Modal } from "@/components/ui/modal";
import CreateOrganizations from "@/components/CustomeForms/CreateOrganizations";

interface Organization {
    id: number;
    name: string;
    totalUsers: number;
    totalProtections: number;
}

const OrganizationPage = () => {
    const [open,setopen] =useState(false)
    const organizations: Organization[] = [
        { id: 1, name: "AutoCorp GmbH", totalUsers: 24, totalProtections: 12 },
        { id: 2, name: "DriveTech Innovations", totalUsers: 15, totalProtections: 8 },
        { id: 3, name: "SpeedMotors AG", totalUsers: 40, totalProtections: 23 },
        { id: 4, name: "TorqueWorks", totalUsers: 9, totalProtections: 3 },
        { id: 5, name: "MotionX Industries", totalUsers: 32, totalProtections: 14 },
    ];

    return (
        <>
        <div className="p-6">
            <div className="flex justify-between gap-x-3 flex-wrap gap-y-5 items-center mb-8">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Organizations
                </h1>
                <div className="">
                    <Button onClick={()=>{setopen(true)}} className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                       <span className="text-white"><Building2/></span> Add Organizations
                    </Button>
                </div>
            </div>
            <div className="border rounded-2xl overflow-auto">
                <Table>
                    {/* ✅ Table Header */}
                    <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
                        <TableRow>
                            <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                Organization
                            </TableCell>
                            <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                Total Users
                            </TableCell>
                            <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                Total Protections
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-sm text-gray-600 text-right dark:text-gray-400">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* ✅ Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {organizations.map((org, idx) => (
                            <TableRow
                                key={org.id}
                                className={`transition-colors ${idx % 2 === 0
                                        ? "bg-white dark:bg-transparent"
                                        : "bg-gray-50/50 dark:bg-white/[0.02]"
                                    } hover:bg-gray-100/60 dark:hover:bg-white/[0.05]`}
                            >
                                <TableCell className="px-5 py-4 text-gray-800 font-medium dark:text-white/90">
                                    {org.name}
                                </TableCell>

                                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {org.totalUsers}
                                </TableCell>

                                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {org.totalProtections}
                                </TableCell>

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
                        {organizations.length === 0 && (
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
            </div>
        </div>

<Modal onClose={()=>{setopen(false)}} isOpen={open} className="lg:min-w-[700px]">
    <CreateOrganizations  onClose={()=>{setopen(false)}}/>
</Modal>
        </>
    );
};

export default OrganizationPage;
