"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { MoreDotIcon, PlusIcon } from "@/icons";
import { Modal } from "../ui/modal";
import CreateUsers from "../CustomeForms/CreateUsers";
import Select from "../form/Select";

interface Organization {
  _id: string;
  adminUserId?: string;
  code: string;
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed password
  role: "ORG_ADMIN" | "USER" | "SUPER_ADMIN";
  organizationId?: string;
  isActive?: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
}

interface OrganizationListProps {
  organizations: Organization[];
  users: User[]; // ✅ renamed to plural for clarity
}

const UsersData: React.FC<OrganizationListProps> = ({
  organizations,
  users,
}) => {
  const [isOpen, setisOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  console.log(users);
  const filteredUsers =
    selectedOrg === ""
      ? users
      : users.filter((user) => user.organizationId === selectedOrg);

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-2xl">Users</h1>
        <div className="shrink-0 w-full max-w-2xl">
          <Select
            className="w-full"
            options={[
              { value: "", label: "All Organizations" },
              ...organizations.map((organizations) => ({
                value: String(organizations._id),
                label: organizations.name,
              })),
            ]}
            placeholder="Filter by Organization"
            onChange={setSelectedOrg}
            defaultValue=""
          />
        </div>
        <Button
          className="p-2"
          onClick={() => {
            setisOpen(true);
          }}
        >
          <PlusIcon />
          Add User
        </Button>
      </div>
      <div className="overflow-auto border rounded-2xl">
        <Table>
          {/* ✅ Table Header */}
          <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Organization ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 text-start py-3 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Updated At
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ✅ Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredUsers.length == 0 ? (
              <p></p>
            ) : (
              filteredUsers.map((user, index) => {
                if (user.role === "SUPER_ADMIN") return;
                return (
                  <TableRow
                    key={user._id}
                    className={`transition-colors ${
                      index % 2 === 0
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
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {user.role.replace("_", " ").toLowerCase()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.organizationId ?? "_"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(
                        user.updatedAt || user.createdAt
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <button className=" p-1  rounded-md  border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-200 active:border-b-500 focus:outline-none focus:ring-2 focus:ring-gray-300 ">
                        <MoreDotIcon />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}{" "}
            {users.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6 text-gray-500 text-sm dark:text-gray-400">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal onClose={() => {}} isOpen={isOpen} className="lg:min-w-2xl">
        <CreateUsers
          onClose={() => {
            setisOpen(false);
          }}
          organization={organizations}
        />
      </Modal>
    </>
  );
};

export default UsersData;
