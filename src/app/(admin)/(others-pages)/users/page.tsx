"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import Select from "@/components/form/Select";
import { PlusIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import CreateUsers from "@/components/CustomeForms/CreateUsers";
// 👈 your reusable Select component

interface Organization {
    id: number;
    name: string;
    totalUsers: number;
    totalProtections: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    organizationId: number;
    createdAt: string;
}

const OrganizationUsersPage = () => {
    const [isOpen,setisOpen] =useState(false)
    // 🧩 Organization Data
    const organizations: Organization[] = [
        { id: 1, name: "AutoCorp GmbH", totalUsers: 24, totalProtections: 12 },
        { id: 2, name: "DriveTech Innovations", totalUsers: 15, totalProtections: 8 },
        { id: 3, name: "SpeedMotors AG", totalUsers: 40, totalProtections: 23 },
        { id: 4, name: "TorqueWorks", totalUsers: 9, totalProtections: 3 },
        { id: 5, name: "MotionX Industries", totalUsers: 32, totalProtections: 14 },
    ];

    // 👥 Dummy User Data
    const users: User[] = [
        { id: 1, name: "Alice Johnson", email: "alice@autocorp.com", organizationId: 1, createdAt: "2024-02-01" },
        { id: 2, name: "Bob Smith", email: "bob@autocorp.com", organizationId: 1, createdAt: "2024-04-10" },
        { id: 3, name: "Carol White", email: "carol@drivetech.com", organizationId: 2, createdAt: "2024-06-18" },
        { id: 4, name: "Daniel Green", email: "daniel@speedmotors.com", organizationId: 3, createdAt: "2023-09-25" },
        { id: 5, name: "Eva Black", email: "eva@motionx.com", organizationId: 5, createdAt: "2025-01-14" },
        { id: 6, name: "Frank Blue", email: "frank@torqueworks.com", organizationId: 4, createdAt: "2023-11-09" },
        { id: 7, name: "Grace Lee", email: "grace@drivetech.com", organizationId: 2, createdAt: "2024-07-02" },
    ];

    // 🔍 Filter state
    const [selectedOrg, setSelectedOrg] = useState<string>("");

    // 🧮 Filtered users
    const filteredUsers =
        selectedOrg === ""
            ? users
            : users.filter((user) => user.organizationId === parseInt(selectedOrg));

    return (
        <>
            <div className="p-6 space-y-6">
                {/* 🔽 Organization Filter */}
                <div className="flex gap-5 justify-between items-center">
                    <div className="shrink-0 w-full max-w-2xl">
                        <Select
                        className="w-full"
                            options={[
                                { value: "", label: "All Organizations" },
                                ...organizations.map((org) => ({
                                    value: String(org.id),
                                    label: org.name,
                                })),
                            ]}
                            placeholder="Filter by Organization"
                            onChange={setSelectedOrg}
                            defaultValue=""
                        />
                    </div>
                    <div>
                        <Button onClick={()=>{setisOpen(true)}} className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 " >
                           <PlusIcon/> Add User
                        </Button>
                    </div>
                </div>

                {/* 👥 Users Table */}
                <div className="border overflow-auto rounded-2xl">
                    <Table>
                        {/* ✅ Table Header */}
                        <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
                            <TableRow>
                                <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                    Name
                                </TableCell>
                                <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                    Email
                                </TableCell>
                                <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                    Organization
                                </TableCell>
                                <TableCell isHeader className="px-5 text-start py-3 font-medium text-sm text-gray-600 dark:text-gray-400">
                                    Created At
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-sm text-gray-600 text-right dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* ✅ Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {filteredUsers.map((user, idx) => {
                                const orgName = organizations.find((o) => o.id === user.organizationId)?.name || "-";
                                return (
                                    <TableRow
                                        key={user.id}
                                        className={`transition-colors ${idx % 2 === 0
                                                ? "bg-white dark:bg-transparent"
                                                : "bg-gray-50/50 dark:bg-white/[0.02]"
                                            } hover:bg-gray-100/60 dark:hover:bg-white/[0.05]`}
                                    >
                                        <TableCell className="px-5 py-4 text-gray-800 font-medium dark:text-white/90">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {orgName}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
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
                                );
                            })}

                            {/* ✅ Empty State */}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        className="text-center py-6 text-gray-500 text-sm dark:text-gray-400"

                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Modal onClose={()=>{setisOpen(false)}} isOpen={isOpen} className="lg:min-w-2xl">
               <CreateUsers onClose={()=>{setisOpen(false)}}/>
            </Modal>
        </>
    );
};

export default OrganizationUsersPage;
